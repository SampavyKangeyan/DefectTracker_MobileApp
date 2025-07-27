import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView as RNScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { DefectsReopenedChart, DefectDistributionChart } from './DefectPieCharts';
import DefectsByModule from './DefectsByModule';
import DefectToRemarkRatio from './DefectToRemarkRatio';  
import DefectDensityMeter from './DefectDensityMeter';
import DefectSeverityIndex from './DefectSeverityIndex';
import TimeDefectCharts from './TimeDefectCharts';


// Import the navigation types from App.tsx
type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  ProjectDetails: {
    id: string;
    name: string;
    severity: string;
  };
};

type ProjectDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProjectDetails'>;
type ProjectDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ProjectDetails'>;

export interface ProjectDetailsProps {
  route: ProjectDetailsScreenRouteProp;
  navigation: ProjectDetailsScreenNavigationProp;
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
      { label: 'OPEN', color: '#3f9d42ff', count: 5 },
      { label: 'FIXED', color: '#00ff22ff', count: 14 },
      { label: 'CLOSED', color: '#607d8b', count: 37 },
      { label: 'REJECTED', color: '#b71c1c', count: 0 },
      { label: 'DUPLICATE', color: '#616161', count: 3 },
    ],
  },
  {
    severity: 'Medium Risk',
    color: '#fbc02d',
    borderColor: '#f1fb2dff',
    total: 237,
    breakdown: [
      { label: 'REOPEN', color: '#f44336', count: 5 },
      { label: 'NEW', color: '#3f51b5', count: 126 },
      { label: 'OPEN', color: '#3f9d42ff', count: 10 },
      { label: 'FIXED', color: '#00ff22ff', count: 33 },
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
      { label: 'OPEN', color: '#3f9d42ff', count: 0 },
      { label: 'FIXED', color: '#00ff22ff', count: 10 },
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

const Project: React.FC<ProjectDetailsProps> = ({ route, navigation }) => {
  // Use local state for selected project
  const [selectedProject, setSelectedProject] = useState({
    id: route.params.id,
    name: route.params.name,
    severity: route.params.severity,
  });

  const handleBack = () => {
    navigation.goBack();
  };

  // Responsive logic for statusRow
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 400;

  // Get defect data for selected project severity
  const defectData = DEFECT_DATA.find(d => d.severity === selectedProject.severity);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7fafd' }}>
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <TouchableOpacity onPress={handleBack} style={styles.iconButton} accessibilityLabel="Back">
            <Icon name="arrow-back" size={18} color="#222" />
          </TouchableOpacity>
          <Text style={styles.header}>Project </Text>
        </View>
        <Text style={styles.appTitle}>DefectTracker Pro</Text>
      </View>
      {/* Fix the selection bar at the top, outside the ScrollView */}
      <View style={styles.selectionBarContainer}>
        <Text style={styles.selectionLabel}>Project Selection</Text>
        <RNScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectionScroll}>
          {PROJECTS.map((proj) => (
            <TouchableOpacity
              key={proj.id + proj.name}
              style={[styles.selectionBtn, selectedProject.name === proj.name && styles.selectionBtnActive]}
              onPress={() => {
                if (proj.name !== selectedProject.name) {
                  setSelectedProject({
                    id: proj.id,
                    name: proj.name,
                    severity: proj.severity,
                  });
                }
              }}
            >
              <Text style={[styles.selectionBtnText, selectedProject.name === proj.name && styles.selectionBtnTextActive]}>{proj.name}</Text>
            </TouchableOpacity>
          ))}
        </RNScrollView>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Project Selection Bar */}
        <Text style={styles.title}>{selectedProject.name}</Text>
        <Text style={styles.severity}>Severity: {selectedProject.severity}</Text>
        {/* Defect Severity Breakdown Tables */}
        <Text style={styles.sectionTitle}>Defect Severity Breakdown</Text>
        <View style={[styles.statusRow, isSmallScreen && { flexDirection: 'column' }]}>
          {defectData ? (
            <View
              key={defectData.severity}
              style={[
                styles.breakdownCard,
                { 
                  borderColor: defectData.borderColor, 
                  backgroundColor: '#fff', 
                  shadowColor: defectData.color,
                  borderWidth: 2,
                }
              ]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                <Text style={[styles.breakdownTitle, { color: defectData.color }]}>{`Defects on ${defectData.severity.split(' ')[0]}`}</Text>
                <Text style={styles.breakdownTotal}>{`Total: ${defectData.total}`}</Text>
              </View>
              {defectData.breakdown.map((item) => (
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
          ) : null}
        </View>
        <DefectDensityMeter value={12} />
        <View>
          <DefectSeverityIndex value={75.0} />
        </View>
        <View>
          <DefectToRemarkRatio />
        </View>
        <View style={[styles.cardWithBorder]}>
          <DefectsReopenedChart />
        </View>
        <View style={[styles.cardWithBorder]}>
          <DefectDistributionChart />
        </View>
        {/* Insert Time to Find Defects and Time to Fix Defects */}
        <TimeDefectCharts />
        <View style={[styles.cardWithBorder]}>
          <DefectsByModule />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafd',
    padding: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 1,
    marginBottom: 4,
    minHeight: 20,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  iconButton: {
    padding: 6,
    marginTop: 8,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    alignSelf: 'center',
    justifyContent: 'center',
    // Remove marginTop and marginBottom for better alignment in row
    marginTop: 8,
    marginBottom: 0,
    marginRight:20
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
    color: '#2D6A4F',
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
    color: '#2D6A4F',
    fontWeight: 'bold',
    fontSize: 13,
  },
  selectionBarContainer: {
    marginBottom: 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 10,
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
    backgroundColor: '#2D6A4F',
  },
  selectionBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  selectionBtnTextActive: {
    color: '#fff',
  },
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
    appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D6A4F',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 0,
    letterSpacing: 1,
  },
});

export default Project;
