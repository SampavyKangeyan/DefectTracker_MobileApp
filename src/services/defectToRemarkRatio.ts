import apiClient from './api';
import { DefectToRemarkRatioApiResponse, DefectToRemarkRatioData } from '../types/api';

/**
 * Service for Defect to Remark Ratio API integration
 * Handles fetching defect to remark ratio data for projects
 */
export class DefectToRemarkRatioService {
  
  /**
   * Get defect to remark ratio data for a specific project
   * @param projectId - The unique ID of the project
   * @returns Promise<DefectToRemarkRatioData> - The defect to remark ratio data
   * @throws Error if the API request fails
   */
  static async getDefectToRemarkRatio(projectId: number): Promise<DefectToRemarkRatioData> {
    try {
      // Validate required parameters
      if (!projectId || projectId <= 0) {
        throw new Error('Invalid project ID. Project ID must be a positive number.');
      }

      // Make API request
      const response = await apiClient.get<DefectToRemarkRatioApiResponse>(
        `/dashboard/defect-remark-ratio`,
        {
          params: {
            projectId: projectId
          }
        }
      );

      // Check if response is successful
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        // Handle API failure response
        throw new Error(response.data.message || 'Failed to fetch defect to remark ratio data');
      }
    } catch (error: any) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Server error occurred';
        const statusCode = error.response.status;
        
        if (statusCode === 400) {
          throw new Error('Project not found or no defect data available for the given projectId');
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
   * Get defect to remark ratio with loading state management
   * Useful for React components that need loading states
   * @param projectId - The unique ID of the project
   * @returns Promise with data, loading, and error states
   */
  static async getDefectToRemarkRatioWithState(
    projectId: number
  ): Promise<{
    data: DefectToRemarkRatioData | null;
    error: string | null;
    isLoading: boolean;
  }> {
    try {
      const data = await this.getDefectToRemarkRatio(projectId);
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
   * Utility method to determine risk level based on ratio percentage
   * @param ratioString - The ratio string (e.g., "95.50%")
   * @returns Risk level and color information
   */
  static getRiskLevel(ratioString: string): {
    level: 'Low' | 'Medium' | 'High';
    color: 'green' | 'yellow' | 'red';
    description: string;
  } {
    // Parse the percentage string to get numeric value
    const ratio = parseFloat(ratioString.replace('%', ''));
    
    if (ratio > 98 && ratio <= 100) {
      return {
        level: 'Low',
        color: 'green',
        description: 'Excellent ratio'
      };
    } else if (ratio >= 90 && ratio <= 98) {
      return {
        level: 'Medium',
        color: 'yellow',
        description: 'Good ratio'
      };
    } else {
      return {
        level: 'High',
        color: 'red',
        description: 'Needs attention'
      };
    }
  }

  /**
   * Utility method to convert ratio string to decimal for progress bars
   * @param ratioString - The ratio string (e.g., "95.50%")
   * @returns Decimal value between 0 and 1
   */
  static ratioToDecimal(ratioString: string): number {
    const ratio = parseFloat(ratioString.replace('%', ''));
    return Math.min(ratio / 100, 1.0);
  }

  /**
   * Utility method to get color hex codes for UI components
   * @param color - The color name from API
   * @returns Hex color code
   */
  static getColorHex(color: 'green' | 'yellow' | 'red'): string {
    switch (color) {
      case 'green':
        return '#10b981'; // Green
      case 'yellow':
        return '#fbc02d'; // Yellow/Orange
      case 'red':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray fallback
    }
  }
}

export default DefectToRemarkRatioService;
