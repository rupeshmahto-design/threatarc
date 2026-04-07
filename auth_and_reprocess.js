// Complete Auth & Reprocess Script
// Run this in browser console on the ThreatArc dashboard

(async () => {
  console.log('🔐 Checking authentication...');
  
  // Try both possible token keys
  let token = localStorage.getItem('authToken') || localStorage.getItem('token');
  console.log('Token exists:', !!token);
  console.log('Token key:', localStorage.getItem('authToken') ? 'authToken' : 'token');
  
  if (!token) {
    console.error('❌ No token found! Please log in first.');
    console.log('💡 Go to the login page and sign in, then run this script again.');
    return;
  }
  
  // Test if token is valid
  try {
    const testResp = await fetch('/reports', {
      headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}
    });
    
    if (testResp.status === 401) {
      console.error('❌ Token is invalid or expired!');
      console.log('💡 Please log out and log back in, then run this script again.');
      console.log('Or manually set token: localStorage.setItem("authToken", "YOUR_TOKEN_HERE")');
      return;
    }
    
    if (!testResp.ok) {
      console.error('❌ API returned error:', testResp.status, testResp.statusText);
      return;
    }
    
    console.log('✅ Authentication valid!');
    
  } catch (err) {
    console.error('❌ Network error:', err);
    return;
  }
  
  // Smart assessment ID detection
  let assessmentId = null;
  const path = window.location.pathname;
  console.log('🔍 Current URL path:', path);
  
  const patterns = [
    /\/reports\/view\/(\d+)/,
    /\/reports\/(\d+)/,
    /\/view\/(\d+)/,
    /report[=\/](\d+)/,
    /assessment[=\/](\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = path.match(pattern);
    if (match) {
      assessmentId = match[1];
      break;
    }
  }
  
  console.log('📍 Detected Assessment ID:', assessmentId);
  
  if (!assessmentId) {
    console.log('💡 Fetching all reports...');
    const reportsResp = await fetch('/reports', {
      headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}
    });
    const reports = await reportsResp.json();
    console.log('Available reports:', reports);
    
    if (reports.length > 0) {
      assessmentId = reports[0].id;
      console.log(`✅ Using first report ID: ${assessmentId} (${reports[0].project_name})`);
    } else {
      console.error('❌ No reports found!');
      return;
    }
  }
  
  // Fetch current data
  console.log(`\n🔍 Fetching structured data for assessment ${assessmentId}...`);
  const response = await fetch(`/reports/${assessmentId}/structured`, {
    headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}
  });
  
  const data = await response.json();
  console.log('📦 Current data in database:');
  console.log('  Total Findings:', data.structured?.total_findings || 0);
  console.log('  Findings Array Length:', (data.structured?.all_findings || []).length);
  console.log('  Specialized Risks:', (data.structured?.specialized_risks || []).length);
  console.log('  Components:', (data.structured?.component_analysis || []).length);
  console.log('  Kill Chains:', (data.structured?.kill_chains || []).length);
  console.log('  Recommendations:', (data.structured?.all_recommendations || []).length);
  
  if (data.structured?.specialized_risks && data.structured.specialized_risks.length > 0) {
    console.log('\n🎯 Specialized Risks:');
    data.structured.specialized_risks.forEach((risk, i) => {
      console.log(`  ${i + 1}. ${risk.domain} - Grade: ${risk.grade} - ${risk.findings.length} findings`);
    });
  }
  
  if (data.structured?.component_analysis && data.structured.component_analysis.length > 0) {
    console.log('\n📦 Components:');
    data.structured.component_analysis.forEach((comp, i) => {
      console.log(`  ${i + 1}. ${comp.component} - Risk: ${comp.risk_level}`);
    });
  }
  
  // Prompt to reprocess
  console.log('\n' + '='.repeat(60));
  const shouldReprocess = confirm(
    `Current data:\n` +
    `• Findings: ${data.structured?.total_findings || 0}\n` +
    `• Specialized Risks: ${(data.structured?.specialized_risks || []).length}\n` +
    `• Components: ${(data.structured?.component_analysis || []).length}\n\n` +
    `Reprocess to extract with latest extraction logic?\n` +
    `(This will update the database with T-AGE-### threat IDs)`
  );
  
  if (!shouldReprocess) {
    console.log('⏸️ Reprocess cancelled by user.');
    return;
  }
  
  // Reprocess with new extraction logic
  console.log('\n🔄 Reprocessing with latest extraction logic...');
  const reprocessResp = await fetch(`/reports/${assessmentId}/reprocess`, {
    method: 'POST',
    headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}
  });
  
  if (!reprocessResp.ok) {
    console.error('❌ Reprocess failed:', reprocessResp.status, reprocessResp.statusText);
    const errorText = await reprocessResp.text();
    console.error('Error:', errorText);
    return;
  }
  
  const result = await reprocessResp.json();
  console.log('✅ Reprocess complete!');
  console.log('📊 Results:', result);
  
  if (result.structured_summary) {
    const summary = result.structured_summary;
    alert(
      `✅ Reprocessing Complete!\n\n` +
      `📊 Extracted Data:\n` +
      `• Total Findings: ${summary.total_findings}\n` +
      `• Specialized Risks: ${summary.specialized_risks}\n` +
      `• Components: ${summary.component_analysis}\n` +
      `• Kill Chains: ${summary.kill_chains}\n` +
      `• Recommendations: ${summary.recommendations}\n\n` +
      `Page will reload in 2 seconds...`
    );
    setTimeout(() => window.location.reload(), 2000);
  } else {
    console.error('❌ No structured_summary in response:', result);
    alert('⚠️ Reprocessing completed but data structure unexpected. Check console.');
  }
})();
