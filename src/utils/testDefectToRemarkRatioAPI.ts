/**
 * Test utility for Defect to Remark Ratio API integration
 * This file can be used to test the API integration manually
 */

import DefectToRemarkRatioService from '../services/defectToRemarkRatio';

/**
 * Test function to verify the Defect to Remark Ratio API integration
 * @param projectId - The project ID to test with
 */
export const testDefectToRemarkRatioAPI = async (projectId: number = 1) => {
  console.log('🧪 Testing Defect to Remark Ratio API Integration...');
  console.log(`📊 Project ID: ${projectId}`);
  
  try {
    // Test the basic API call
    console.log('📡 Making API request...');
    const data = await DefectToRemarkRatioService.getDefectToRemarkRatio(projectId);
    
    console.log('✅ API Response received:');
    console.log('📈 Ratio:', data.ratio);
    console.log('🎯 Category:', data.category);
    console.log('🎨 Color:', data.color);
    console.log('🐛 Defects:', data.defects);
    console.log('💬 Remarks:', data.remarks);
    
    // Test the utility methods
    const riskInfo = DefectToRemarkRatioService.getRiskLevel(data.ratio);
    console.log('🔍 Risk Analysis:');
    console.log('  Level:', riskInfo.level);
    console.log('  Color:', riskInfo.color);
    console.log('  Description:', riskInfo.description);
    
    const decimalValue = DefectToRemarkRatioService.ratioToDecimal(data.ratio);
    console.log('📊 Decimal Value:', decimalValue);
    
    const colorHex = DefectToRemarkRatioService.getColorHex(data.color);
    console.log('🎨 Color Hex:', colorHex);
    
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
export const testDefectToRemarkRatioWithState = async (projectId: number = 1) => {
  console.log('🧪 Testing Defect to Remark Ratio API with State Management...');
  
  try {
    const result = await DefectToRemarkRatioService.getDefectToRemarkRatioWithState(projectId);
    
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
    await DefectToRemarkRatioService.getDefectToRemarkRatio(-1);
    console.log('❌ Should have thrown error for invalid project ID');
  } catch (error: any) {
    console.log('✅ Correctly caught invalid project ID error:', error.message);
  }
  
  // Test zero project ID
  try {
    await DefectToRemarkRatioService.getDefectToRemarkRatio(0);
    console.log('❌ Should have thrown error for zero project ID');
  } catch (error: any) {
    console.log('✅ Correctly caught zero project ID error:', error.message);
  }
  
  // Test non-existent project
  try {
    await DefectToRemarkRatioService.getDefectToRemarkRatio(99999);
    console.log('❌ Should have thrown error for non-existent project');
  } catch (error: any) {
    console.log('✅ Correctly caught non-existent project error:', error.message);
  }
};

/**
 * Test utility methods with different ratio values
 */
export const testUtilityMethods = () => {
  console.log('🧪 Testing Utility Methods...');
  
  const testRatios = ['100.00%', '95.50%', '85.20%', '50.00%'];
  
  testRatios.forEach(ratio => {
    console.log(`\n📊 Testing ratio: ${ratio}`);
    
    const riskInfo = DefectToRemarkRatioService.getRiskLevel(ratio);
    console.log('  Risk Level:', riskInfo.level);
    console.log('  Color:', riskInfo.color);
    console.log('  Description:', riskInfo.description);
    
    const decimal = DefectToRemarkRatioService.ratioToDecimal(ratio);
    console.log('  Decimal:', decimal);
    
    const colorHex = DefectToRemarkRatioService.getColorHex(riskInfo.color);
    console.log('  Color Hex:', colorHex);
  });
};

/**
 * Run all tests
 */
export const runAllTests = async () => {
  console.log('🚀 Running All Defect to Remark Ratio API Tests...\n');
  
  try {
    // Test 1: Basic API call
    await testDefectToRemarkRatioAPI(1);
    console.log('\n');
    
    // Test 2: State management
    await testDefectToRemarkRatioWithState(1);
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
  testDefectToRemarkRatioAPI,
  testDefectToRemarkRatioWithState,
  testErrorHandling,
  testUtilityMethods,
  runAllTests,
};
