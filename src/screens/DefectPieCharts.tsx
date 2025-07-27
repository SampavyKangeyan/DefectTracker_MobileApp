import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

export const DefectsReopenedChart: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40;

  const reopenedData = [
    {
      name: '2 times',
      population: 3,
      color: '#00bfae',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: '3 times',
      population: 1,
      color: '#4285F4',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: '4 times',
      population: 6,
      color: '#fbbc05',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: '5 times',
      population: 2,
      color: '#ff995aff',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: '5+ times',
      population: 6,
      color: '#ff0000ff',
      legendFontColor: '#333',
      legendFontSize: 14,
    }
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View>
      <Text style={styles.title}>Defects Reopened Multiple Times</Text>
      <PieChart
        data={reopenedData}
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
    <View >
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

const DefectPieCharts: React.FC = () => {
  return (
    <View>
      <View style={styles.chartContainer}>
        <DefectsReopenedChart />
      </View>
      <View style={styles.chartContainer}>
        <DefectDistributionChart />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
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
