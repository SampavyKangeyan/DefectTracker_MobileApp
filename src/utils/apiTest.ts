// API test utility with enhanced logging
import ProjectService from '../services/projectService';

export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log('🧪 Testing API connection...');
    const projects = await ProjectService.getProjects();
    console.log('✅ API test successful!');
    console.log(`📊 Retrieved ${projects.length} projects`);

    // Log project details for verification
    projects.forEach((project, index) => {
      console.log(`📋 Project ${index + 1}:`, {
        id: project.id,
        name: project.name,
        severity: project.severity,
        status: project.projectStatus,
        client: project.clientName,
        startDate: project.startDate,
        endDate: project.endDate
      });
    });

    return true;
  } catch (error: any) {
    console.error('❌ API test failed:', error.message);
    return false;
  }
};

// Function to test individual project retrieval
export const testProjectById = async (projectId: string): Promise<boolean> => {
  try {
    console.log(`🔍 Testing project retrieval for ID: ${projectId}`);
    const project = await ProjectService.getProjectById(projectId);
    if (project) {
      console.log('✅ Project retrieved successfully:', {
        id: project.id,
        name: project.name,
        severity: project.severity,
        client: project.clientName
      });
      return true;
    } else {
      console.log('⚠️ Project not found');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Project retrieval test failed:', error.message);
    return false;
  }
};

// Function to test API response structure
export const validateApiResponse = async (): Promise<boolean> => {
  try {
    console.log('🔍 Validating API response structure...');
    const projects = await ProjectService.getProjects();

    if (projects.length === 0) {
      console.log('⚠️ No projects returned from API');
      return false;
    }

    const firstProject = projects[0];
    const requiredFields = ['id', 'name', 'severity'];
    const missingFields = requiredFields.filter(field => !firstProject[field as keyof typeof firstProject]);

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return false;
    }

    console.log('✅ API response structure is valid');
    return true;
  } catch (error: any) {
    console.error('❌ API validation failed:', error.message);
    return false;
  }
};
