import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DefectSeverityIndexProps {
  value: number;
}

const getColor = (val: number) => {
  if (val < 25) return '#10b981'; // green
  if (val < 75) return '#facc15'; // yellow
  return '#ef4444'; // red
};

const DefectSeverityIndex: React.FC<DefectSeverityIndexProps> = ({ value }) => {
  const color = getColor(value);

  return (
    <View style={styles.cardWithBorder}>
      <Text style={styles.title}>Defect Severity Index</Text>
      <View style={styles.row}>
        <View style={styles.pillContainer}>
          <View style={styles.pillBg} />
          <View style={[styles.pillFill, { height: `${value}%`, backgroundColor: color }]} />
          <View style={styles.pillLabels}>
            <Text style={styles.pillLabel}>100</Text>
            <Text style={styles.pillLabel}>75</Text>
            <Text style={styles.pillLabel}>50</Text>
            <Text style={styles.pillLabel}>25</Text>
            <Text style={styles.pillLabel}>0</Text>
          </View>
        </View>
        <View style={styles.valueCol}>
          <Text style={[styles.value, { color }]}>{value.toFixed(1)}</Text>
          <Text style={styles.desc}>Weighted severity score (higher = more severe defects)</Text>
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
});

export default DefectSeverityIndex;
