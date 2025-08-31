import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import apiClient from '../services/api';

export const DefectsReopenedChart: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    apiClient
      .get(`/dashboard/defects-reopened-multiple-times/${projectId}`)
      .then((res) => {
        if (res.data && res.data.status === 'success' && Array.isArray(res.data.data)) {
          // Filter out zero population slices to avoid invisible chart
          const filtered = res.data.data.filter((item: any) => item.population > 0);
          setData(
            filtered.length > 0
              ? filtered.map((item: any) => ({
                  ...item,
                  legendFontColor: '#333',
                  legendFontSize: 14,
                }))
              : [
                  {
                    name: 'No Data',
                    population: 1,
                    color: '#e0e0e0',
                    legendFontColor: '#333',
                    legendFontSize: 14,
                  },
                ]
          );
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
        <Text style={styles.title}>Defects Reopened Multiple Times</Text>
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Defects Reopened Multiple Times</Text>
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  // If all populations are zero, show a message instead of an empty chart
  if (data.length === 1 && data[0].name === 'No Data') {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Defects Reopened Multiple Times</Text>
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>Defects Reopened Multiple Times</Text>
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
    </View>
  );
};

export const DefectDistributionChart: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40;

  const typeData = [
    {
      name: 'Functionality',
      population: 245,
      color: '#4285F4',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'UI',
      population: 81,
      color: '#00bfae',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Usability',
      population: 30,
      color: '#fbbc05',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Validation',
      population: 103,
      color: '#ff0000ff',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={styles.chartContainer} >
      <Text style={styles.title}>Defect Distribution by Type</Text>
      <PieChart
        data={typeData}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend={true}
        center={[0, 0]}
        // Add white border between slices
        style={styles.pieWithBorder}
      />
      <Text style={[styles.total, { marginTop: 8 }]}>459 Total Defects</Text>
      <Text style={styles.common}>245 Most Common: Functionality</Text>
    </View>
  );
};

const DefectPieCharts: React.FC<{ projectId?: string }> = ({ projectId }) => {
  return (
    <View>
      <View >
        <DefectsReopenedChart projectId={projectId} />
      </View>
      <View >
        <DefectDistributionChart />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    paddingTop: 16,
    marginBottom:40
  },
  pieWithBorder: {
    // Add white border between pie slices
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
  legend: {
    fontSize: 14,
    marginTop: 4,
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

export default DefectPieCharts;
