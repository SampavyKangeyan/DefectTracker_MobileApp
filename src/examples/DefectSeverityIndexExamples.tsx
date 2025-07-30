/**
 * Examples of how to use the DefectSeverityIndex component
 * This file demonstrates different usage patterns for the component
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DefectSeverityIndex from '../screens/DefectSeverityIndex';

const DefectSeverityIndexExamples: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Defect Severity Index Examples</Text>
      
      {/* Example 1: Using with static value (backward compatibility) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Static Value (Backward Compatibility)</Text>
        <Text style={styles.description}>
          Using the component with a hardcoded DSI value for testing or when API is not available.
        </Text>
        <DefectSeverityIndex 
          value={57.5} 
          title="Static DSI"
        />
      </View>

      {/* Example 2: Using with API integration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. API Integration</Text>
        <Text style={styles.description}>
          Fetching real-time data from the API using projectId parameter.
        </Text>
        <DefectSeverityIndex 
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
        <DefectSeverityIndex 
          projectId={1}
          value={45.0} // Fallback value
          title="API with Fallback"
        />
      </View>

      {/* Example 4: Different severity levels */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Different Severity Levels</Text>
        <Text style={styles.description}>
          Examples showing different severity levels (Low, Medium, High).
        </Text>
        
        <View style={styles.severityExamples}>
          <DefectSeverityIndex 
            value={15.5} 
            title="Low Severity (15.5%)"
          />
          <DefectSeverityIndex 
            value={45.2} 
            title="Medium Severity (45.2%)"
          />
          <DefectSeverityIndex 
            value={85.7} 
            title="High Severity (85.7%)"
          />
        </View>
      </View>

      {/* Usage Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usage Instructions</Text>
        <Text style={styles.instructionText}>
          <Text style={styles.bold}>Props:</Text>{'\n'}
          • <Text style={styles.bold}>projectId</Text>: Project ID for API call (optional){'\n'}
          • <Text style={styles.bold}>value</Text>: Static DSI percentage 0-100 (optional){'\n'}
          • <Text style={styles.bold}>title</Text>: Component title (default: "Defect Severity Index"){'\n\n'}
          
          <Text style={styles.bold}>API Integration:</Text>{'\n'}
          • Provide projectId to fetch data from API{'\n'}
          • API data takes precedence over static value{'\n'}
          • Component shows loading state during API call{'\n'}
          • Error state is displayed if API call fails{'\n'}
          • Falls back to static value if API fails{'\n\n'}
          
          <Text style={styles.bold}>Severity Levels:</Text>{'\n'}
          • <Text style={styles.green}>Green (0-25%)</Text>: Low severity impact{'\n'}
          • <Text style={styles.yellow}>Yellow (25-75%)</Text>: Moderate severity impact{'\n'}
          • <Text style={styles.red}>Red (75-100%)</Text>: High severity impact{'\n\n'}
          
          <Text style={styles.bold}>DSI Calculation:</Text>{'\n'}
          • Critical defects: Weight 4{'\n'}
          • High defects: Weight 3{'\n'}
          • Medium defects: Weight 2{'\n'}
          • Low defects: Weight 1{'\n'}
          • DSI% = (Actual Score / Max Score) × 100{'\n\n'}
          
          <Text style={styles.bold}>API Response Format:</Text>{'\n'}
          • <Text style={styles.bold}>dsiPercentage</Text>: DSI percentage value{'\n'}
          • <Text style={styles.bold}>interpretation</Text>: Risk interpretation{'\n'}
          • <Text style={styles.bold}>totalDefects</Text>: Total number of defects{'\n'}
          • <Text style={styles.bold}>actualSeverityScore</Text>: Weighted score{'\n'}
          • <Text style={styles.bold}>maximumSeverityScore</Text>: Maximum possible score{'\n'}
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
  severityExamples: {
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
    color: '#facc15',
    fontWeight: 'bold',
  },
  red: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
});

export default DefectSeverityIndexExamples;
