// types/api.ts

export interface ApiProject {
  id: number;
  client_name: string;
  country: string;
  state: string;
  description: string;
  email: string;
  end_date: string;
  start_date: string;
  kloc: number;
  phone_no: string;
  project_id: string;
  project_name: string;
  project_status: string;
  user_Id?: number;
}

export interface ProjectsApiResponse {
  status: string;
  message: string;
  data: ApiProject[];
  statusCode: number;
}

export interface Project {
  id: string;
  name: string;
  severity: 'High Risk' | 'Medium Risk' | 'Low Risk';
  description: string;
  projectStatus: string;
  startDate: string;
  endDate: string;
  clientName: string;
  country: string;
  state: string;
  email: string;
  phoneNo: string;
  userId?: number;
  kloc: number;
}
