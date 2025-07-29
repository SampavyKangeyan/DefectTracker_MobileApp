# API Integration Documentation

## Overview
This document describes the API integration implemented for the DefectTracker Mobile App to fetch projects from the backend API.

## API Endpoint
- **URL**: `http://34.56.162.48:8087/api/v1/projects`
- **Method**: GET
- **Content-Type**: application/json

## Implementation Structure

### 1. API Service Layer (`src/services/`)
- **`api.ts`**: Base axios configuration with interceptors
- **`projectService.ts`**: Project-specific API methods

### 2. Type Definitions (`src/types/`)
- **`api.ts`**: TypeScript interfaces for API responses and data structures

### 3. Updated Components
- **`dashboard.tsx`**: Integrated API calls with loading states and error handling
- **`project.tsx`**: Updated to use API data consistently

## Features Implemented

### ✅ API Service Layer
- Centralized axios configuration
- Request/response interceptors
- Error handling and timeout management
- Base URL and headers configuration

### ✅ TypeScript Integration
- Strongly typed API responses
- Project data interfaces
- Loading state management
- Error state handling

### ✅ Dashboard Integration
- Real-time project loading from API
- Pull-to-refresh functionality
- Loading indicators
- Error handling with retry mechanism
- Fallback to local data on API failure

### ✅ Project Details Integration
- Consistent data source with dashboard
- API-driven project information
- Error handling and loading states

### ✅ Error Handling
- Network error detection
- Server error handling
- User-friendly error messages
- Retry mechanisms
- Graceful fallback to cached/local data

## API Response Format

### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Projects retrieved successfully",
  "data": [
    {
      "id": 1,
      "projectId": "PR0001",
      "projectName": "Defect Tracker",
      "description": "On going projects defect tracking",
      "projectStatus": "ACTIVE",
      "startDate": "2025-06-16T00:00:00.000+00:00",
      "endDate": "2025-09-16T00:00:00.000+00:00",
      "clientName": "Allan sir",
      "country": "Srilanka",
      "state": "Nothern",
      "email": "AllanSathiyathas@gmail.com",
      "phoneNo": "0779088854",
      "userId": 2,
      "userFirstName": "Sanjeeththanan",
      "userLastName": "Ruvendra",
      "kloc": 0
    }
  ],
  "statusCode": 2000
}
```

### Error Response (400 Bad Request)
```json
{
  "status": "failure",
  "message": "Data not found",
  "data": null,
  "statusCode": "4000"
}
```

## Project Severity Calculation
Projects are automatically assigned severity levels based on enhanced business logic:

### Severity Rules:
1. **High Risk**:
   - Project is overdue (past end date)
   - Less than 7 days remaining until end date

2. **Medium Risk**:
   - Less than 30 days remaining until end date
   - More than 75% of project timeline has elapsed

3. **Low Risk**:
   - Project status is not "ACTIVE"
   - More than 30 days remaining and less than 75% timeline elapsed

### Additional Factors:
- **Project Status**: Inactive projects are automatically marked as Low Risk
- **Timeline Progress**: Projects with >75% time elapsed are elevated to Medium Risk
- **Overdue Detection**: Past due dates automatically trigger High Risk status

## Usage Examples

### Loading Projects
```typescript
import ProjectService from '../services/projectService';

const loadProjects = async () => {
  try {
    const projects = await ProjectService.getProjects();
    setProjects(projects);
  } catch (error) {
    console.error('Failed to load projects:', error);
  }
};
```

### Getting Specific Project
```typescript
const project = await ProjectService.getProjectById('1');
if (project) {
  console.log('Project found:', project.name);
}
```

## Testing

### Automatic Testing
The app automatically tests the API connection in development mode when the dashboard loads. Check the console logs for test results.

### Manual Testing
Use the API test utilities to verify connection:

```typescript
import { testApiConnection, validateApiResponse } from '../utils/apiTest';

// Test basic connectivity
const isConnected = await testApiConnection();

// Validate response structure
const isValid = await validateApiResponse();
```

### Console Logging
The implementation includes comprehensive logging:
- 🔄 Loading indicators
- ✅ Success messages with data details
- ❌ Error messages with specific error types
- 📊 Project transformation details
- 🧪 API test results

### Verification Steps
1. **Open React Native Debugger or Metro console**
2. **Launch the app** - API test runs automatically in development
3. **Check console logs** for:
   - API connection status
   - Number of projects retrieved
   - Project details and severity calculations
   - Any error messages

4. **Test pull-to-refresh** on dashboard
5. **Navigate to project details** to verify data consistency

## Configuration
API configuration can be modified in `src/services/api.ts`:
- Base URL
- Timeout settings
- Headers
- Interceptors

## Error Handling Strategy
1. **Network Errors**: Show retry button and fallback to cached data
2. **Server Errors**: Display user-friendly error messages
3. **Timeout**: Automatic retry with exponential backoff
4. **No Data**: Graceful fallback to sample/cached projects

## Future Enhancements
- Authentication token management
- Offline data caching
- Background sync
- Push notifications for project updates
- Real-time project status updates
