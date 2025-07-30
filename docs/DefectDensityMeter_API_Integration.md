# Defect Density Meter API Integration

This document describes the implementation of the Defect Density Meter API integration using the provided API specification.

## Overview

The Defect Density Meter component has been enhanced to support real-time data fetching from the API while maintaining backward compatibility with static values.

## API Specification

**Endpoint:** `GET /api/v1/dashboard/defect-density/{projectId}`  
**Base URL:** `http://34.56.162.48:8087`

### Parameters
- `projectId` (path parameter): Unique ID of the project (Integer/Long, Mandatory)
- `kloc` (query parameter): Kilo Lines of Code (double, Mandatory)

### Response Format
```json
{
    "status": "success",
    "message": "Defect density calculated successfully",
    "data": {
        "defects": 4,
        "projectId": 1,
        "defectDensity": 400.0,
        "color": "Red",
        "meaning": "High Risk",
        "range": "Above 10.0",
        "projectName": "Acme Shop",
        "clientName": "Acme Corp",
        "kloc": 0.01
    },
    "statusCode": 2000
}
```

### Risk Levels
| Value Range | Color | Meaning |
|-------------|-------|---------|
| 0 to 7 | Green | Good |
| 7 to 10 | Yellow | Moderate Quality |
| 10+ | Red | High Risk |

## Implementation

### Files Created/Modified

1. **`src/services/defectDensityMeter.ts`** - New service for API integration
2. **`src/types/api.ts`** - Updated with DefectDensityData interface
3. **`src/screens/DefectDensityMeter.tsx`** - Enhanced component with API support
4. **`src/screens/project.tsx`** - Updated to use API integration
5. **`src/utils/testDefectDensityAPI.ts`** - Test utilities
6. **`src/examples/DefectDensityMeterExamples.tsx`** - Usage examples

### Service Layer (`DefectDensityMeterService`)

The service provides three main methods:

#### `getDefectDensity(projectId, kloc)`
- Makes API call to fetch defect density data
- Validates input parameters
- Handles errors and network issues
- Returns `DefectDensityData` object

#### `getDefectDensityWithState(projectId, kloc)`
- Wrapper method that includes loading state management
- Returns object with `data`, `error`, and `isLoading` properties
- Useful for React components

#### `getRiskLevel(defectDensity)`
- Utility method to determine risk level based on value
- Returns level, color, meaning, and range information

### Component Usage

#### Basic API Integration
```tsx
<DefectDensityMeter 
  projectId={1} 
  kloc={0.01}
/>
```

#### With Fallback Value
```tsx
<DefectDensityMeter 
  projectId={1} 
  kloc={0.01}
  value={12} // Fallback if API fails
/>
```

#### Static Value (Backward Compatibility)
```tsx
<DefectDensityMeter 
  value={8.5}
/>
```

### Component States

1. **Loading State**: Shows spinner while fetching data
2. **Success State**: Displays meter with API data
3. **Error State**: Shows error message with retry option
4. **Fallback State**: Uses static value if API fails

### Error Handling

The implementation handles various error scenarios:

- **Invalid Parameters**: Validates projectId and kloc before API call
- **Network Errors**: Displays user-friendly network error messages
- **API Errors**: Handles 400 Bad Request and other HTTP errors
- **Timeout**: Configured with 10-second timeout

### Type Safety

All API responses and component props are fully typed:

```typescript
interface DefectDensityData {
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
```

## Testing

### Manual Testing
Use the test utilities in `src/utils/testDefectDensityAPI.ts`:

```typescript
import { testDefectDensityAPI } from '../utils/testDefectDensityAPI';

// Test with project ID 1 and KLOC 0.01
await testDefectDensityAPI(1, 0.01);
```

### Component Testing
See examples in `src/examples/DefectDensityMeterExamples.tsx` for various usage patterns.

## Configuration

### API Configuration
The API base URL and timeout are configured in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://34.56.162.48:8087/api/v1';
const API_TIMEOUT = 10000; // 10 seconds
```

### Headers
The service automatically sets the required headers:
- `Content-Type: application/json`

## Best Practices

1. **Always provide fallback values** when using API integration
2. **Handle loading states** appropriately in your UI
3. **Validate parameters** before making API calls
4. **Use error boundaries** to catch and handle component errors
5. **Test with different network conditions** (slow, offline, etc.)

## Future Enhancements

1. **Caching**: Implement response caching to reduce API calls
2. **Retry Logic**: Add automatic retry for failed requests
3. **Real-time Updates**: WebSocket integration for live updates
4. **Offline Support**: Store last known values for offline viewing
5. **Performance**: Implement request debouncing for rapid parameter changes
