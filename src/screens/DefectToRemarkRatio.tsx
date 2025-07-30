import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import DefectToRemarkRatioService from '../services/defectToRemarkRatio';
import { DefectToRemarkRatioData } from '../types/api';

const STATIC_DEFECT_TO_REMARK_RATIO = 0.92;

interface DefectToRemarkRatioProps {
  projectId?: number; // For API integration
  staticRatio?: number; // For backward compatibility
  title?: string;
}

const DefectToRemarkRatio: React.FC<DefectToRemarkRatioProps> = ({
  projectId,
  staticRatio = STATIC_DEFECT_TO_REMARK_RATIO,
  title = 'Defect to Remark Ratio'
}) => {
  const [apiData, setApiData] = useState<DefectToRemarkRatioData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API if projectId is provided
  useEffect(() => {
    const fetchDefectToRemarkRatio = async () => {
      if (projectId) {
        setLoading(true);
        setError(null);
        try {
          const data = await DefectToRemarkRatioService.getDefectToRemarkRatio(projectId);
          setApiData(data);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch defect to remark ratio data');
          console.error('Error fetching defect to remark ratio:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDefectToRemarkRatio();
  }, [projectId]);

  // Determine values to display (API data takes precedence)
  const displayRatio = apiData ? DefectToRemarkRatioService.ratioToDecimal(apiData.ratio) : staticRatio;
  const displayValue = apiData ? apiData.ratio : (staticRatio * 100).toFixed(1) + '%';
  const displayCategory = apiData ? apiData.category : (staticRatio < 0.9 ? 'High' : staticRatio < 0.98 ? 'Medium' : 'Low');
  const displayColor = apiData ? DefectToRemarkRatioService.getColorHex(apiData.color) : (staticRatio < 0.9 ? '#ef4444' : staticRatio < 0.98 ? '#f59e0b' : '#10b981');

  // Calculate fill percent for the bar (max 1.0)
  const fillPercent = Math.min(displayRatio, 1.0);

  // Show loading state
  if (loading) {
    return (
      <View style={styles.cardWithBorder}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading ratio data...</Text>
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
      <View style={styles.ratioCard}>
        <Text style={[styles.ratioValue, { color: displayColor }]}>{displayValue}</Text>
        <Text style={[styles.ratioLabel, { color: displayColor }]}>{displayCategory}</Text>
        {/* Show additional API data if available */}
        {apiData && (
          <Text style={styles.detailText}>
            {apiData.defects} defects, {apiData.remarks} remarks
          </Text>
        )}
        <View style={styles.ratioBar}>
          <View style={[styles.ratioBarFill, {
            width: `${fillPercent * 100}%`,
            backgroundColor: displayColor
          }]} />
        </View>
        <View style={styles.ratioBarLabels}>
          <Text style={styles.ratioBarLabelNum}>0%</Text>
          <Text style={styles.ratioBarLabelNum}>50%</Text>
          <Text style={styles.ratioBarLabelNum}>100%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // card: {
  //   backgroundColor: '#fff',
  //   borderRadius: 16,
  //   padding: 16,
  //   margin: 16,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.08,
  //   shadowRadius: 6,
  //   elevation: 3,
  //   width: '92%',
  //   alignSelf: 'center',
  //   borderWidth: 2,
  //   borderColor: '#e3eafc',
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
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  ratioCard: {
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  ratioValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e53935',
    marginBottom: 2,
  },
  ratioLabel: {
    fontSize: 14,
    color: '#e53935',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratioBar: {
    width: '90%',
    height: 14,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratioBarFill: {
    height: '100%',
    backgroundColor: '#e53935',
    borderRadius: 8,
  },
  ratioBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 2,
  },
  ratioBarLabelNum: {
    fontSize: 12,
    color: '#6b7280',
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
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

export default DefectToRemarkRatio;