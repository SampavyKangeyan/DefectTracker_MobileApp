import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import DefectSeverityIndexService from '../services/defectSeverityIndex';
import { DefectSeverityIndexData } from '../types/api';

interface DefectSeverityIndexProps {
  value?: number; // Optional for backward compatibility
  projectId?: number; // For API integration
  title?: string;
}

const getColor = (val: number) => {
  if (val < 25) return '#10b981'; // green
  if (val < 75) return '#facc15'; // yellow
  return '#ef4444'; // red
};

const DefectSeverityIndex: React.FC<DefectSeverityIndexProps> = ({
  value,
  projectId,
  title = 'Defect Severity Index'
}) => {
  const [apiData, setApiData] = useState<DefectSeverityIndexData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API if projectId is provided
  useEffect(() => {
    const fetchDefectSeverityIndex = async () => {
      if (projectId) {
        setLoading(true);
        setError(null);
        try {
          const data = await DefectSeverityIndexService.getDefectSeverityIndex(projectId);
          setApiData(data);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch defect severity index data');
          console.error('Error fetching defect severity index:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDefectSeverityIndex();
  }, [projectId]);

  // Determine values to display (API data takes precedence)
  const displayValue = apiData?.dsiPercentage ?? value ?? 0;
  const color = getColor(displayValue);

  // Show loading state
  if (loading) {
    return (
      <View style={styles.cardWithBorder}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading severity index...</Text>
        </View>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={styles.cardWithBorder}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Text style={styles.errorSubtext}>Please check your connection and try again</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cardWithBorder}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <View style={styles.pillContainer}>
          <View style={styles.pillBg} />
          <View style={[styles.pillFill, { height: `${displayValue}%`, backgroundColor: color }]} />
          <View style={styles.pillLabels}>
            <Text style={styles.pillLabel}>100</Text>
            <Text style={styles.pillLabel}>75</Text>
            <Text style={styles.pillLabel}>50</Text>
            <Text style={styles.pillLabel}>25</Text>
            <Text style={styles.pillLabel}>0</Text>
          </View>
        </View>
        <View style={styles.valueCol}>
          <Text style={[styles.value, { color }]}>{displayValue.toFixed(1)}</Text>
          {/* Show additional API data if available */}
          {apiData ? (
            <View style={styles.detailContainer}>
              <Text style={styles.desc}>{apiData.interpretation}</Text>
              <Text style={styles.detailText}>
                {apiData.totalDefects} defects • Score: {apiData.actualSeverityScore}/{apiData.maximumSeverityScore}
              </Text>
            </View>
          ) : (
            <Text style={styles.desc}>Weighted severity score (higher = more severe defects)</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // card: {
  //   backgroundColor: '#fff',
  //   borderRadius: 16,
  //   padding: 18,
  //   marginBottom: 25,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.06,
  //   shadowRadius: 4,
  //   elevation: 2,
  //   borderWidth: 1,
  //   borderColor: '#e0e0e0',
  // },
  cardWithBorder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom:25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pillContainer: {
    width: 32,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginRight: 18,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  pillBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  pillFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    width: '100%',
  },
  pillLabels: {
    position: 'absolute',
    left: 36,
    top: 0,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pillLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 0,
  },
  valueCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginTop: 2,
  },
  detailContainer: {
    alignItems: 'center',
    marginTop: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default DefectSeverityIndex;
