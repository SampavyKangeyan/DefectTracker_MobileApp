/**
 * Test utility for Defect Density API integration
 * This file can be used to test the API integration manually
 */

import DefectDensityMeterService from '../services/defectDensityMeter';

/**
 * Test function to verify the Defect Density API integration
 * @param projectId - The project ID to test with
 * @param kloc - The KLOC value to test with
 */
export const testDefectDensityAPI = async (projectId: number = 1, kloc: number = 0.01) => {
  console.log('🧪 Testing Defect Density API Integration...');
  console.log(`📊 Project ID: ${projectId}, KLOC: ${kloc}`);
  
  try {
    // Test the basic API call
    console.log('📡 Making API request...');
    const data = await DefectDensityMeterService.getDefectDensity(projectId, kloc);
    
    console.log('✅ API Response received:');
    console.log('📈 Defect Density:', data.defectDensity);
    console.log('🎯 Risk Level:', data.meaning);
    console.log('🎨 Color:', data.color);
    console.log('📊 Range:', data.range);
    console.log('🏢 Project:', data.projectName);
    console.log('👤 Client:', data.clientName);
    console.log('🐛 Total Defects:', data.defects);
    console.log('📏 KLOC:', data.kloc);
    
    // Test the risk level utility
    const riskInfo = DefectDensityMeterService.getRiskLevel(data.defectDensity);
    console.log('🔍 Risk Analysis:');
    console.log('  Level:', riskInfo.level);
    console.log('  Color:', riskInfo.color);
    console.log('  Meaning:', riskInfo.meaning);
    console.log('  Range:', riskInfo.range);
    
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
export const testDefectDensityWithState = async (projectId: number = 1, kloc: number = 0.01) => {
  console.log('🧪 Testing Defect Density API with State Management...');
  
  try {
    const result = await DefectDensityMeterService.getDefectDensityWithState(projectId, kloc);
    
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
    await DefectDensityMeterService.getDefectDensity(-1, 0.01);
    console.log('❌ Should have thrown error for invalid project ID');
  } catch (error: any) {
    console.log('✅ Correctly caught invalid project ID error:', error.message);
  }
  
  // Test invalid KLOC
  try {
    await DefectDensityMeterService.getDefectDensity(1, -1);
    console.log('❌ Should have thrown error for invalid KLOC');
  } catch (error: any) {
    console.log('✅ Correctly caught invalid KLOC error:', error.message);
  }
  
  // Test non-existent project
  try {
    await DefectDensityMeterService.getDefectDensity(99999, 0.01);
    console.log('❌ Should have thrown error for non-existent project');
  } catch (error: any) {
    console.log('✅ Correctly caught non-existent project error:', error.message);
  }
};

/**
 * Run all tests
 */
export const runAllTests = async () => {
  console.log('🚀 Running All Defect Density API Tests...\n');
  
  try {
    // Test 1: Basic API call
    await testDefectDensityAPI(1, 0.01);
    console.log('\n');
    
    // Test 2: State management
    await testDefectDensityWithState(1, 0.01);
    console.log('\n');
    
    // Test 3: Error handling
    await testErrorHandling();
    console.log('\n');
    
    console.log('🎉 All tests completed!');
  } catch (error) {
    console.error('💥 Test suite failed:', error);
  }
};

// Export for easy testing
export default {
  testDefectDensityAPI,
  testDefectDensityWithState,
  testErrorHandling,
  runAllTests,
};
