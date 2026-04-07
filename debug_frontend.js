// Emergency Debug Script - Run in Browser Console
// This checks what data the frontend is actually receiving

(async () => {
  const token = localStorage.getItem('authToken');
  
  // Smart assessment ID detection
  let assessmentId = null;
  const path = window.location.pathname;
  console.log('🔍 Current URL path:', path);
  
  // Try to extract from various URL patterns
  const patterns = [
    /\/reports\/view\/(\d+)/,  // /reports/view/1
    /\/reports\/(\d+)/,        // /reports/1
    /\/view\/(\d+)/,           // /view/1
    /assessment[=\/](\d+)/     // assessment=1 or assessment/1
  ];
  
  for (const pattern of patterns) {
    const match = path.match(pattern);
    if (match) {
      assessmentId = match[1];
      break;
    }
  }
  
  console.log('📍 Detected Assessment ID:', assessmentId);
  console.log('🔑 Token exists:', !!token);
  
  if (!assessmentId) {
    console.error('❌ Could not find assessment ID in URL!');
    console.log('💡 Fetching all reports...');
    
    const reportsResp = await fetch('/api/reports', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const reports = await reportsResp.json();
    console.log('📋 Available reports:', reports);
    
    if (reports.length > 0) {
      assessmentId = reports[0].id;
      console.log(`💡 Using first report ID: ${assessmentId}`);
    } else {
      console.error('❌ No reports found!');
      return;
    }
  }
  
  console.log('\n🔍 Fetching structured data for assessment', assessmentId);
  
  const response = await fetch(`/api/reports/${assessmentId}/structured`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  console.log('📦 Full Response:', data);
  
  if (data.structured) {
    console.log('\n✅ Structured Data Found:');
    console.log('- Total Findings:', data.structured.total_findings || 0);
    console.log('- All Findings Array:', (data.structured.all_findings || []).length);
    console.log('- Recommendations:', (data.structured.all_recommendations || []).length);
    console.log('- Kill Chains:', (data.structured.kill_chains || []).length);
    console.log('- Specialized Risks:', (data.structured.specialized_risks || []).length);
    console.log('- Component Analysis:', (data.structured.component_analysis || []).length);
    
    if (data.structured.specialized_risks && data.structured.specialized_risks.length > 0) {
      console.log('\n🎯 Specialized Risks Details:');
      data.structured.specialized_risks.forEach((risk, i) => {
        console.log(`  ${i + 1}. ${risk.domain} (${risk.grade}) - ${risk.findings.length} findings`);
      });
    } else {
      console.warn('⚠️ No specialized_risks in data!');
    }
    
    if (data.structured.component_analysis && data.structured.component_analysis.length > 0) {
      console.log('\n📦 Component Analysis Details:');
      data.structured.component_analysis.forEach((comp, i) => {
        console.log(`  ${i + 1}. ${comp.component} (${comp.risk_level})`);
      });
    } else {
      console.warn('⚠️ No component_analysis in data!');
    }
    
    // Test reprocess endpoint
    console.log('\n🔧 Testing reprocess endpoint...');
    try {
      const reprocessResp = await fetch(`/api/reports/${assessmentId}/reprocess`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (reprocessResp.ok) {
        const reprocessData = await reprocessResp.json();
        console.log('✅ Reprocess endpoint available:', reprocessData);
      } else {
        console.error('❌ Reprocess endpoint returned status:', reprocessResp.status, reprocessResp.statusText);
        const errorText = await reprocessResp.text();
        console.error('Error response:', errorText);
      }
    } catch (err) {
      console.error('❌ Reprocess endpoint error:', err);
    }
    
  } else {
    console.error('❌ No structured data in response!');
  }
  
  console.log(`\n💡 To reprocess manually, run:\nfetch('/api/reports/${assessmentId}/reprocess', {method:'POST',headers:{'Authorization':'Bearer ${token}','Content-Type':'application/json'}}).then(r=>r.json()).then(console.log)`);
})();
