// Emergency Debug Script - Run in Browser Console
// This checks what data the frontend is actually receiving

(async () => {
  const token = localStorage.getItem('authToken');
  const assessmentId = window.location.pathname.split('/').pop();
  
  console.log('🔍 Fetching assessment data...');
  console.log('Assessment ID:', assessmentId);
  console.log('Token exists:', !!token);
  
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
  } else {
    console.error('❌ No structured data in response!');
  }
})();
