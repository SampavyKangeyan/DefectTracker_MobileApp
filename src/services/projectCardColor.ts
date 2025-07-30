import apiClient from './api';
import { ProjectCardColorApiResponse, ProjectCardColor } from '../types/api';

export class ProjectCardColorService {
  /**
   * Get project card color data by project ID
   * @param projectId - The project ID to get card color data for
   * @returns Promise<ProjectCardColor[]>
   */
  static async getProjectCardColor(projectId: string): Promise<ProjectCardColor[]> {
    try {
      console.log('🔄 Fetching project card color data for project ID:', projectId);
      
      const response = await apiClient.get<ProjectCardColorApiResponse>(`/dashboard/project-card-color/${projectId}`);

      console.log('📡 API Response Status:', response.status);
      console.log('📊 API Response Data:', response.data);

      if (response.data.status === 'success' && response.data.data) {
        const cardColorData = response.data.data;
        console.log('✅ Successfully retrieved project card color data:', cardColorData.length, 'items');
        console.log('🎨 Card color details:', cardColorData.map(item => ({
          projectName: item.projectName,
          severityIndex: item.severityIndex,
          reopenCount: item.reopenCount,
          remarkRatio: item.remarkRatio,
          densityMeter: item.densityMeter,
          status: item.status,
          colorCode: item.colorCode
        })));

        return cardColorData;
      } else {
        console.error('❌ API returned unsuccessful status:', response.data);
        throw new Error(response.data.message || 'Failed to fetch project card color data');
      }
    } catch (error: any) {
      console.error('🚨 Error in getProjectCardColor:', error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        console.error('📡 Server Error Response:', error.response.status, error.response.data);
        
        // Handle specific error cases based on API documentation
        if (error.response.status === 400) {
          const errorMessage = error.response.data?.message || 'Project Not Found';
          throw new Error(errorMessage);
        }
        
        const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        // Network error
        console.error('🌐 Network Error:', error.request);
        throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
      } else {
        // Other errors
        console.error('⚠️ Other Error:', error.message);
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }

  /**
   * Get project card color data for multiple projects
   * @param projectIds - Array of project IDs
   * @returns Promise<ProjectCardColor[]>
   */
  static async getMultipleProjectCardColors(projectIds: string[]): Promise<ProjectCardColor[]> {
    try {
      console.log('🔄 Fetching project card color data for multiple projects:', projectIds);
      
      const promises = projectIds.map(projectId => this.getProjectCardColor(projectId));
      const results = await Promise.all(promises);
      
      // Flatten the results since each call returns an array
      const allCardColors = results.flat();
      
      console.log('✅ Successfully retrieved card color data for', projectIds.length, 'projects');
      return allCardColors;
    } catch (error: any) {
      console.error('🚨 Error in getMultipleProjectCardColors:', error);
      throw error;
    }
  }

  /**
   * Get a single project card color by project ID
   * @param projectId - The project ID
   * @returns Promise<ProjectCardColor | null>
   */
  static async getSingleProjectCardColor(projectId: string): Promise<ProjectCardColor | null> {
    try {
      const cardColors = await this.getProjectCardColor(projectId);
      return cardColors.length > 0 ? cardColors[0] : null;
    } catch (error) {
      throw error;
    }
  }
}

export default ProjectCardColorService; 