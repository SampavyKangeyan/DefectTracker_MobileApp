import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PieChart from 'react-native-pie-chart';

interface ModuleDefect {
  name: string;
  value: number;
  color: string;
}

const MODULE_DEFECTS: ModuleDefect[] = [
  { name: 'Configurations', value: 78, color: '#4285F4' },
  { name: 'Project Management', value: 50, color: '#34a853' },
  { name: 'Bench', value: 57, color: '#fbbc05' },
  { name: 'Defects', value: 63, color: '#ea4335' },
  { name: 'Test Cases', value: 54, color: '#a142f4' },
  { name: 'Employee', value: 67, color: '#00bfae' },
  { name: 'Releases', value: 35, color: '#ff7043' },
  { name: 'Project 22', value: 22, color: '#c0ca33' },
  { name: 'Main Template', value: 4, color: '#8d6e63' },
  { name: 'Dashboard', value: 17, color: '#1976d2' },
];

const total = MODULE_DEFECTS.reduce((sum, m) => sum + m.value, 0);

const DefectsByModule: React.FC = () => {
  const widthAndHeight = 140;
//   const series = MODULE_DEFECTS.map(m => m.count);
  const sliceColors = MODULE_DEFECTS.map(m => m.color);

  return (
    // <View style={styles.card}>
    <View>
      <Text style={styles.title}>Defects by Module</Text>
      <View style={styles.pieRow}>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={MODULE_DEFECTS}
        //   sliceColor={sliceColors}
        //   coverRadius={0.6}
        //   coverFill={'#fff'}
        />
        <View style={styles.legendContainer}>
          {MODULE_DEFECTS.map((m, idx) => (
            <View key={m.name} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: m.color }]} />
              <Text style={styles.legendText}>
                {m.name} {m.value} ({((m.value / total) * 100).toFixed(2)}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     margin: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     elevation: 3,
//     width: '92%',
//     alignSelf: 'center',
//   },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendContainer: {
    marginLeft: 18,
    flex: 1,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 7,
  },
  legendText: {
    fontSize: 13,
    color: '#333',
  },
});

export default DefectsByModule;
