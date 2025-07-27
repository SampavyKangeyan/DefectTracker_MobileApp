import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const STATIC_DEFECT_TO_REMARK_RATIO = 0.92;

const DefectToRemarkRatio: React.FC = () => {
  // Calculate fill percent for the bar (max 1.0)
  const fillPercent = Math.min(STATIC_DEFECT_TO_REMARK_RATIO, 1.0);

  return (
    <View style={styles.cardWithBorder}>
      <Text style={styles.title}>Defect to Remark Ratio</Text>
      <View style={styles.ratioCard}>
        <Text style={styles.ratioValue}>{STATIC_DEFECT_TO_REMARK_RATIO}</Text>
        <Text style={styles.ratioLabel}>Critical</Text>
        <View style={styles.ratioBar}>
          <View style={[styles.ratioBarFill, { width: `${fillPercent * 100}%` }]} />
        </View>
        <View style={styles.ratioBarLabels}>
          <Text style={styles.ratioBarLabelNum}>0.0</Text>
          <Text style={styles.ratioBarLabelNum}>0.5</Text>
          <Text style={styles.ratioBarLabelNum}>1.0</Text>
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
});

export default DefectToRemarkRatio;