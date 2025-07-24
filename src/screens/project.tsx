import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView as RNScrollView } from 'react-native';
import DefectPieCharts from './DefectPieCharts';
import DefectToRemarkRatio from './DefectToRemarkRatio';
import TimeToFindDefects from './TimeToFindDefects';
import DefectsByModule from './DefectsByModule';

interface ProjectDetailsProps {
  route: {
    params: {
      id: string;
      name: string;
      severity: string;
    };
  };
  navigation: any;
}

const DEFECT_DATA = [
  {
    severity: 'High Risk',
    color: '#e53935',
    borderColor: '#e53935',
    total: 112,
    breakdown: [
      { label: 'REOPEN', color: '#f44336', count: 3 },
      { label: 'NEW', color: '#3f51b5', count: 50 },
      { label: 'OPEN', color: '#4caf50', count: 5 },
      { label: 'FIXED', color: '#8bc34a', count: 14 },
      { label: 'CLOSED', color: '#607d8b', count: 37 },
      { label: 'REJECTED', color: '#b71c1c', count: 0 },
      { label: 'DUPLICATE', color: '#616161', count: 3 },
    ],
  },
  {
    severity: 'Medium Risk',
    color: '#fbc02d',
    borderColor: '#fbc02d',
    total: 237,
    breakdown: [
      { label: 'REOPEN', color: '#f44336', count: 5 },
      { label: 'NEW', color: '#3f51b5', count: 126 },
      { label: 'OPEN', color: '#4caf50', count: 10 },
      { label: 'FIXED', color: '#8bc34a', count: 33 },
      { label: 'CLOSED', color: '#607d8b', count: 60 },
      { label: 'REJECTED', color: '#b71c1c', count: 2 },
      { label: 'DUPLICATE', color: '#616161', count: 1 },
    ],
  },
  {
    severity: 'Low Risk',
    color: '#43a047',
    borderColor: '#43a047',
    total: 96,
    breakdown: [
      { label: 'REOPEN', color: '#f44336', count: 1 },
      { label: 'NEW', color: '#3f51b5', count: 57 },
      { label: 'OPEN', color: '#4caf50', count: 0 },
      { label: 'FIXED', color: '#8bc34a', count: 10 },
      { label: 'CLOSED', color: '#607d8b', count: 24 },
      { label: 'REJECTED', color: '#b71c1c', count: 1 },
      { label: 'DUPLICATE', color: '#616161', count: 3 },
    ],
  },
];

const PROJECTS = [
  { id: '1', name: 'Defect Tracker', severity: 'High Risk' },
  { id: '2', name: 'QA testing', severity: 'High Risk' },
  { id: '3', name: 'Project 1', severity: 'Low Risk' },
  { id: '4', name: 'Project 2', severity: 'Low Risk' },
  { id: '5', name: 'Dashbord testing', severity: 'High Risk' },
  { id: '6', name: 'Project 3', severity: 'Low Risk' },
  { id: '7', name: 'Project 4', severity: 'Low Risk' },
  { id: '8', name: 'Project 5', severity: 'Medium Risk' },
  { id: '9', name: 'Project 6', severity: 'Medium Risk' },
  { id: '10', name: 'Project 7', severity: 'Medium Risk' },
  // { id: '11', name: 'Project 8', severity: 'Low Risk' },
  // { id: '12', name: 'Project 9', severity: 'Medium Risk' },
  // { id: '13', name: 'Project 10', severity: 'Low Risk' },
  // { id: '14', name: 'Project 11', severity: 'Medium Risk' },
  // { id: '15', name: 'Project 12', severity: 'Low Risk' },
];

const ProjectDetailsScreen: React.FC<ProjectDetailsProps> = ({ route, navigation }) => {
  const { id, name, severity } = route.params;

  const handleBack = () => {
    navigation.goBack();
  };

  // Responsive logic for statusRow
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 400;

  return (
    <View style={{ flex: 1, backgroundColor: '#f7fafd' }}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBack} style={styles.iconButton} accessibilityLabel="Back">
          <Icon name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.header}>Project Overview</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Project Selection Bar */}
        <View style={styles.selectionBarContainer}>
          <Text style={styles.selectionLabel}>Project Selection</Text>
          <RNScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectionScroll}>
            {PROJECTS.map((proj) => (
              <TouchableOpacity
                key={proj.id + proj.name}
                style={[styles.selectionBtn, name === proj.name && styles.selectionBtnActive]}
                onPress={() => {
                  if (proj.name !== name) {
                    navigation.replace('ProjectDetails', {
                      id: proj.id,
                      name: proj.name,
                      severity: proj.severity,
                    });
                  }
                }}
              >
                <Text style={[styles.selectionBtnText, name === proj.name && styles.selectionBtnTextActive]}>{proj.name}</Text>
              </TouchableOpacity>
            ))}
          </RNScrollView>
        </View>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.severity}>Severity: {severity}</Text>
        {/* Defect Severity Breakdown Tables */}
        <Text style={styles.sectionTitle}>Defect Severity Breakdown</Text>
        <View style={[styles.statusRow, isSmallScreen && { flexDirection: 'column' }]}> {/* Responsive row/column */}
          {DEFECT_DATA.map((def, idx) => (
            <View key={def.severity} style={[styles.breakdownCard, { borderColor: def.borderColor, backgroundColor: '#fff', shadowColor: def.color }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6}}>
                <Text style={[styles.breakdownTitle, { color: def.color }]}>{`Defects on ${def.severity.split(' ')[0]}`}</Text>
                <Text style={styles.breakdownTotal}>{`Total: ${def.total}`}</Text>
              </View>
              {def.breakdown.map((item) => (
                <View key={item.label} style={styles.breakdownRowItem}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={styles.breakdownLabel}>{item.label}</Text>
                  <Text style={styles.breakdownCount}>{item.count}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.chartBtn}>
                <Text style={styles.chartBtnText}>View Chart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={{ height: 48 }} />
        {/* Placeholder for graphs */}
        <View style={styles.graphSection}>
          <Text style={styles.graphTitle}>Defect Density</Text>
          <View style={styles.graphPlaceholder} />
        </View>
        <View style={styles.graphSection}>
          <Text style={styles.graphTitle}>Defect Severity Index</Text>
          <View style={styles.graphPlaceholder} />
        </View>
        <View style={styles.graphSection}>
          <Text style={styles.graphTitle}>Defect to Remark Ratio</Text>
          <DefectToRemarkRatio />
        </View>
        <View style={styles.graphSection}>
          <Text style={styles.graphTitle}>Time to Find Defects</Text>
          <TimeToFindDefects />
        </View>
        <View style={styles.graphSection}>
          <Text style={styles.graphTitle}>Defects by Module</Text>
          <DefectsByModule />
        </View>
        {/* Add more graph sections as needed */}
        <DefectPieCharts />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafd',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
    minHeight: 48,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  iconButton: {
    padding: 6,
    marginRight: 8,
    marginTop: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  severity: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  graphSection: {
    marginBottom: 28,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976d2',
  },
  graphPlaceholder: {
    height: 140,
    backgroundColor: '#e3eafc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 10,
    color: '#222',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 0, // for React Native 0.71+, otherwise use margin
  },
  breakdownCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 14,
    marginHorizontal: 6,
    padding: 12,
    backgroundColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  breakdownTitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  breakdownTotal: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#888',
  },
  breakdownRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#333',
    width: 70,
  },
  breakdownCount: {
    fontSize: 13,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  chartBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#e3eafc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chartBtnText: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 13,
  },
  selectionBarContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  selectionLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
    color: '#222',
  },
  selectionScroll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e3eafc',
    marginRight: 10,
  },
  selectionBtnActive: {
    backgroundColor: '#1976d2',
  },
  selectionBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  selectionBtnTextActive: {
    color: '#fff',
  },
});

export default ProjectDetailsScreen;
