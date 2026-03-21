"""
REST API for Threat Modeling Tool
FastAPI endpoints with API key authentication
"""

from fastapi import FastAPI, Depends, HTTPException, status, Header, Request, Response
from fastapi.security import APIKeyHeader, OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, PlainTextResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field, validator
from datetime import datetime, timedelta
import anthropic
import os
import secrets
import logging
from pathlib import Path

# Configure logger
logger = logging.getLogger(__name__)

from models import (
    Organization, User, APIKey, AuditLog, APIUsageLog,
    ThreatAssessment, UsageStats
)
from database import get_db, engine
from auth import SessionManager, SAMLAuthHandler, InputValidator, get_password_hash, verify_password, create_access_token
from threat_frameworks import FRAMEWORKS, RISK_AREAS, build_comprehensive_prompt

# ── NEW: parser + interactive report generator ──────────────────────────────
from report_parser import parse_assessment_response
from interactive_report_generator import generate_html
# ────────────────────────────────────────────────────────────────────────────

# OAuth2 scheme for token-based auth
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Initialize FastAPI
app = FastAPI(
    title="AI Threat Modeling API",
    description="Enterprise-grade threat modeling API with AI-powered analysis",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Add rate limit handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; "
        "style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; "
        "img-src 'self' data: https:; "
        "connect-src 'self';"
    )
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    if "Server" in response.headers:
        del response.headers["Server"]
    return response

# CORS middleware
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001,http://localhost:8501")
if os.getenv("ENVIRONMENT", "development").lower() == "development":
    allowed_origins = ["http://localhost:3000", "http://localhost:3001", "http://localhost:8501", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:8501"]
else:
    allowed_origins = allowed_origins_str.split(",")
    if "*" in allowed_origins:
        raise RuntimeError("CRITICAL: Wildcard CORS (*) not allowed in production!")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# API Key authentication
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


# ── Pydantic models ──────────────────────────────────────────────────────────

class ThreatModelingRequest(BaseModel):
    project_name: str = Field(..., description="Name of the project", min_length=1, max_length=255)
    project_number: Optional[str] = Field(None, description="Project number/ID", max_length=100)
    system_description: Optional[str] = Field(None, description="Description of the system to analyze", max_length=50000)
    framework: Optional[Union[str, List[str]]] = Field(None, description="Threat modeling framework(s)")
    frameworks: Optional[List[str]] = Field(None, description="List of threat modeling frameworks")
    risk_type: Optional[str] = Field(None, description="Type of risk assessment", max_length=100)
    company_name: Optional[str] = Field(None, description="Company name for report branding", max_length=255)
    additional_context: Optional[Dict[str, Any]] = Field(None, description="Additional context for analysis")
    business_criticality: Optional[str] = Field(None, description="Business criticality level")
    application_type: Optional[str] = Field(None, description="Type of application")
    deployment_model: Optional[str] = Field(None, description="Deployment model")
    environment: Optional[str] = Field(None, description="Environment (Production, Development, etc.)")
    compliance_requirements: Optional[List[str]] = Field(None, description="Compliance requirements")
    risk_focus_areas: Optional[List[str]] = Field(None, description="Risk focus areas")
    documents: Optional[List[Dict[str, Any]]] = Field(None, description="Uploaded documents")
    anthropic_api_key: Optional[str] = Field(None, description="SecureAI API key")

    @validator('project_name', 'framework')
    def sanitize_text_fields(cls, v):
        return InputValidator.sanitize_text(v, max_length=50000)

    @validator('system_description')
    def sanitize_system_description(cls, v):
        if v:
            return InputValidator.sanitize_text(v, max_length=50000)
        return v


class ThreatModelingResponse(BaseModel):
    assessment_id: int
    project_name: str
    framework: str
    status: str
    report: str
    report_html: Optional[str]
    report_metadata: Optional[Dict[str, Any]]
    created_at: datetime


class APIKeyResponse(BaseModel):
    id: int
    name: str
    key_prefix: str
    scopes: List[str]
    is_active: bool
    created_at: datetime
    expires_at: Optional[datetime]


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    role: str
    is_org_admin: bool
    organization_id: int
    created_at: datetime
    last_login: Optional[datetime]


class OrganizationResponse(BaseModel):
    id: int
    name: str
    slug: str
    max_users: int
    max_api_calls_per_month: int
    created_at: datetime


class AuditLogResponse(BaseModel):
    id: int
    user_email: Optional[str]
    action: str
    resource_type: Optional[str]
    description: Optional[str]
    status: str
    timestamp: datetime
    ip_address: Optional[str]


class UsageStatsResponse(BaseModel):
    total_assessments: int
    total_api_calls: int
    total_users: int
    active_users: int
    storage_used_gb: float
    assessments_by_framework: Optional[Dict[str, int]]
    api_calls_by_endpoint: Optional[Dict[str, int]]


# ── Startup ──────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def on_startup():
    secret = os.getenv("JWT_SECRET_KEY")
    if not secret:
        env = os.getenv("ENVIRONMENT", "development").lower()
        if env in ["production", "prod"]:
            raise RuntimeError(
                "CRITICAL: JWT_SECRET_KEY environment variable not set in production!"
            )
        else:
            import warnings
            warnings.warn("SECURITY WARNING: Using weak JWT secret in development.", UserWarning)
            secret = "dev-secret-change-me-" + secrets.token_hex(16)
    SessionManager.init_secret_key(secret)


# ── Auth dependencies ────────────────────────────────────────────────────────

async def get_current_api_key(
    api_key: str = Depends(api_key_header),
    db: Session = Depends(get_db)
) -> APIKey:
    if not api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="API key is missing")
    key_hash = APIKey.hash_key(api_key)
    db_api_key = db.query(APIKey).filter(APIKey.key_hash == key_hash, APIKey.is_active == True).first()
    if not db_api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")
    if db_api_key.expires_at and db_api_key.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="API key has expired")
    db_api_key.last_used_at = datetime.utcnow()
    db.commit()
    return db_api_key


async def get_current_user(
    api_key: APIKey = Depends(get_current_api_key),
    db: Session = Depends(get_db)
) -> User:
    user = db.query(User).filter(User.id == api_key.user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")
    return user


def require_scope(required_scope: str):
    def check_scope(api_key: APIKey = Depends(get_current_api_key)):
        if not api_key.scopes or required_scope not in api_key.scopes:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"API key does not have required scope: {required_scope}")
        return api_key
    return check_scope


async def log_api_usage(request: Request, api_key: APIKey, status_code: int, response_time_ms: int, db: Session):
    usage_log = APIUsageLog(
        api_key_id=api_key.id,
        endpoint=str(request.url.path),
        method=request.method,
        status_code=status_code,
        response_time_ms=response_time_ms,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent")
    )
    db.add(usage_log)
    db.commit()


# ── NEW: parse + generate helper ─────────────────────────────────────────────

def _parse_and_generate(raw_report: str, project_name: str, frameworks: list, risk_focus_areas: list):
    """
    Parse Claude's raw response into structured data + interactive HTML.
    Never raises — returns safe fallbacks on any error.
    """
    try:
        structured_data, markdown_body = parse_assessment_response(
            raw_response=raw_report,
            project_name=project_name,
            frameworks=frameworks,
            risk_areas=risk_focus_areas,
        )
        interactive_html = generate_html(structured_data, project_name)
        return structured_data, markdown_body, interactive_html
    except Exception as parse_err:
        logger.warning(f"⚠️ Report parsing/generation failed: {parse_err} — using raw report")
        return {}, raw_report, None

# ─────────────────────────────────────────────────────────────────────────────


# ── Health ───────────────────────────────────────────────────────────────────

@app.get("/health")
async def simple_health_check():
    return {"status": "healthy"}


@app.get("/api/health")
@limiter.limit("60/minute")
async def health_check(request: Request):
    deps = {"PyPDF2": False, "python-docx": False, "openpyxl": False, "pytesseract": False, "PIL": False}
    try:
        import PyPDF2; deps["PyPDF2"] = True
    except ImportError: pass
    try:
        import docx; deps["python-docx"] = True
    except ImportError: pass
    try:
        import openpyxl; deps["openpyxl"] = True
    except ImportError: pass
    try:
        import pytesseract; deps["pytesseract"] = True
    except ImportError: pass
    try:
        from PIL import Image; deps["PIL"] = True
    except ImportError: pass
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "file_processing_dependencies": deps,
        "file_processor_available": FILE_PROCESSOR_AVAILABLE
    }


# ── Auth endpoints ───────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str

class Token(BaseModel):
    access_token: str
    token_type: str

@app.post("/users/register")
async def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    try:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        default_org = db.query(Organization).filter(Organization.slug == "default").first()
        if not default_org:
            default_org = Organization(name="Default Organization", slug="default", max_users=100, max_api_calls_per_month=10000)
            db.add(default_org)
            db.commit()
            db.refresh(default_org)
        username = user_data.email.split('@')[0]
        counter = 1
        original_username = username
        while db.query(User).filter(User.username == username).first():
            username = f"{original_username}{counter}"
            counter += 1
        new_user = User(
            email=user_data.email,
            username=username,
            password_hash=get_password_hash(user_data.password),
            full_name=user_data.full_name,
            role="user",
            is_active=True,
            organization_id=default_org.id
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "User created successfully", "user_id": new_user.id}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Registration error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Registration failed: {str(e)}")

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user_from_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    import jwt
    from jwt import PyJWTError
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user_from_token)):
    return current_user


# ── Main threat assessment endpoint ─────────────────────────────────────────

@app.post("/api/v1/threat-modeling", response_model=ThreatModelingResponse)
@limiter.limit("10/minute")
async def create_threat_assessment(
    request: Request,
    threat_request: ThreatModelingRequest,
    user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    start_time = datetime.utcnow()
    logger.info(f"🚀 Starting threat assessment for user {user.email} - Project: {threat_request.project_name}")

    try:
        if not threat_request.project_name or len(threat_request.project_name) < 2:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Project name is required (minimum 2 characters)")

        anthropic_api_key = threat_request.anthropic_api_key or os.getenv("ANTHROPIC_API_KEY")
        if not anthropic_api_key:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="SecureAI API key is required. Please add it in Settings.")
        if not anthropic_api_key.startswith("sk-ant-api"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid API key format.")

        try:
            client = anthropic.Anthropic(api_key=anthropic_api_key)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Failed to initialize AI client: {str(e)}")

        # Framework selection
        frameworks = []
        if threat_request.frameworks and len(threat_request.frameworks) > 0:
            frameworks = [threat_request.frameworks[0]]
        elif threat_request.framework:
            if isinstance(threat_request.framework, list):
                frameworks = [threat_request.framework[0]]
            else:
                frameworks = [threat_request.framework]
        else:
            frameworks = ['MITRE ATT&CK']

        business_criticality = threat_request.business_criticality or 'High'
        application_type = threat_request.application_type or 'Web Application'
        deployment_model = threat_request.deployment_model or 'Cloud'
        environment = threat_request.environment or 'Production'
        compliance_requirements = threat_request.compliance_requirements or []
        risk_focus_areas = threat_request.risk_focus_areas or ['Infrastructure Risk', 'Data Security Risk']

        # Document processing
        documents_content = ""
        image_content = []
        doc_metadata = {}

        if threat_request.documents and len(threat_request.documents) > 0:
            logger.info(f"📄 Processing {len(threat_request.documents)} documents...")
            try:
                files_data = []
                for doc in threat_request.documents:
                    doc_name = doc.get('name', 'Untitled Document')
                    doc_content = doc.get('content', '')
                    file_extension = doc_name.lower().split('.')[-1] if '.' in doc_name else ''
                    is_image = file_extension in ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp']
                    if is_image and isinstance(doc_content, str):
                        content_to_process = doc_content
                    elif isinstance(doc_content, str):
                        content_to_process = doc_content.encode('utf-8')
                    else:
                        content_to_process = doc_content
                    files_data.append({'name': doc_name, 'content': content_to_process})

                from document_analyzer import prepare_documents_multi_pass
                documents_content, image_content, doc_metadata = prepare_documents_multi_pass(
                    client=client,
                    files_data=files_data,
                    project_name=threat_request.project_name,
                    application_type=application_type
                )
                processing_mode = doc_metadata.get('processing_mode', 'single_pass')
                logger.info(f"✅ Document processing complete ({processing_mode})")
            except ImportError as ie:
                logger.warning(f"Document analyzer not available ({ie}), using simple concatenation")
                for doc in threat_request.documents:
                    doc_name = doc.get('name', 'Untitled Document')
                    doc_content = doc.get('content', '')
                    documents_content += f"\n\n### {doc_name}\n{doc_content}"

        if not documents_content:
            documents_content = threat_request.system_description or "No system description provided."

        doc_chars = len(documents_content)
        doc_tokens_estimate = doc_chars // 4
        logger.info(f"📄 Documents total: {doc_chars:,} characters (~{doc_tokens_estimate:,} tokens)")
        logger.info(f"🎯 Framework: {frameworks[0] if frameworks else 'None'}")
        logger.info(f"🔍 Risk areas: {len(risk_focus_areas)} selected")

        project_info = {
            'name': threat_request.project_name,
            'number': threat_request.project_number or 'N/A',
            'app_type': application_type,
            'deployment': deployment_model,
            'criticality': business_criticality,
            'compliance': compliance_requirements,
            'environment': environment
        }

        assessment_date = datetime.utcnow().strftime('%B %d, %Y at %I:%M %p UTC')

        prompt = build_comprehensive_prompt(
            project_info=project_info,
            documents_content=documents_content,
            frameworks=frameworks,
            risk_areas=risk_focus_areas,
            assessment_date=assessment_date
        )

        prompt_chars = len(prompt)
        logger.info(f"📝 Final prompt: {prompt_chars:,} characters (~{prompt_chars//4:,} tokens)")

        # Build message content
        if image_content:
            logger.info(f"🎨 Using Vision API with {len(image_content)} images")
            message_content = [{"type": "text", "text": prompt}]
            for img in image_content:
                message_content.append(img['data'])
            message_content.append({
                "type": "text",
                "text": "\n\n**IMPORTANT**: Analyse ALL uploaded images and incorporate visual analysis into the threat assessment."
            })
        else:
            message_content = prompt

        # Call Claude
        try:
            message = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=16000,
                temperature=0,
                messages=[{"role": "user", "content": message_content}]
            )
            report = message.content[0].text
        except anthropic.AuthenticationError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired API key. Please get a new key from console.anthropic.com/settings/keys."
            )
        except anthropic.APIError as api_error:
            error_msg = str(api_error).lower()
            logger.error(f"Claude API error: {api_error}")
            if 'image' in error_msg or 'could not process' in error_msg:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to process uploaded images. Please ensure images are valid PNG/JPEG files.")
            if 'too long' in error_msg or 'token' in error_msg or 'maximum' in error_msg:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Your uploaded documents are very large. Please try removing some files or uploading smaller documents.")
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"AI service error. Please try again.")
        except Exception as ai_error:
            logger.error(f"Unexpected error during assessment: {ai_error}")
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Unable to generate threat assessment. Please try again.")

        # ── Parse structured data + generate interactive HTML ──────────────
        structured_data, markdown_body, interactive_html = _parse_and_generate(
            raw_report=report,
            project_name=threat_request.project_name,
            frameworks=frameworks,
            risk_focus_areas=risk_focus_areas,
        )

        # Store clean markdown (JSON block stripped) — what PDF generator reads
        clean_report = markdown_body if markdown_body else report

        # Risk counts — from structured data if available, else scan text
        if structured_data.get("findings_by_severity"):
            sev = structured_data["findings_by_severity"]
            critical_count = sev.get("CRITICAL", 0)
            high_count = sev.get("HIGH", 0)
            medium_count = sev.get("MEDIUM", 0)
        else:
            report_upper = report.upper()
            critical_count = report_upper.count("CRITICAL")
            high_count = report_upper.count("HIGH")
            medium_count = report_upper.count("MEDIUM")

        framework_str = " + ".join(frameworks)

        assessment = ThreatAssessment(
            organization_id=user.organization_id,
            user_id=user.id,
            project_name=threat_request.project_name,
            project_number=threat_request.project_number,
            framework=framework_str,
            risk_type=', '.join(risk_focus_areas[:3]) if risk_focus_areas else None,
            system_description=documents_content[:500] if documents_content else None,
            assessment_report=clean_report,           # Clean markdown → PDF generator
            report_html=interactive_html or report,   # Interactive HTML → served directly
            status="completed",
            critical_count=critical_count,
            high_count=high_count,
            medium_count=medium_count,
            report_meta={
                "frameworks": frameworks,
                "risk_areas": risk_focus_areas,
                "business_criticality": business_criticality,
                "application_type": application_type,
                "deployment_model": deployment_model,
                "environment": environment,
                "compliance_requirements": compliance_requirements,
                "generated_via": "API",
                "model": "claude-sonnet-4-20250514",
                "assessment_date": assessment_date,
                "processing_mode": doc_metadata.get('processing_mode', 'single_pass'),
                "map_api_calls": doc_metadata.get('map_api_calls', 0),
                "compression_ratio": doc_metadata.get('compression_ratio', 'N/A'),
                # Structured findings — feeds interactive report + React summary
                "structured": structured_data,
                "has_interactive_report": bool(interactive_html),
                "total_findings": structured_data.get("total_findings", 0),
                "overall_risk_rating": structured_data.get("overall_risk_rating", "HIGH"),
            }
        )
        # ──────────────────────────────────────────────────────────────────

        db.add(assessment)

        audit_log = AuditLog(
            user_id=user.id,
            user_email=user.email,
            organization_id=user.organization_id,
            action="threat_assessment.create",
            resource_type="ThreatAssessment",
            resource_id=assessment.id,
            description=f"Created threat assessment via API: {threat_request.project_name}",
            status="success",
            metadata={"frameworks": frameworks, "risk_areas": risk_focus_areas},
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )
        db.add(audit_log)
        db.commit()
        db.refresh(assessment)

        response_time = int((datetime.utcnow() - start_time).total_seconds() * 1000)
        logger.info(f"✅ Assessment completed for {threat_request.project_name} - {response_time/1000:.2f}s")

        return ThreatModelingResponse(
            assessment_id=assessment.id,
            project_name=assessment.project_name,
            framework=assessment.framework,
            status=assessment.status,
            report=assessment.assessment_report,
            report_html=assessment.report_html,
            report_metadata=assessment.report_meta or {},
            created_at=assessment.created_at
        )

    except HTTPException:
        raise
    except Exception as e:
        audit_log = AuditLog(
            user_id=user.id,
            user_email=user.email,
            organization_id=user.organization_id,
            action="threat_assessment.create",
            resource_type="ThreatAssessment",
            description="Failed to create threat assessment via API",
            status="error",
            error_message=str(e),
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )
        db.add(audit_log)
        db.commit()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to create threat assessment: {str(e)}")


# ── Report retrieval endpoints ───────────────────────────────────────────────

@app.get("/reports")
async def get_reports(
    user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    assessments = db.query(ThreatAssessment).filter(
        ThreatAssessment.organization_id == user.organization_id
    ).order_by(ThreatAssessment.created_at.desc()).all()

    projects = {}
    for a in assessments:
        project_key = f"{a.project_name}_{a.project_number or 'no_number'}"
        if project_key not in projects:
            projects[project_key] = {"project_name": a.project_name, "project_number": a.project_number, "versions": []}
        projects[project_key]["versions"].append({
            "id": a.id,
            "project_name": a.project_name,
            "project_number": a.project_number,
            "framework": a.framework,
            "created_at": a.created_at.isoformat(),
            "status": a.status,
            "critical_count": a.critical_count or 0,
            "high_count": a.high_count or 0,
            "medium_count": a.medium_count or 0,
            "version": len(projects[project_key]["versions"]) + 1
        })
    return {"projects": list(projects.values())}


@app.get("/reports/{assessment_id}/pdf")
async def download_pdf(
    assessment_id: int,
    user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    from fastapi.responses import Response
    from pdf_generator import generate_pdf

    assessment = db.query(ThreatAssessment).filter(
        ThreatAssessment.id == assessment_id,
        ThreatAssessment.organization_id == user.organization_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")

    pdf_bytes = generate_pdf(assessment.assessment_report, assessment.project_name, assessment.framework)
    date_str = assessment.created_at.strftime('%Y%m%d')
    filename = f"Threat_Assessment_{assessment.project_name.replace(' ', '_')}_{date_str}.pdf"
    return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={filename}"})


@app.get("/reports/{assessment_id}")
async def get_report_details(
    assessment_id: int,
    user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    assessment = db.query(ThreatAssessment).filter(
        ThreatAssessment.id == assessment_id,
        ThreatAssessment.organization_id == user.organization_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
    return {
        "id": assessment.id,
        "project_name": assessment.project_name,
        "project_number": assessment.project_number,
        "framework": assessment.framework,
        "created_at": assessment.created_at.isoformat(),
        "status": assessment.status,
        "report": assessment.assessment_report,
        "critical_count": assessment.critical_count or 0,
        "high_count": assessment.high_count or 0,
        "medium_count": assessment.medium_count or 0,
        "metadata": assessment.report_meta
    }


# ── NEW: Interactive report + action plan endpoints ──────────────────────────

@app.get("/reports/{assessment_id}/interactive")
async def get_interactive_report(
    assessment_id: int,
    user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """
    Serve the interactive HTML report.
    - New assessments: serve stored report_html instantly
    - Old assessments: regenerate from markdown on-the-fly, then cache it
    """
    from fastapi.responses import HTMLResponse

    assessment = db.query(ThreatAssessment).filter(
        ThreatAssessment.id == assessment_id,
        ThreatAssessment.organization_id == user.organization_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    # Case 1: stored interactive HTML (new assessments)
    stored = assessment.report_html
    if stored and stored.strip().startswith("<!DOCTYPE html"):
        return HTMLResponse(content=stored)

    # Case 2: structured data in report_meta — regenerate HTML
    meta = assessment.report_meta or {}
    structured = meta.get("structured")
    if structured and structured.get("all_findings"):
        try:
            html_content = generate_html(structured, assessment.project_name)
            assessment.report_html = html_content
            db.commit()
            return HTMLResponse(content=html_content)
        except Exception as e:
            logger.warning(f"Could not regenerate interactive HTML: {e}")

    # Case 3: parse markdown on-the-fly (old assessments)
    if assessment.assessment_report:
        try:
            structured_data, _, html_content = _parse_and_generate(
                raw_report=assessment.assessment_report,
                project_name=assessment.project_name,
                frameworks=meta.get("frameworks", [assessment.framework]),
                risk_focus_areas=meta.get("risk_areas", []),
            )
            if html_content:
                assessment.report_html = html_content
                meta["structured"] = structured_data
                meta["has_interactive_report"] = True
                assessment.report_meta = meta
                db.commit()
                return HTMLResponse(content=html_content)
        except Exception as e:
            logger.warning(f"On-the-fly generation failed: {e}")

    raise HTTPException(status_code=503, detail="Interactive report unavailable. Please regenerate the assessment.")


@app.get("/reports/{assessment_id}/structured")
async def get_structured_data(
    assessment_id: int,
    user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Return structured JSON findings for the React frontend summary view."""
    assessment = db.query(ThreatAssessment).filter(
        ThreatAssessment.id == assessment_id,
        ThreatAssessment.organization_id == user.organization_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    meta = assessment.report_meta or {}
    structured = meta.get("structured")

    if not structured and assessment.assessment_report:
        try:
            structured, _, _ = _parse_and_generate(
                raw_report=assessment.assessment_report,
                project_name=assessment.project_name,
                frameworks=meta.get("frameworks", [assessment.framework]),
                risk_focus_areas=meta.get("risk_areas", []),
            )
            if structured:
                meta["structured"] = structured
                assessment.report_meta = meta
                db.commit()
        except Exception as e:
            logger.warning(f"Structured extraction failed: {e}")

    return {
        "assessment_id": assessment_id,
        "project_name": assessment.project_name,
        "framework": assessment.framework,
        "created_at": assessment.created_at.isoformat(),
        "structured": structured or {},
        "has_interactive_report": bool(
            assessment.report_html and assessment.report_html.strip().startswith("<!DOCTYPE html")
        ),
    }


@app.post("/reports/{assessment_id}/action-plan")
async def save_action_plan(
    assessment_id: int,
    action_plan_data: dict,
    user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Save action plan items for an assessment."""
    assessment = db.query(ThreatAssessment).filter(
        ThreatAssessment.id == assessment_id,
        ThreatAssessment.organization_id == user.organization_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    items = action_plan_data.get("items", [])
    if not isinstance(items, list):
        raise HTTPException(status_code=400, detail="'items' must be a list")

    meta = assessment.report_meta or {}
    meta["action_plan"] = items
    meta["action_plan_updated_at"] = datetime.utcnow().isoformat()
    assessment.report_meta = meta
    db.commit()

    audit = AuditLog(
        user_id=user.id,
        user_email=user.email,
        organization_id=user.organization_id,
        action="action_plan.save",
        resource_type="ThreatAssessment",
        resource_id=assessment.id,
        description=f"Saved action plan: {len(items)} items for {assessment.project_name}",
        status="success",
    )
    db.add(audit)
    db.commit()

    return {"message": "Action plan saved", "assessment_id": assessment_id, "items_count": len(items)}


@app.get("/reports/{assessment_id}/action-plan")
async def get_action_plan(
    assessment_id: int,
    user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Retrieve saved action plan for an assessment."""
    assessment = db.query(ThreatAssessment).filter(
        ThreatAssessment.id == assessment_id,
        ThreatAssessment.organization_id == user.organization_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    meta = assessment.report_meta or {}
    return {
        "assessment_id": assessment_id,
        "project_name": assessment.project_name,
        "items": meta.get("action_plan", []),
        "updated_at": meta.get("action_plan_updated_at"),
    }

# ─────────────────────────────────────────────────────────────────────────────


# ── Legacy API v1 endpoints ──────────────────────────────────────────────────

@app.get("/api/v1/threat-modeling/{assessment_id}", response_model=ThreatModelingResponse)
async def get_threat_assessment(
    assessment_id: int,
    user: User = Depends(get_current_user),
    api_key: APIKey = Depends(require_scope("threat_modeling:read")),
    db: Session = Depends(get_db)
):
    assessment = db.query(ThreatAssessment).filter(
        ThreatAssessment.id == assessment_id,
        ThreatAssessment.organization_id == user.organization_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Threat assessment not found")
    return ThreatModelingResponse(
        assessment_id=assessment.id,
        project_name=assessment.project_name,
        framework=assessment.framework,
        status=assessment.status,
        report=assessment.assessment_report,
        report_html=assessment.report_html,
        report_metadata=assessment.report_meta,
        created_at=assessment.created_at
    )


@app.get("/api/v1/threat-modeling", response_model=List[ThreatModelingResponse])
async def list_threat_assessments(
    skip: int = 0,
    limit: int = 20,
    user: User = Depends(get_current_user),
    api_key: APIKey = Depends(require_scope("threat_modeling:read")),
    db: Session = Depends(get_db)
):
    assessments = db.query(ThreatAssessment).filter(
        ThreatAssessment.organization_id == user.organization_id
    ).order_by(ThreatAssessment.created_at.desc()).offset(skip).limit(limit).all()
    return [
        ThreatModelingResponse(
            assessment_id=a.id,
            project_name=a.project_name,
            framework=a.framework,
            status=a.status,
            report=a.assessment_report,
            report_html=a.report_html,
            report_metadata=a.report_meta,
            created_at=a.created_at
        )
        for a in assessments
    ]


# ── Admin endpoints ──────────────────────────────────────────────────────────

@app.get("/api/v1/admin/users", response_model=List[UserResponse])
async def list_users(
    user: User = Depends(get_current_user),
    api_key: APIKey = Depends(require_scope("admin:users")),
    db: Session = Depends(get_db)
):
    if not user.is_org_admin and user.role != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    users = db.query(User).filter(User.organization_id == user.organization_id).all()
    return [UserResponse(id=u.id, email=u.email, username=u.username, full_name=u.full_name, role=u.role, is_org_admin=u.is_org_admin, organization_id=u.organization_id, created_at=u.created_at, last_login=u.last_login) for u in users]


@app.get("/api/v1/admin/audit-logs", response_model=List[AuditLogResponse])
async def get_audit_logs_admin(
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = None,
    user: User = Depends(get_current_user),
    api_key: APIKey = Depends(require_scope("admin:audit")),
    db: Session = Depends(get_db)
):
    if not user.is_org_admin and user.role != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    query = db.query(AuditLog).filter(AuditLog.organization_id == user.organization_id)
    if action:
        query = query.filter(AuditLog.action == action)
    logs = query.order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()
    return [AuditLogResponse(id=log.id, user_email=log.user_email, action=log.action, resource_type=log.resource_type, description=log.description, status=log.status, timestamp=log.timestamp, ip_address=log.ip_address) for log in logs]


@app.get("/api/v1/admin/usage-stats", response_model=UsageStatsResponse)
async def get_usage_stats(
    user: User = Depends(get_current_user),
    api_key: APIKey = Depends(require_scope("admin:stats")),
    db: Session = Depends(get_db)
):
    if not user.is_org_admin and user.role != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    stats = db.query(UsageStats).filter(UsageStats.organization_id == user.organization_id).order_by(UsageStats.created_at.desc()).first()
    if not stats:
        return UsageStatsResponse(total_assessments=0, total_api_calls=0, total_users=0, active_users=0, storage_used_gb=0.0, assessments_by_framework={}, api_calls_by_endpoint={})
    return UsageStatsResponse(total_assessments=stats.total_assessments, total_api_calls=stats.total_api_calls, total_users=stats.total_users, active_users=stats.active_users, storage_used_gb=stats.storage_used_gb, assessments_by_framework=stats.assessments_by_framework, api_calls_by_endpoint=stats.api_calls_by_endpoint)


# ── SAML SSO endpoints ───────────────────────────────────────────────────────

def _get_org_by_slug(db: Session, org_slug: str) -> Organization:
    org = db.query(Organization).filter(Organization.slug == org_slug).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    if not org.saml_enabled:
        raise HTTPException(status_code=400, detail="SAML not enabled for organization")
    return org


@app.get("/saml/metadata/{org_slug}", response_class=PlainTextResponse)
async def saml_metadata(org_slug: str, db: Session = Depends(get_db)):
    from onelogin.saml2.settings import OneLogin_Saml2_Settings
    org = _get_org_by_slug(db, org_slug)
    handler = SAMLAuthHandler(org)
    try:
        settings = OneLogin_Saml2_Settings(settings=handler._build_saml_settings(), sp_validation_only=True)
        metadata = settings.get_sp_metadata()
        errors = settings.validate_metadata(metadata)
        if len(errors) > 0:
            raise HTTPException(status_code=500, detail=f"SAML metadata validation errors: {', '.join(errors)}")
        return PlainTextResponse(content=metadata, media_type="application/xml")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate SAML metadata: {str(e)}")


@app.get("/saml/login/{org_slug}")
async def saml_login(org_slug: str, request: Request, db: Session = Depends(get_db)):
    org = _get_org_by_slug(db, org_slug)
    handler = SAMLAuthHandler(org)
    req_data = {
        'https': request.url.scheme == 'https',
        'http_host': request.client.host if request.client else 'localhost',
        'server_port': request.url.port or (443 if request.url.scheme == 'https' else 80),
        'script_name': request.url.path,
        'get_data': dict(request.query_params),
        'post_data': {}
    }
    redirect_url = handler.initiate_login(req_data)
    return RedirectResponse(url=redirect_url)


@app.post("/saml/acs/{org_slug}")
async def saml_acs(org_slug: str, request: Request, db: Session = Depends(get_db)):
    org = _get_org_by_slug(db, org_slug)
    handler = SAMLAuthHandler(org)
    form = await request.form()
    req_data = {
        'https': request.url.scheme == 'https',
        'http_host': request.client.host if request.client else 'localhost',
        'server_port': request.url.port or (443 if request.url.scheme == 'https' else 80),
        'script_name': request.url.path,
        'get_data': dict(request.query_params),
        'post_data': dict(form),
        'ip_address': request.client.host if request.client else None,
        'user_agent': request.headers.get('user-agent')
    }
    user = handler.process_response(req_data, db)
    if not user:
        raise HTTPException(status_code=401, detail="SAML authentication failed")
    access = SessionManager.create_access_token(user)
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:8501")
    redirect_with_token = f"{frontend_url}?token={access}"
    resp = RedirectResponse(url=redirect_with_token)
    resp.set_cookie(key="access_token", value=access, httponly=True, secure=False, samesite="lax", max_age=3600)
    return resp


@app.get("/saml/sls/{org_slug}")
@app.post("/saml/sls/{org_slug}")
async def saml_sls(org_slug: str, request: Request, db: Session = Depends(get_db)):
    from onelogin.saml2.auth import OneLogin_Saml2_Auth
    org = _get_org_by_slug(db, org_slug)
    handler = SAMLAuthHandler(org)
    if request.method == "POST":
        form = await request.form()
        post_data = dict(form)
    else:
        post_data = {}
    req_data = {
        'https': request.url.scheme == 'https',
        'http_host': request.client.host if request.client else 'localhost',
        'server_port': request.url.port or (443 if request.url.scheme == 'https' else 80),
        'script_name': request.url.path,
        'get_data': dict(request.query_params),
        'post_data': post_data
    }
    req = handler.prepare_request(req_data)
    auth = OneLogin_Saml2_Auth(req, handler.settings)
    url = auth.process_slo(delete_session_cb=lambda: None)
    errors = auth.get_errors()
    if errors:
        raise HTTPException(status_code=400, detail=f"SAML SLO error: {', '.join(errors)}")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:8501")
    resp = RedirectResponse(url=url or frontend_url)
    resp.delete_cookie("access_token")
    return resp


# ── User management endpoints ────────────────────────────────────────────────

@app.get("/api/users")
async def get_users(user: User = Depends(get_current_user_from_token), db: Session = Depends(get_db)):
    if user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    users = db.query(User).filter(User.organization_id == user.organization_id).all()
    return {"users": [{"id": u.id, "email": u.email, "username": u.username, "full_name": u.full_name or "", "role": u.role, "is_org_admin": u.is_org_admin, "is_active": u.is_active, "last_login_at": u.last_login.isoformat() if u.last_login else None, "created_at": u.created_at.isoformat()} for u in users]}


@app.patch("/api/users/{user_id}/status")
async def toggle_user_status(user_id: int, status_update: dict, user: User = Depends(get_current_user_from_token), db: Session = Depends(get_db)):
    if user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    target_user = db.query(User).filter(User.id == user_id, User.organization_id == user.organization_id).first()
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    target_user.email_verified = status_update.get('active', True)
    db.commit()
    return {"message": "User status updated successfully"}


@app.patch("/api/users/{user_id}/password")
async def reset_user_password(user_id: int, password_data: dict, user: User = Depends(get_current_user_from_token), db: Session = Depends(get_db)):
    if user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    target_user = db.query(User).filter(User.id == user_id, User.organization_id == user.organization_id).first()
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    new_password = password_data.get('password')
    if not new_password or len(new_password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 8 characters")
    target_user.password_hash = get_password_hash(new_password)
    db.commit()
    return {"message": "Password reset successfully"}


@app.patch("/api/users/{user_id}/role")
async def change_user_role(user_id: int, role_data: dict, user: User = Depends(get_current_user_from_token), db: Session = Depends(get_db)):
    if user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    target_user = db.query(User).filter(User.id == user_id, User.organization_id == user.organization_id).first()
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    new_role = role_data.get('role')
    if new_role not in ['user', 'manager', 'admin']:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
    target_user.role = new_role
    target_user.is_org_admin = (new_role == 'admin')
    db.commit()
    return {"message": "User role updated successfully"}


@app.get("/api/audit-logs")
async def get_audit_logs(user: User = Depends(get_current_user_from_token), db: Session = Depends(get_db)):
    if user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    logs = db.query(AuditLog).filter(AuditLog.organization_id == user.organization_id).order_by(AuditLog.created_at.desc()).limit(100).all()
    return {"logs": [{"id": log.id, "user_id": log.user_id, "action": log.action, "resource_type": log.resource_type, "resource_id": log.resource_id, "details": log.details, "ip_address": log.ip_address, "created_at": log.created_at.isoformat()} for log in logs]}


@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user_from_token), db: Session = Depends(get_db)):
    try:
        if current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        org_id = current_user.organization_id
        total_users = db.query(User).filter(User.organization_id == org_id).count()
        active_users = db.query(User).filter(User.organization_id == org_id, User.is_active == True).count()
        now = datetime.utcnow()
        thirty_days_ago = now - timedelta(days=30)
        seven_days_ago = now - timedelta(days=7)
        total_assessments = db.query(ThreatAssessment).filter(ThreatAssessment.organization_id == org_id).count()
        assessments_last_30d = db.query(ThreatAssessment).filter(ThreatAssessment.organization_id == org_id, ThreatAssessment.created_at >= thirty_days_ago).count()
        assessments_last_7d = db.query(ThreatAssessment).filter(ThreatAssessment.organization_id == org_id, ThreatAssessment.created_at >= seven_days_ago).count()
        from sqlalchemy import func
        framework_stats = db.query(ThreatAssessment.framework, func.count(ThreatAssessment.id).label('count')).filter(ThreatAssessment.organization_id == org_id).group_by(ThreatAssessment.framework).all()
        framework_distribution = {stat[0]: stat[1] for stat in framework_stats}
        risk_type_stats = db.query(ThreatAssessment.risk_type, func.count(ThreatAssessment.id).label('count')).filter(ThreatAssessment.organization_id == org_id, ThreatAssessment.risk_type.isnot(None)).group_by(ThreatAssessment.risk_type).all()
        risk_area_counts = {stat[0]: stat[1] for stat in risk_type_stats if stat[0]}
        recent_assessments = db.query(ThreatAssessment).filter(ThreatAssessment.organization_id == org_id).order_by(ThreatAssessment.created_at.desc()).limit(10).all()
        recent_list = []
        for assessment in recent_assessments:
            u = db.query(User).filter(User.id == assessment.user_id).first()
            recent_list.append({"id": assessment.id, "project_name": assessment.project_name, "framework": assessment.framework, "created_at": assessment.created_at.isoformat(), "user_email": u.email if u else "Unknown"})
        active_api_keys = db.query(APIKey).filter(APIKey.organization_id == org_id, APIKey.is_active == True).count()
        try:
            api_calls_this_month = db.query(APIUsageLog).filter(APIUsageLog.organization_id == org_id, APIUsageLog.timestamp >= thirty_days_ago).count()
        except Exception:
            api_calls_this_month = 0
        return {
            "users": {"total": total_users, "active": active_users, "inactive": total_users - active_users},
            "assessments": {"total": total_assessments, "last_30d": assessments_last_30d, "last_7d": assessments_last_7d},
            "frameworks": framework_distribution,
            "risk_areas": risk_area_counts,
            "recent_assessments": recent_list,
            "api": {"active_keys": active_api_keys, "calls_this_month": api_calls_this_month}
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Dashboard stats error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to load dashboard statistics: {str(e)}")


# ── File processing endpoint ─────────────────────────────────────────────────

from fastapi import UploadFile, File as FastAPIFile
try:
    from file_processor import process_file
    FILE_PROCESSOR_AVAILABLE = True
except ImportError:
    FILE_PROCESSOR_AVAILABLE = False
    logger.warning("File processor not available - dependencies may be missing")

@app.post("/api/process-file")
async def process_uploaded_file(
    file: UploadFile = FastAPIFile(...),
    user: User = Depends(get_current_user_from_token)
):
    if not FILE_PROCESSOR_AVAILABLE:
        file_extension = Path(file.filename).suffix.lower().lstrip('.')
        return {"filename": file.filename, "size": 0, "extracted_text": f"[{file_extension.upper()} Document: {file.filename}]", "char_count": 0, "estimated_tokens": 0, "fallback": True}
    try:
        content = await file.read()
        extracted_text = process_file(file.filename, content, use_vision_api=False)
        return {"filename": file.filename, "size": len(content), "extracted_text": extracted_text, "char_count": len(extracted_text), "estimated_tokens": len(extracted_text) // 4, "fallback": False}
    except Exception as e:
        logger.error(f"File processing error for {file.filename}: {e}")
        file_extension = Path(file.filename).suffix.lower().lstrip('.')
        return {"filename": file.filename, "size": 0, "extracted_text": f"[{file_extension.upper()} Document: {file.filename}]", "char_count": 0, "estimated_tokens": 0, "error": str(e), "fallback": True}


# ── Static file serving ──────────────────────────────────────────────────────

static_dir = Path(__file__).parent / "dist"
if static_dir.exists() and static_dir.is_dir():
    app.mount("/assets", StaticFiles(directory=str(static_dir / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        index_file = static_dir / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend not built. Run 'npm run build' first.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
