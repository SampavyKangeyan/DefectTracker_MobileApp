# Defect to Remark Ratio API Integration

This document describes the implementation of the Defect to Remark Ratio API integration using the provided API specification.

## Overview

The Defect to Remark Ratio component has been enhanced to support real-time data fetching from the API while maintaining backward compatibility with static values.

## API Specification

**Endpoint:** `GET /api/v1/dashboard/defect-remark-ratio`  
**Base URL:** `http://34.56.162.48:8087`

### Parameters
- `projectId` (query parameter): Unique ID of the project (Number/Long, Mandatory)

### Response Format
```json
{
    "status": "success",
    "message": "Defect to Remark Ratio fetched successfully",
    "data": {
        "remarks": 1,
        "defects": 1,
        "ratio": "100.00%",
        "category": "Low",
        "color": "green"
    },
    "statusCode": 2000
}
```

### Risk Levels
| Ratio Range | Color | Category | Description |
|-------------|-------|----------|-------------|
| 98-100% | Green | Low | Excellent ratio |
| 90-98% | Yellow | Medium | Good ratio |
| <90% | Red | High | Needs attention |

## Implementation

### Files Created/Modified

1. **`src/services/defectToRemarkRatio.ts`** - New service for API integration
2. **`src/types/api.ts`** - Updated with DefectToRemarkRatioData interface
3. **`src/screens/DefectToRemarkRatio.tsx`** - Enhanced component with API support
4. **`src/screens/project.tsx`** - Updated to use API integration
5. **`src/utils/testDefectToRemarkRatioAPI.ts`** - Test utilities
6. **`src/examples/DefectToRemarkRatioExamples.tsx`** - Usage examples

### Service Layer (`DefectToRemarkRatioService`)

The service provides several methods:

#### `getDefectToRemarkRatio(projectId)`
- Makes API call to fetch defect to remark ratio data
- Validates input parameters
- Handles errors and network issues
- Returns `DefectToRemarkRatioData` object

#### `getDefectToRemarkRatioWithState(projectId)`
- Wrapper method that includes loading state management
- Returns object with `data`, `error`, and `isLoading` properties
- Useful for React components

#### `getRiskLevel(ratioString)`
- Utility method to determine risk level based on percentage
- Returns level, color, and description information

#### `ratioToDecimal(ratioString)`
- Converts percentage string to decimal for progress bars
- Returns value between 0 and 1

#### `getColorHex(color)`
- Converts API color names to hex codes
- Returns appropriate hex color for UI components

### Component Usage

#### Basic API Integration
```tsx
<DefectToRemarkRatio 
  projectId={1}
/>
```

#### With Fallback Value
```tsx
<DefectToRemarkRatio 
  projectId={1}
  staticRatio={0.92} // Fallback if API fails
/>
```

#### Static Value (Backward Compatibility)
```tsx
<DefectToRemarkRatio 
  staticRatio={0.95}
/>
```

### Component States

1. **Loading State**: Shows spinner while fetching data
2. **Success State**: Displays progress bar with API data
3. **Error State**: Shows error message with retry option
4. **Fallback State**: Uses static value if API fails

### Error Handling

The implementation handles various error scenarios:

- **Invalid Parameters**: Validates projectId before API call
- **Network Errors**: Displays user-friendly network error messages
- **API Errors**: Handles 400 Bad Request and other HTTP errors
- **Project Not Found**: Specific handling for missing project data
- **Timeout**: Configured with 10-second timeout

### Type Safety

All API responses and component props are fully typed:

```typescript
interface DefectToRemarkRatioData {
  remarks: number;
  defects: number;
  ratio: string; // e.g., "100.00%"
  category: 'Low' | 'Medium' | 'High';
  color: 'green' | 'yellow' | 'red';
}
```

## Testing

### Manual Testing
Use the test utilities in `src/utils/testDefectToRemarkRatioAPI.ts`:

```typescript
import { testDefectToRemarkRatioAPI } from '../utils/testDefectToRemarkRatioAPI';

// Test with project ID 1
await testDefectToRemarkRatioAPI(1);
```

### Component Testing
See examples in `src/examples/DefectToRemarkRatioExamples.tsx` for various usage patterns.

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

## Visual Design

The component features:
- **Dynamic Color Coding**: Progress bar and text colors change based on risk level
- **Progress Bar**: Visual representation of the ratio percentage
- **Detailed Information**: Shows defect and remark counts when available
- **Responsive Design**: Adapts to different screen sizes
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## Best Practices

1. **Always provide fallback values** when using API integration
2. **Handle loading states** appropriately in your UI
3. **Validate parameters** before making API calls
4. **Use error boundaries** to catch and handle component errors
5. **Test with different network conditions** (slow, offline, etc.)
6. **Consider caching** for frequently accessed data

## Future Enhancements

1. **Caching**: Implement response caching to reduce API calls
2. **Retry Logic**: Add automatic retry for failed requests
3. **Real-time Updates**: WebSocket integration for live updates
4. **Offline Support**: Store last known values for offline viewing
5. **Performance**: Implement request debouncing for rapid parameter changes
6. **Analytics**: Track ratio trends over time
