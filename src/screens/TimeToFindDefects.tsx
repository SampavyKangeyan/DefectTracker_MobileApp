import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const TimeToFindDefects: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40;

  // Mock data for "Time to Find Defects"
  const findData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'],
    datasets: [
      {
        data: [5, 6, 8, 7, 7, 6, 5, 4, 4, 5],
        color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`, // Blue
        strokeWidth: 2,
      },
    ],
  };

  // Mock data for "Time to Fix Defects"
  const fixData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'],
    datasets: [
      {
        data: [3, 3, 5, 4, 2, 3, 2, 2, 1, 2],
        color: (opacity = 1) => `rgba(0, 191, 174, ${opacity})`, // Teal
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#4285F4',
      fill: '#4285F4',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#e0e0e0',
      strokeWidth: 1,
    },
  };

  const fixChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(0, 191, 174, ${opacity})`,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#00bfae',
      fill: '#00bfae',
    },
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Time to Find Defects</Text>
        <LineChart
          data={findData}
          width={chartWidth}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          fromZero={true}
          segments={4}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Time to Fix Defects</Text>
        <LineChart
          data={fixData}
          width={chartWidth}
          height={180}
          chartConfig={fixChartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          fromZero={true}
          segments={4}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f7fafd',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    width: '92%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  chart: {
    marginVertical: 0,
    borderRadius: 16,
  },
});

export default TimeToFindDefects;