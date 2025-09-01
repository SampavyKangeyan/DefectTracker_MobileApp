import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import apiClient from '../services/api';

interface DefectsByModuleProps {
  projectId: string;
}

const COLORS = [
  '#4285F4', '#00bfae', '#fbbc05', '#ff0000ff', '#a259f7', '#ff995aff', '#ffb300', '#8bc34a', '#607d8b', '#e91e63'
];

const DefectsByModule: React.FC<DefectsByModuleProps> = ({ projectId }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    apiClient
      .get(`/dashboard/defects-by-module/${projectId}`)
      .then((res) => {
        if (res.data && res.data.status === 'success' && Array.isArray(res.data.data)) {
          // Map backend data to chart format, filter out zero values
          const chartData = res.data.data
            .filter((item: any) => item.value > 0)
            .map((item: any, idx: number) => ({
              name: item.name,
              population: item.value,
              color: COLORS[idx % COLORS.length],
              legendFontColor: '#333',
              legendFontSize: 10,
            }));
          setData(chartData);
        } else {
          setError('Failed to load chart data');
        }
      })
      .catch(() => setError('Failed to load chart data'))
      .finally(() => setLoading(false));
  }, [projectId]);

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  if (loading) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Defects By Module</Text>
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Defects By Module</Text>
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Defects By Module</Text>
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No data available</Text>
      </View>
    );
  }

  // Calculate total and most common
  const total = data.reduce((sum, item) => sum + (item.population || 0), 0);
  const mostCommon = data.reduce(
    (max, item) => (item.population > (max?.population || 0) ? item : max),
    data[0]
  );

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>Defects By Module</Text>
      <PieChart
        data={data}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend={true}
        center={[0, 0]}
        style={styles.pieWithBorder}
      />
      <Text style={[styles.total, { marginTop: 8 }]}>{total} Total Defects</Text>
      {mostCommon && (
        <Text style={styles.common}>
          {mostCommon.population} Most Common: {mostCommon.name}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    paddingTop: 16,
    marginBottom: 40,
  },
  pieWithBorder: {
    borderWidth: 0,
    borderColor: '#fff',
    borderRadius: 0,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '600',
    color: '#222',
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
  },
  common: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
  },
});

export default DefectsByModule;
