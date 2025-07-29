import apiClient from './api';
import { ProjectsApiResponse, ApiProject, Project } from '../types/api';

// Helper function to determine project severity based on dates and status
const calculateProjectSeverity = (project: ApiProject): 'High Risk' | 'Medium Risk' | 'Low Risk' => {
  // Check if project is inactive first
  if (project.projectStatus !== 'ACTIVE') {
    return 'Low Risk';
  }

  const now = new Date();
  const endDate = new Date(project.endDate);
  const startDate = new Date(project.startDate);

  // Calculate days until end
  const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate project progress (how much time has passed)
  const totalDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = totalDuration > 0 ? (daysElapsed / totalDuration) * 100 : 0;

  // Enhanced severity calculation
  if (daysUntilEnd < 0) {
    // Project is overdue
    return 'High Risk';
  } else if (daysUntilEnd <= 7) {
    // Less than a week remaining
    return 'High Risk';
  } else if (daysUntilEnd <= 30 || progressPercentage > 75) {
    // Less than a month remaining or more than 75% time elapsed
    return 'Medium Risk';
  } else {
    return 'Low Risk';
  }
};

// Transform API project to local project format
const transformApiProjectToLocal = (apiProject: ApiProject): Project => {
  return {
    id: apiProject.id.toString(),
    name: apiProject.projectName,
    severity: calculateProjectSeverity(apiProject),
    description: apiProject.description,
    projectStatus: apiProject.projectStatus,
    startDate: apiProject.startDate,
    endDate: apiProject.endDate,
    clientName: apiProject.clientName,
    country: apiProject.country,
    state: apiProject.state,
    email: apiProject.email,
    phoneNo: apiProject.phoneNo,
    userId: apiProject.userId,
    userFirstName: apiProject.userFirstName,
    userLastName: apiProject.userLastName,
    kloc: apiProject.kloc,
  };
};

export class ProjectService {
  /**
   * Get all projects from the API
   * @returns Promise<Project[]>
   */
  static async getProjects(): Promise<Project[]> {
    try {
      console.log('🔄 Fetching projects from API...');
      const response = await apiClient.get<ProjectsApiResponse>('/projects');

      console.log('📡 API Response Status:', response.status);
      console.log('📊 API Response Data:', response.data);

      if (response.data.status === 'success' && response.data.data) {
        const transformedProjects = response.data.data.map(transformApiProjectToLocal);
        console.log('✅ Successfully transformed projects:', transformedProjects.length);
        console.log('📋 Project details:', transformedProjects.map(p => ({
          id: p.id,
          name: p.name,
          severity: p.severity,
          status: p.projectStatus,
          client: p.clientName
        })));

        return transformedProjects;
      } else {
        console.error('❌ API returned unsuccessful status:', response.data);
        throw new Error(response.data.message || 'Failed to fetch projects');
      }
    } catch (error: any) {
      console.error('🚨 Error in getProjects:', error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        console.error('📡 Server Error Response:', error.response.status, error.response.data);
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
   * Get a specific project by ID
   * @param projectId - The project ID
   * @returns Promise<Project | null>
   */
  static async getProjectById(projectId: string): Promise<Project | null> {
    try {
      const projects = await this.getProjects();
      return projects.find(project => project.id === projectId) || null;
    } catch (error) {
      throw error;
    }
  }
}

export default ProjectService;
