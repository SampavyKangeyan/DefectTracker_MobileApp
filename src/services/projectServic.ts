import apiClient from './api';

// Update Project type to match backend
export type Project = {
  id: string;
  project_name: string;
  severity: 'High Risk' | 'Medium Risk' | 'Low Risk';
  // ...other fields if needed
};

const ProjectService = {
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get('/projects');
    // If your backend returns an array of projects, no mapping needed.
    // If you need to map fields, do it here.
    return response.data;
  },
};

export default ProjectService;
