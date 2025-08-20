// services/projectService.ts
import apiClient from './api';
import { ProjectsApiResponse, ApiProject, Project } from '../types/api';

// Calculate risk level for a project
const calculateProjectSeverity = (project: ApiProject): 'High Risk' | 'Medium Risk' | 'Low Risk' => {
  if (project.project_status !== 'ACTIVE') return 'Low Risk';

  const now = new Date();
  const endDate = new Date(project.end_date);
  const startDate = new Date(project.start_date);

  const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const totalDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = totalDuration > 0 ? (daysElapsed / totalDuration) * 100 : 0;

  if (daysUntilEnd < 0) return 'High Risk';
  if (daysUntilEnd <= 7) return 'High Risk';
  if (daysUntilEnd <= 30 || progressPercentage > 75) return 'Medium Risk';
  return 'Low Risk';
};

// Transform API response project → local project model
const transformApiProjectToLocal = (apiProject: ApiProject): Project => ({
  id: apiProject.id.toString(),
  name: apiProject.project_name,
  severity: calculateProjectSeverity(apiProject),
  description: apiProject.description,
  projectStatus: apiProject.project_status,
  startDate: apiProject.start_date,
  endDate: apiProject.end_date,
  clientName: apiProject.client_name,
  country: apiProject.country,
  state: apiProject.state,
  email: apiProject.email,
  phoneNo: apiProject.phone_no,
  userId: apiProject.user_Id || undefined,
  kloc: apiProject.kloc,
});

export class ProjectService {
  /**
   * Get all projects from the API
   * URL: http://192.168.1.131:3000/api/projects
   * Method: GET
   * Headers: Content-Type: application/json
   * @returns Promise<Project[]>
   */
  static async getProjects(): Promise<Project[]> {
    try {
      console.log('Fetching projects from API...');
      const response = await apiClient.get<ProjectsApiResponse>('/projects');

      console.log('API Response Status:', response.status);
      console.log('API Response Data:', response.data);

      // Check for success response according to API specification
      if (response.data.status === 'success' && response.data.statusCode === 2000 && response.data.data) {
        const transformedProjects = response.data.data.map(transformApiProjectToLocal);
        console.log('Successfully transformed projects:', transformedProjects.length);
        console.log('Project details:', transformedProjects.map(p => ({
          id: p.id,
          name: p.name,
          severity: p.severity,
          status: p.projectStatus,
          client: p.clientName
        })));

        return transformedProjects;
      } else {
        console.error('API returned unsuccessful status:', response.data);
        throw new Error(response.data.message || 'Failed to fetch projects');
      }
    } catch (error: any) {
      console.error('Error in getProjects:', error);

      // Handle different types of errors according to API specification
      if (error.response) {
        // Server responded with error status
        console.error('Server Error Response:', error.response.status, error.response.data);

        // Handle specific error codes from API specification
        if (error.response.status === 400) {
          const errorMessage = error.response.data?.message || 'Data not found';
          throw new Error(errorMessage);
        }

        const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        // Network error
        console.error('Network Error:', error.request);
        throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
      } else {
        // Other errors
        console.error('Other Error:', error.message);
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
