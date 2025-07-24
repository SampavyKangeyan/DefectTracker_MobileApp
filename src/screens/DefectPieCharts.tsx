import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const DefectPieCharts: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40;

  const reopenedData = [
    {
      name: '2 times',
      population: 5,
      color: '#4285F4',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: '4 times',
      population: 1,
      color: '#fbbc05',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

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
      color: '#ea4335',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.chartBlock}>
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
        />
      </View>

      <View style={styles.chartBlock}>
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
        />
        <Text style={[styles.total, { marginTop: 8 }]}>459 Total Defects</Text>
        <Text style={styles.common}>245 Most Common: Functionality</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  chartBlock: {
    marginBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '600',
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
