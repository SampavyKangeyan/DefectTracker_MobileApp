/**
 * Test utility for Defect Severity Index API integration
 * This file can be used to test the API integration manually
 */

import DefectSeverityIndexService from '../services/defectSeverityIndex';

/**
 * Test function to verify the Defect Severity Index API integration
 * @param projectId - The project ID to test with
 */
export const testDefectSeverityIndexAPI = async (projectId: number = 1) => {
  console.log('🧪 Testing Defect Severity Index API Integration...');
  console.log(`📊 Project ID: ${projectId}`);
  
  try {
    // Test the basic API call
    console.log('📡 Making API request...');
    const data = await DefectSeverityIndexService.getDefectSeverityIndex(projectId);
    
    console.log('✅ API Response received:');
    console.log('📈 DSI Percentage:', data.dsiPercentage + '%');
    console.log('🎯 Interpretation:', data.interpretation);
    console.log('🏢 Project ID:', data.projectId);
    console.log('🐛 Total Defects:', data.totalDefects);
    console.log('📊 Actual Score:', data.actualSeverityScore);
    console.log('📊 Max Score:', data.maximumSeverityScore);
    
    // Test the utility methods
    const riskInfo = DefectSeverityIndexService.getRiskLevel(data.dsiPercentage);
    console.log('🔍 Risk Analysis:');
    console.log('  Level:', riskInfo.level);
    console.log('  Color:', riskInfo.color);
    console.log('  Description:', riskInfo.description);
    
    const interpretation = DefectSeverityIndexService.getInterpretation(data.dsiPercentage);
    console.log('📝 Custom Interpretation:', interpretation);
    
    const efficiency = DefectSeverityIndexService.calculateEfficiency(
      data.actualSeverityScore, 
      data.maximumSeverityScore
    );
    console.log('⚡ Efficiency:', efficiency + '%');
    
    const formatted = DefectSeverityIndexService.formatForDisplay(data);
    console.log('🎨 Formatted Display:');
    console.log('  Percentage:', formatted.percentage);
    console.log('  Efficiency:', formatted.efficiency);
    console.log('  Risk Level:', formatted.riskLevel.level);
    console.log('  Summary:', formatted.summary);
    
    return data;
  } catch (error: any) {
    console.error('❌ API Test Failed:');
    console.error('Error:', error.message);
    throw error;
  }
};

/**
 * Test function with loading state management
 */
export const testDefectSeverityIndexWithState = async (projectId: number = 1) => {
  console.log('🧪 Testing Defect Severity Index API with State Management...');
  
  try {
    const result = await DefectSeverityIndexService.getDefectSeverityIndexWithState(projectId);
    
    console.log('📊 Result:');
    console.log('  Data:', result.data);
    console.log('  Error:', result.error);
    console.log('  Loading:', result.isLoading);
    
    return result;
  } catch (error: any) {
    console.error('❌ State Test Failed:', error.message);
    throw error;
  }
};

/**
 * Test error handling with invalid parameters
 */
export const testErrorHandling = async () => {
  console.log('🧪 Testing Error Handling...');
  
  // Test invalid project ID
  try {
    await DefectSeverityIndexService.getDefectSeverityIndex(-1);
    console.log('❌ Should have thrown error for invalid project ID');
  } catch (error: any) {
    console.log('✅ Correctly caught invalid project ID error:', error.message);
  }
  
  // Test zero project ID
  try {
    await DefectSeverityIndexService.getDefectSeverityIndex(0);
    console.log('❌ Should have thrown error for zero project ID');
  } catch (error: any) {
    console.log('✅ Correctly caught zero project ID error:', error.message);
  }
  
  // Test non-existent project (should return 400 - no defects found)
  try {
    await DefectSeverityIndexService.getDefectSeverityIndex(99999);
    console.log('❌ Should have thrown error for non-existent project');
  } catch (error: any) {
    console.log('✅ Correctly caught non-existent project error:', error.message);
  }
};

/**
 * Test utility methods with different DSI values
 */
export const testUtilityMethods = () => {
  console.log('🧪 Testing Utility Methods...');
  
  const testValues = [15.5, 35.2, 57.5, 85.7];
  
  testValues.forEach(dsiValue => {
    console.log(`\n📊 Testing DSI: ${dsiValue}%`);
    
    const riskInfo = DefectSeverityIndexService.getRiskLevel(dsiValue);
    console.log('  Risk Level:', riskInfo.level);
    console.log('  Color:', riskInfo.color);
    console.log('  Description:', riskInfo.description);
    
    const interpretation = DefectSeverityIndexService.getInterpretation(dsiValue);
    console.log('  Interpretation:', interpretation);
  });
  
  // Test efficiency calculation
  console.log('\n⚡ Testing Efficiency Calculation:');
  const testCases = [
    { actual: 46, max: 80 }, // 57.5% DSI = 42.5% efficiency
    { actual: 20, max: 80 }, // 25% DSI = 75% efficiency
    { actual: 0, max: 80 },  // 0% DSI = 100% efficiency
    { actual: 80, max: 80 }, // 100% DSI = 0% efficiency
  ];
  
  testCases.forEach(({ actual, max }) => {
    const efficiency = DefectSeverityIndexService.calculateEfficiency(actual, max);
    const dsi = (actual / max) * 100;
    console.log(`  DSI: ${dsi.toFixed(1)}% (${actual}/${max}) → Efficiency: ${efficiency}%`);
  });
};

/**
 * Run all tests
 */
export const runAllTests = async () => {
  console.log('🚀 Running All Defect Severity Index API Tests...\n');
  
  try {
    // Test 1: Basic API call
    await testDefectSeverityIndexAPI(1);
    console.log('\n');
    
    // Test 2: State management
    await testDefectSeverityIndexWithState(1);
    console.log('\n');
    
    // Test 3: Error handling
    await testErrorHandling();
    console.log('\n');
    
    // Test 4: Utility methods
    testUtilityMethods();
    console.log('\n');
    
    console.log('🎉 All tests completed!');
  } catch (error) {
    console.error('💥 Test suite failed:', error);
  }
};

// Export for easy testing
export default {
  testDefectSeverityIndexAPI,
  testDefectSeverityIndexWithState,
  testErrorHandling,
  testUtilityMethods,
  runAllTests,
};
