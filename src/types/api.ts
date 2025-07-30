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

// Project Card Color data structure from API
export interface ProjectCardColor {
  projectName: string;
  severityIndex: 'High' | 'Medium' | 'Low';
  reopenCount: 'High' | 'Medium' | 'Low';
  remarkRatio: 'High' | 'Medium' | 'Low';
  densityMeter: 'High' | 'Medium' | 'Low';
  status: 'High Risk' | 'Medium Risk' | 'Low Risk';
  colorCode: 'Red' | 'Yellow' | 'Green';
}

// Project Card Color API response
export type ProjectCardColorApiResponse = ApiResponse<ProjectCardColor[]>;

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

// Defect Density data structure from API
export interface DefectDensityData {
  defects: number;
  projectId: number;
  defectDensity: number;
  color: 'Red' | 'Yellow' | 'Green';
  meaning: string;
  range: string;
  projectName: string;
  clientName: string;
  kloc: number;
}

// Defect Density API response
export type DefectDensityApiResponse = ApiResponse<DefectDensityData>;

// Defect to Remark Ratio data structure from API
export interface DefectToRemarkRatioData {
  remarks: number;
  defects: number;
  ratio: string; // e.g., "100.00%"
  category: 'Low' | 'Medium' | 'High';
  color: 'green' | 'yellow' | 'red';
}

// Defect to Remark Ratio API response
export type DefectToRemarkRatioApiResponse = ApiResponse<DefectToRemarkRatioData>;

// Defect Severity Index data structure from API
export interface DefectSeverityIndexData {
  projectId: number;
  totalDefects: number;
  actualSeverityScore: number;
  maximumSeverityScore: number;
  dsiPercentage: number;
  interpretation: string;
}

// Defect Severity Index API response
export type DefectSeverityIndexApiResponse = ApiResponse<DefectSeverityIndexData>;

// Loading state type
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
