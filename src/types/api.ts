// API Response Types based on the provided API documentation

export interface ApiResponse<T> {
  status: 'success' | 'failure';
  message: string;
  data: T | null;
  statusCode: number;
}

// Project data structure from API
export interface ApiProject {
  id: number;
  projectId: string;
  projectName: string;
  description: string;
  projectStatus: string; // e.g., "ACTIVE"
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  clientName: string;
  country: string;
  state: string;
  email: string;
  phoneNo: string;
  userId: number;
  userFirstName: string;
  userLastName: string;
  kloc: number; // Lines of code
}

// Projects API response
export type ProjectsApiResponse = ApiResponse<ApiProject[]>;

// Local project interface (for UI components)
export interface Project {
  id: string;
  name: string;
  severity: 'High Risk' | 'Medium Risk' | 'Low Risk';
  description?: string;
  projectStatus?: string;
  startDate?: string;
  endDate?: string;
  clientName?: string;
  country?: string;
  state?: string;
  email?: string;
  phoneNo?: string;
  userId?: number;
  userFirstName?: string;
  userLastName?: string;
  kloc?: number;
}

// API Error response
export interface ApiError {
  status: 'failure';
  message: string;
  data: null;
  statusCode: string;
}

// Loading state type
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
