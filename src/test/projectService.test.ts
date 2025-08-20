// Test file to verify ProjectService API integration
import ProjectService from '../services/projectService';

// Simple test function to verify API integration
export const testProjectServiceIntegration = async () => {
  console.log('=== Testing ProjectService API Integration ===');
  
  try {
    console.log('1. Testing getProjects() method...');
    const projects = await ProjectService.getProjects();
    
    console.log(`✅ Successfully fetched ${projects.length} projects`);
    
    if (projects.length > 0) {
      const firstProject = projects[0];
      console.log('✅ Sample project data:', {
        id: firstProject.id,
        name: firstProject.name,
        severity: firstProject.severity,
        status: firstProject.projectStatus,
        client: firstProject.clientName,
        startDate: firstProject.startDate,
        endDate: firstProject.endDate
      });
      
      console.log('2. Testing getProjectById() method...');
      const projectById = await ProjectService.getProjectById(firstProject.id);
      
      if (projectById) {
        console.log(`✅ Successfully fetched project by ID: ${projectById.name}`);
      } else {
        console.log('❌ Failed to fetch project by ID');
      }
    }
    
    console.log('=== API Integration Test Completed Successfully ===');
    return true;
    
  } catch (error: any) {
    console.error('❌ API Integration Test Failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
};

// Export for use in components if needed
export default testProjectServiceIntegration;
