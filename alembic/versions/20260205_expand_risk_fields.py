"""Expand risk_type and framework column sizes

Revision ID: 20260205_expand_risk_fields
Revises: 20260131_add_performance_indexes
Create Date: 2026-02-05 01:30:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260205_expand_risk_fields'
down_revision = '20260131_add_performance_indexes'
branch_labels = None
depends_on = None


def upgrade():
    # Expand framework column from 50 to 200 characters (for multiple frameworks)
    op.alter_column('threat_assessments', 'framework',
                    existing_type=sa.String(50),
                    type_=sa.String(200),
                    existing_nullable=False)
    
    # Expand risk_type column from 50 to 500 characters (for multiple risk areas)
    op.alter_column('threat_assessments', 'risk_type',
                    existing_type=sa.String(50),
                    type_=sa.String(500),
                    existing_nullable=True)


def downgrade():
    # Revert to original sizes
    op.alter_column('threat_assessments', 'framework',
                    existing_type=sa.String(200),
                    type_=sa.String(50),
                    existing_nullable=False)
    
    op.alter_column('threat_assessments', 'risk_type',
                    existing_type=sa.String(500),
                    type_=sa.String(50),
                    existing_nullable=True)
