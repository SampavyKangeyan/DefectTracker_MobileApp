import apiClient from './api';
import { DefectDensityApiResponse, DefectDensityData } from '../types/api';

/**
 * Service for Defect Density Meter API integration
 * Handles fetching defect density data for projects
 */
export class DefectDensityMeterService {
  
  /**
   * Get defect density data for a specific project
   * @param projectId - The unique ID of the project
   * @param kloc - Kilo Lines of Code (mandatory parameter)
   * @returns Promise<DefectDensityData> - The defect density data
   * @throws Error if the API request fails
   */
  static async getDefectDensity(
    projectId: number, 
    kloc: number
  ): Promise<DefectDensityData> {
    try {
      // Validate required parameters
      if (!projectId || projectId <= 0) {
        throw new Error('Invalid project ID. Project ID must be a positive number.');
      }
      
      if (!kloc || kloc <= 0) {
        throw new Error('Invalid KLOC value. KLOC must be a positive number.');
      }

      // Make API request
      const response = await apiClient.get<DefectDensityApiResponse>(
        `/dashboard/defect-density/${projectId}`,
        {
          params: {
            kloc: kloc
          }
        }
      );

      // Check if response is successful
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        // Handle API failure response
        throw new Error(response.data.message || 'Failed to fetch defect density data');
      }
    } catch (error: any) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Server error occurred';
        const statusCode = error.response.status;
        
        if (statusCode === 400) {
          throw new Error('Invalid project ID or parameters');
        } else {
          throw new Error(`API Error (${statusCode}): ${errorMessage}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error: Unable to connect to the server');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }

  /**
   * Get defect density with loading state management
   * Useful for React components that need loading states
   * @param projectId - The unique ID of the project
   * @param kloc - Kilo Lines of Code
   * @returns Promise with data, loading, and error states
   */
  static async getDefectDensityWithState(
    projectId: number, 
    kloc: number
  ): Promise<{
    data: DefectDensityData | null;
    error: string | null;
    isLoading: boolean;
  }> {
    try {
      const data = await this.getDefectDensity(projectId, kloc);
      return {
        data,
        error: null,
        isLoading: false
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
        isLoading: false
      };
    }
  }

  /**
   * Utility method to determine risk level based on defect density value
   * @param defectDensity - The defect density value
   * @returns Risk level and color information
   */
  static getRiskLevel(defectDensity: number): {
    level: 'Low' | 'Medium' | 'High';
    color: 'Green' | 'Yellow' | 'Red';
    meaning: string;
    range: string;
  } {
    if (defectDensity >= 0 && defectDensity <= 7) {
      return {
        level: 'Low',
        color: 'Green',
        meaning: 'Good',
        range: '0 to 7'
      };
    } else if (defectDensity > 7 && defectDensity <= 10) {
      return {
        level: 'Medium',
        color: 'Yellow',
        meaning: 'Moderate Quality',
        range: '7 to 10'
      };
    } else {
      return {
        level: 'High',
        color: 'Red',
        meaning: 'High Risk',
        range: 'Above 10.0'
      };
    }
  }
}

export default DefectDensityMeterService;
