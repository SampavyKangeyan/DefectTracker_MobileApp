import apiClient from './api';
import { DefectSeverityIndexApiResponse, DefectSeverityIndexData } from '../types/api';

/**
 * Service for Defect Severity Index (DSI) API integration
 * Handles fetching defect severity index data for projects
 */
export class DefectSeverityIndexService {
  
  /**
   * Get defect severity index data for a specific project
   * @param projectId - The unique ID of the project
   * @returns Promise<DefectSeverityIndexData> - The defect severity index data
   * @throws Error if the API request fails
   */
  static async getDefectSeverityIndex(projectId: number): Promise<DefectSeverityIndexData> {
    try {
      // Validate required parameters
      if (!projectId || projectId <= 0) {
        throw new Error('Invalid project ID. Project ID must be a positive number.');
      }

      // Make API request
      const response = await apiClient.get<DefectSeverityIndexApiResponse>(
        `/dashboard/dsi/${projectId}`
      );

      // Check if response is successful
      if (response.data.status === 'Success' && response.data.data) {
        return response.data.data;
      } else {
        // Handle API failure response
        throw new Error(response.data.message || 'Failed to fetch defect severity index data');
      }
    } catch (error: any) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Server error occurred';
        const statusCode = error.response.status;
        
        if (statusCode === 400) {
          throw new Error('No defects found for the given project ID');
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
   * Get defect severity index with loading state management
   * Useful for React components that need loading states
   * @param projectId - The unique ID of the project
   * @returns Promise with data, loading, and error states
   */
  static async getDefectSeverityIndexWithState(
    projectId: number
  ): Promise<{
    data: DefectSeverityIndexData | null;
    error: string | null;
    isLoading: boolean;
  }> {
    try {
      const data = await this.getDefectSeverityIndex(projectId);
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
   * Utility method to determine risk level based on DSI percentage
   * @param dsiPercentage - The DSI percentage value
   * @returns Risk level and color information
   */
  static getRiskLevel(dsiPercentage: number): {
    level: 'Low' | 'Medium' | 'High';
    color: string;
    description: string;
  } {
    if (dsiPercentage < 25) {
      return {
        level: 'Low',
        color: '#10b981', // Green
        description: 'Low severity impact'
      };
    } else if (dsiPercentage < 75) {
      return {
        level: 'Medium',
        color: '#facc15', // Yellow
        description: 'Moderate severity impact'
      };
    } else {
      return {
        level: 'High',
        color: '#ef4444', // Red
        description: 'High severity impact'
      };
    }
  }

  /**
   * Utility method to get interpretation based on DSI percentage
   * @param dsiPercentage - The DSI percentage value
   * @returns Interpretation string
   */
  static getInterpretation(dsiPercentage: number): string {
    if (dsiPercentage < 25) {
      return 'Low risk - Minor defects';
    } else if (dsiPercentage < 50) {
      return 'Moderate risk - Some attention needed';
    } else if (dsiPercentage < 75) {
      return 'Significant risk - Requires attention';
    } else {
      return 'High risk - Critical defects present';
    }
  }

  /**
   * Utility method to calculate efficiency percentage
   * @param actualScore - The actual severity score
   * @param maxScore - The maximum possible severity score
   * @returns Efficiency percentage (lower is better for DSI)
   */
  static calculateEfficiency(actualScore: number, maxScore: number): number {
    if (maxScore === 0) return 0;
    return Math.round(((maxScore - actualScore) / maxScore) * 100);
  }

  /**
   * Utility method to format DSI data for display
   * @param data - The DSI data from API
   * @returns Formatted display object
   */
  static formatForDisplay(data: DefectSeverityIndexData): {
    percentage: string;
    efficiency: string;
    riskLevel: ReturnType<typeof DefectSeverityIndexService.getRiskLevel>;
    summary: string;
  } {
    const riskLevel = this.getRiskLevel(data.dsiPercentage);
    const efficiency = this.calculateEfficiency(data.actualSeverityScore, data.maximumSeverityScore);
    
    return {
      percentage: `${data.dsiPercentage.toFixed(1)}%`,
      efficiency: `${efficiency}%`,
      riskLevel,
      summary: `${data.totalDefects} defects with ${data.actualSeverityScore}/${data.maximumSeverityScore} severity score`
    };
  }
}

export default DefectSeverityIndexService;
