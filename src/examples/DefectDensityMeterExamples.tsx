/**
 * Examples of how to use the DefectDensityMeter component
 * This file demonstrates different usage patterns for the component
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DefectDensityMeter from '../screens/DefectDensityMeter';

const DefectDensityMeterExamples: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Defect Density Meter Examples</Text>
      
      {/* Example 1: Using with static value (backward compatibility) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Static Value (Backward Compatibility)</Text>
        <Text style={styles.description}>
          Using the component with a hardcoded value for testing or when API is not available.
        </Text>
        <DefectDensityMeter 
          value={5.2} 
          title="Static Defect Density"
        />
      </View>

      {/* Example 2: Using with API integration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. API Integration</Text>
        <Text style={styles.description}>
          Fetching real-time data from the API using projectId and kloc parameters.
        </Text>
        <DefectDensityMeter 
          projectId={1} 
          kloc={0.01}
          title="Live API Data"
        />
      </View>

      {/* Example 3: API with fallback value */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. API with Fallback</Text>
        <Text style={styles.description}>
          Using API data but providing a fallback value in case the API fails.
        </Text>
        <DefectDensityMeter 
          projectId={1} 
          kloc={0.01}
          value={8.5} // Fallback value
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
          <DefectDensityMeter 
            value={3.5} 
            title="Low Risk Example"
            size={150}
          />
          <DefectDensityMeter 
            value={8.5} 
            title="Medium Risk Example"
            size={150}
          />
          <DefectDensityMeter 
            value={15.2} 
            title="High Risk Example"
            size={150}
          />
        </View>
      </View>

      {/* Example 5: Custom size */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Custom Size</Text>
        <Text style={styles.description}>
          Using different sizes for the meter component.
        </Text>
        <DefectDensityMeter 
          value={6.8} 
          size={250}
          title="Large Meter"
        />
      </View>

      {/* Usage Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usage Instructions</Text>
        <Text style={styles.instructionText}>
          <Text style={styles.bold}>Props:</Text>{'\n'}
          • <Text style={styles.bold}>value</Text>: Static defect density value (optional){'\n'}
          • <Text style={styles.bold}>projectId</Text>: Project ID for API call (optional){'\n'}
          • <Text style={styles.bold}>kloc</Text>: Kilo Lines of Code for API call (optional){'\n'}
          • <Text style={styles.bold}>size</Text>: Meter size in pixels (default: 200){'\n'}
          • <Text style={styles.bold}>title</Text>: Component title (default: "Defect Density"){'\n\n'}
          
          <Text style={styles.bold}>API Integration:</Text>{'\n'}
          • Provide both projectId and kloc to fetch data from API{'\n'}
          • API data takes precedence over static value{'\n'}
          • Component shows loading state during API call{'\n'}
          • Error state is displayed if API call fails{'\n\n'}
          
          <Text style={styles.bold}>Risk Levels:</Text>{'\n'}
          • <Text style={styles.green}>Green (0-7)</Text>: Good quality{'\n'}
          • <Text style={styles.yellow}>Yellow (7-10)</Text>: Moderate quality{'\n'}
          • <Text style={styles.red}>Red (10+)</Text>: High risk{'\n'}
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
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

export default DefectDensityMeterExamples;
