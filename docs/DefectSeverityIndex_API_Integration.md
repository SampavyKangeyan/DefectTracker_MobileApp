# Defect Severity Index (DSI) API Integration

This document describes the implementation of the Defect Severity Index API integration using the provided API specification.

## Overview

The Defect Severity Index component has been enhanced to support real-time data fetching from the API while maintaining backward compatibility with static values. The DSI calculates the weighted impact of defects based on their severity levels.

## API Specification

**Endpoint:** `GET /api/v1/dashboard/dsi/{projectId}`  
**Base URL:** `http://34.56.162.48:8087`

### Parameters
- `projectId` (path parameter): Unique ID of the project (Long, Mandatory)

### DSI Calculation Method
The DSI is calculated using weighted severity scores:

| Severity | Weight |
|----------|--------|
| Critical | 4 |
| High | 3 |
| Medium | 2 |
| Low | 1 |

**Formula:** DSI% = (Actual Score / Maximum Score) × 100

**Example:**
- Critical: 3 defects × 4 = 12
- High: 5 defects × 3 = 15  
- Medium: 7 defects × 2 = 14
- Low: 5 defects × 1 = 5
- **Total Defects:** 20
- **Actual Score:** 46
- **Max Score:** 20 × 4 = 80
- **DSI:** (46/80) × 100 = 57.5%

### Response Format
```json
{
  "status": "Success",
  "message": "DSI calculated successfully",
  "data": {
    "projectId": 1,
    "totalDefects": 20,
    "actualSeverityScore": 46,
    "maximumSeverityScore": 80,
    "dsiPercentage": 57.5,
    "interpretation": "Significant risk"
  },
  "statusCode": 2000
}
```

### Severity Levels
| DSI Range | Color | Level | Description |
|-----------|-------|-------|-------------|
| 0-25% | Green | Low | Low severity impact |
| 25-75% | Yellow | Medium | Moderate severity impact |
| 75-100% | Red | High | High severity impact |

## Implementation

### Files Created/Modified

1. **`src/services/defectSeverityIndex.ts`** - New service for API integration
2. **`src/types/api.ts`** - Updated with DefectSeverityIndexData interface
3. **`src/screens/DefectSeverityIndex.tsx`** - Enhanced component with API support
4. **`src/screens/project.tsx`** - Updated to use API integration
5. **`src/utils/testDefectSeverityIndexAPI.ts`** - Test utilities
6. **`src/examples/DefectSeverityIndexExamples.tsx`** - Usage examples

### Service Layer (`DefectSeverityIndexService`)

The service provides several methods:

#### `getDefectSeverityIndex(projectId)`
- Makes API call to fetch DSI data
- Validates input parameters
- Handles errors and network issues
- Returns `DefectSeverityIndexData` object

#### `getDefectSeverityIndexWithState(projectId)`
- Wrapper method that includes loading state management
- Returns object with `data`, `error`, and `isLoading` properties
- Useful for React components

#### `getRiskLevel(dsiPercentage)`
- Utility method to determine risk level based on DSI percentage
- Returns level, color, and description information

#### `getInterpretation(dsiPercentage)`
- Provides custom interpretation based on DSI value
- Returns descriptive text for different ranges

#### `calculateEfficiency(actualScore, maxScore)`
- Calculates efficiency percentage (inverse of DSI)
- Lower DSI = Higher efficiency
- Useful for positive metrics display

#### `formatForDisplay(data)`
- Formats API data for UI display
- Returns formatted strings and calculated values
- Includes summary information

### Component Usage

#### Basic API Integration
```tsx
<DefectSeverityIndex 
  projectId={1}
/>
```

#### With Fallback Value
```tsx
<DefectSeverityIndex 
  projectId={1}
  value={57.5} // Fallback if API fails
/>
```

#### Static Value (Backward Compatibility)
```tsx
<DefectSeverityIndex 
  value={45.0}
/>
```

### Component States

1. **Loading State**: Shows spinner while fetching data
2. **Success State**: Displays pill chart with API data
3. **Error State**: Shows error message with retry option
4. **Fallback State**: Uses static value if API fails

### Visual Design

The component features:
- **Pill Chart**: Vertical progress indicator showing DSI percentage
- **Dynamic Color Coding**: Changes based on severity level
- **Detailed Information**: Shows interpretation and defect statistics
- **Scale Labels**: 0, 25, 50, 75, 100 markers
- **Responsive Layout**: Adapts to different screen sizes

### Error Handling

The implementation handles various error scenarios:

- **Invalid Parameters**: Validates projectId before API call
- **Network Errors**: Displays user-friendly network error messages
- **API Errors**: Handles 400 Bad Request (no defects found)
- **Project Not Found**: Specific handling for missing project data
- **Timeout**: Configured with 10-second timeout

### Type Safety

All API responses and component props are fully typed:

```typescript
interface DefectSeverityIndexData {
  projectId: number;
  totalDefects: number;
  actualSeverityScore: number;
  maximumSeverityScore: number;
  dsiPercentage: number;
  interpretation: string;
}
```

## Testing

### Manual Testing
Use the test utilities in `src/utils/testDefectSeverityIndexAPI.ts`:

```typescript
import { testDefectSeverityIndexAPI } from '../utils/testDefectSeverityIndexAPI';

// Test with project ID 1
await testDefectSeverityIndexAPI(1);
```

### Component Testing
See examples in `src/examples/DefectSeverityIndexExamples.tsx` for various usage patterns.

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
6. **Consider the DSI calculation method** when interpreting results

## Interpretation Guidelines

- **0-25%**: Excellent - Mostly low-severity defects
- **25-50%**: Good - Balanced defect distribution
- **50-75%**: Concerning - Higher severity defects present
- **75-100%**: Critical - Many high-severity defects

## Future Enhancements

1. **Trend Analysis**: Track DSI changes over time
2. **Breakdown View**: Show defect distribution by severity
3. **Benchmarking**: Compare against industry standards
4. **Alerts**: Notify when DSI exceeds thresholds
5. **Caching**: Implement response caching
6. **Real-time Updates**: WebSocket integration for live data
