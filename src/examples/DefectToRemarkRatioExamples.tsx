/**
 * Examples of how to use the DefectToRemarkRatio component
 * This file demonstrates different usage patterns for the component
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DefectToRemarkRatio from '../screens/DefectToRemarkRatio';

const DefectToRemarkRatioExamples: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Defect to Remark Ratio Examples</Text>
      
      {/* Example 1: Using with static value (backward compatibility) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Static Value (Backward Compatibility)</Text>
        <Text style={styles.description}>
          Using the component with a hardcoded ratio for testing or when API is not available.
        </Text>
        <DefectToRemarkRatio 
          staticRatio={0.95} 
          title="Static Ratio"
        />
      </View>

      {/* Example 2: Using with API integration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. API Integration</Text>
        <Text style={styles.description}>
          Fetching real-time data from the API using projectId parameter.
        </Text>
        <DefectToRemarkRatio 
          projectId={1}
          title="Live API Data"
        />
      </View>

      {/* Example 3: API with fallback value */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. API with Fallback</Text>
        <Text style={styles.description}>
          Using API data but providing a fallback value in case the API fails.
        </Text>
        <DefectToRemarkRatio 
          projectId={1}
          staticRatio={0.88} // Fallback value
          title="API with Fallback"
        />
      </View>

      {/* Example 4: Different risk levels */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Different Risk Levels</Text>
        <Text style={styles.description}>
          Examples showing different risk levels (Low, Medium, High).
        </Text>
        
        <View style={styles.riskExamples}>
          <DefectToRemarkRatio 
            staticRatio={0.99} 
            title="Low Risk (99%)"
          />
          <DefectToRemarkRatio 
            staticRatio={0.94} 
            title="Medium Risk (94%)"
          />
          <DefectToRemarkRatio 
            staticRatio={0.85} 
            title="High Risk (85%)"
          />
        </View>
      </View>

      {/* Usage Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usage Instructions</Text>
        <Text style={styles.instructionText}>
          <Text style={styles.bold}>Props:</Text>{'\n'}
          • <Text style={styles.bold}>projectId</Text>: Project ID for API call (optional){'\n'}
          • <Text style={styles.bold}>staticRatio</Text>: Static ratio value 0-1 (optional, default: 0.92){'\n'}
          • <Text style={styles.bold}>title</Text>: Component title (default: "Defect to Remark Ratio"){'\n\n'}
          
          <Text style={styles.bold}>API Integration:</Text>{'\n'}
          • Provide projectId to fetch data from API{'\n'}
          • API data takes precedence over static ratio{'\n'}
          • Component shows loading state during API call{'\n'}
          • Error state is displayed if API call fails{'\n'}
          • Falls back to static ratio if API fails{'\n\n'}
          
          <Text style={styles.bold}>Risk Levels:</Text>{'\n'}
          • <Text style={styles.green}>Green (98-100%)</Text>: Low risk, excellent ratio{'\n'}
          • <Text style={styles.yellow}>Yellow (90-98%)</Text>: Medium risk, good ratio{'\n'}
          • <Text style={styles.red}>Red (<90%)</Text>: High risk, needs attention{'\n\n'}
          
          <Text style={styles.bold}>API Response Format:</Text>{'\n'}
          • <Text style={styles.bold}>ratio</Text>: Percentage string (e.g., "95.50%"){'\n'}
          • <Text style={styles.bold}>category</Text>: Risk level ("Low", "Medium", "High"){'\n'}
          • <Text style={styles.bold}>color</Text>: Color indicator ("green", "yellow", "red"){'\n'}
          • <Text style={styles.bold}>defects</Text>: Number of defects{'\n'}
          • <Text style={styles.bold}>remarks</Text>: Number of remarks{'\n'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafd',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  riskExamples: {
    gap: 16,
  },
  instructionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
  },
  green: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  yellow: {
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  red: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
});

export default DefectToRemarkRatioExamples;
