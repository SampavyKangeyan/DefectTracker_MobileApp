import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import apiClient from '../services/api';


interface DefectToRemarkRatioProps {
  projectId: string;
}

const DefectToRemarkRatio: React.FC<DefectToRemarkRatioProps> = ({ projectId }) => {
  const [ratio, setRatio] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatio = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/dashboard/defect-remark-ratio/${projectId}`);
        // Use response.data directly (axios style)
        setRatio(response.data?.data?.defect_remark_ratio ?? 0);
      } catch (err: any) {
        setError('Error fetching ratio');
        setRatio(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRatio();
  }, [projectId]);

  // Calculate fill percent for the bar (max 100%)
  const fillPercent = Math.min(ratio ?? 0, 100) / 100;

  return (
    <View style={styles.cardWithBorder}>
      <Text style={styles.title}>Defect to Remark Ratio</Text>
      <View style={styles.ratioCard}>
        {loading ? (
          <ActivityIndicator size="small" color="#e53935" />
        ) : error ? (
          <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>
        ) : (
          <>
            <Text style={styles.ratioValue}>
              {ratio !== null ? `${ratio.toFixed(2)}%` : '0%'}
            </Text>
            <Text style={styles.ratioLabel}>
              {(ratio ?? 0) > 80 ? 'Critical' : 'Normal'}
            </Text>
            <View style={styles.ratioBar}>
              <View style={[styles.ratioBarFill, { width: `${fillPercent * 100}%` }]} />
            </View>
            <View style={styles.ratioBarLabels}>
              <Text style={styles.ratioBarLabelNum}>0%</Text>
              <Text style={styles.ratioBarLabelNum}>50%</Text>
              <Text style={styles.ratioBarLabelNum}>100%</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWithBorder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
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
});

export default DefectToRemarkRatio;