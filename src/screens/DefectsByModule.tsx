import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PieChart from 'react-native-pie-chart';

interface ModuleDefect {
  name: string;
  value: number;
  color: string;
}

const MODULE_DEFECTS: ModuleDefect[] = [
  { name: 'Configurations', value: 77, color: '#4285F4' },
  { name: 'Project Management', value: 55, color: '#34a853' },
  { name: 'Bench', value: 58, color: '#fbbc05' },
  { name: 'Defects', value: 68, color: '#ea4335' },
  { name: 'Test Cases', value: 58, color: '#00bfae' },
  { name: 'Employee', value: 67, color: '#a142f4' },
  { name: 'Releases', value: 34, color: '#ff7043' },
  { name: 'Project', value: 22, color: '#c0ca33' },
  { name: 'Main Template', value: 4, color: '#8d6e63' },
  { name: 'Dashboard', value: 19, color: '#2D6A4F' },
];

const total = MODULE_DEFECTS.reduce((sum, m) => sum + m.value, 0);

const DefectsByModule: React.FC = () => {
  const widthAndHeight = 220;
//   const series = MODULE_DEFECTS.map(m => m.count);
  const sliceColors = MODULE_DEFECTS.map(m => m.color);

  // Sort modules by value in descending order for the legend
  const sortedModules = [...MODULE_DEFECTS].sort((a, b) => b.value - a.value);

  return (
    <View>
      <Text style={styles.title}>Defects by Module</Text>
      {/* Pie Chart centered */}
      <View style={styles.chartContainer}>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={MODULE_DEFECTS}
        //   sliceColor={sliceColors}
        //   coverRadius={0.6}
        //   coverFill={'#fff'}
        />
      </View>
      {/* Legend below the chart */}
      <View style={styles.legendGrid}>
        {sortedModules.map((m) => (
          <View key={m.name} style={styles.legendItem}>
            <View style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: m.color }]} />
              <Text style={styles.moduleNameText}>{m.name} : </Text>
              <Text style={styles.valueText}>
                {m.value} - ({((m.value / total) * 100).toFixed(1)}%)
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  legendGrid: {
    flexDirection: 'column',
    alignSelf: 'center',
  },
  legendItem: {
    width: '100%',
    marginBottom: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  moduleNameText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  valueText: {
    fontSize: 11,
    color: '#666',
  },
});

export default DefectsByModule;
