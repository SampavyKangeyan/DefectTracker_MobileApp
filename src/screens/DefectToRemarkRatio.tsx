import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const DefectToRemarkRatio: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;
  
  // Mock data
  const ratio = 2.1;
  const status = 'Critical';
  const progressValue = 0.7; // 70% of the way to critical threshold
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Defect to Remark Ratio</Text>
      
      <View style={styles.ratioContainer}>
        <Text style={styles.ratioText}>{ratio}:1</Text>
        <Text style={styles.statusText}>{status}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressValue * 100}%` }
            ]} 
          />
        </View>
        
        <View style={styles.labelsContainer}>
          <Text style={styles.labelText}>0.0</Text>
          <Text style={styles.labelText}>0.5</Text>
          <Text style={styles.labelText}>1.0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  ratioContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratioText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#e53935',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e53935',
    borderRadius: 4,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    fontSize: 12,
    color: '#666',
  },
});

export default DefectToRemarkRatio;