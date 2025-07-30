import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView as RNScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { DefectsReopenedChart, DefectDistributionChart } from './DefectPieCharts';
import DefectsByModule from './DefectsByModule';
import DefectToRemarkRatio from './DefectToRemarkRatio';
import DefectDensityMeter from './DefectDensityMeter';
import DefectSeverityIndex from './DefectSeverityIndex';
import TimeDefectCharts from './TimeDefectCharts';
import ProjectService from '../services/projectService';
import { Project as ProjectType, LoadingState } from '../types/api';


// Import the navigation types from App.tsx
type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  ProjectDetails: {
    id: string;
    name: string;
    severity: string;
  };
  DefectSeverityBreakdown: undefined;
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

// Fallback project data (in case API fails)
const FALLBACK_PROJECTS: ProjectType[] = [
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
  { id: '11', name: 'Project 9', severity: 'Medium Risk' },
];

interface BreakdownItem {
  label: string;
  count: number;
  color: string;
}

interface DefectDataType {
  severity: string;
  total: number;
  color: string;
  borderColor: string;
  breakdown: BreakdownItem[];
}

const Project: React.FC<ProjectDetailsProps> = ({ route, navigation }) => {
  // State management
  const [projects, setProjects] = useState<ProjectType[]>(FALLBACK_PROJECTS);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });

  // Use local state for selected project
  const [selectedProject, setSelectedProject] = useState({
    id: route.params.id,
    name: route.params.name,
    severity: route.params.severity,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<DefectDataType | null>(null);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);

  // Load projects from API
  const loadProjects = async () => {
    try {
      setLoadingState({ isLoading: true, error: null });
      const apiProjects = await ProjectService.getProjects();
      setProjects(apiProjects);
      setLoadingState({ isLoading: false, error: null });
    } catch (error: any) {
      console.error('Failed to load projects:', error);
      setLoadingState({
        isLoading: false,
        error: error.message || 'Failed to load projects'
      });
      // Keep fallback projects on error
      setProjects(FALLBACK_PROJECTS);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('credentials');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High Risk':
        return '#e53935'; // Red
      case 'Medium Risk':
        return '#fbc02d'; // Yellow/Orange
      case 'Low Risk':
        return '#43a047'; // Green
      default:
        return '#666'; // Default gray
    }
  };

  // Responsive logic for statusRow
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 400;

  // Get defect data from DefectSeverityBreakdown component
  const allDefectData: DefectDataType[] = [
    {
      severity: 'High Risk',
      total: 99,
      color: '#e53935',
      borderColor: '#e53935',
      breakdown: [
        { label: 'CLOSED', count: 61, color: '#4caf50' },
        { label: 'NEW', count: 11, color: '#ff9800' },
        { label: 'OPEN', count: 4, color: '#2196f3' },
        { label: 'REOPEN', count: 3, color: '#f44336' },
        { label: 'FIXED', count: 12, color: '#00e676' },
        { label: 'REJECTED', count: 8, color: '#9c27b0' },
        { label: 'DUPLICATE', count: 15, color: '#607d8b' },
      ]
    },
    {
      severity: 'Medium Risk',
      total: 64,
      color: '#fbc02d',
      borderColor: '#fbc02d',
      breakdown: [
        { label: 'CLOSED', count: 40, color: '#4caf50' },
        { label: 'NEW', count: 8, color: '#ff9800' },
        { label: 'OPEN', count: 6, color: '#2196f3' },
        { label: 'REOPEN', count: 2, color: '#f44336' },
        { label: 'FIXED', count: 8, color: '#00e676' },
        { label: 'REJECTED', count: 5, color: '#9c27b0' },
        { label: 'DUPLICATE', count: 5, color: '#607d8b' },
      ]
    },
    {
      severity: 'Low Risk',
      total: 44,
      color: '#43a047',
      borderColor: '#43a047',
      breakdown: [
        { label: 'CLOSED', count: 28, color: '#4caf50' },
        { label: 'NEW', count: 6, color: '#ff9800' },
        { label: 'OPEN', count: 4, color: '#2196f3' },
        { label: 'REOPEN', count: 1, color: '#f44336' },
        { label: 'FIXED', count: 5, color: '#00e676' },
        { label: 'REJECTED', count: 3, color: '#9c27b0' },
        { label: 'DUPLICATE', count: 3, color: '#607d8b' },
      ]
    }
  ];

  const handleViewChart = (data: DefectDataType) => {
    setSelectedSeverity(data);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7fafd' }}>
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={handleBack}>
            <Icon name="arrow-back" size={22} color="#222" />
          </TouchableOpacity>
        </View>
        <View style={styles.middleSection}>
          <Text style={styles.header}>Project</Text>
          <Text style={styles.appTitle}>DefectTracker Pro</Text>   
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => setNotificationModalVisible(true)}
          >
            <Icon name="notifications" size={20} color="#000000ff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>
                {projects.filter(p => p.severity === 'High Risk').length}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Icon name="logout" size={20} color="#e53935" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Fix the selection bar at the top, outside the ScrollView */}
      <View style={styles.selectionBarContainer}>
        <Text style={styles.selectionLabel}>Project Selection</Text>
        <RNScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectionScroll}>
          {[...projects].sort((a, b) => {
            // Put selected project first
            if (a.name === selectedProject.name) return -1;
            if (b.name === selectedProject.name) return 1;
            return 0;
          }).map((proj) => (
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
        <View style={styles.barContainer}>
        <Text style={styles.title}>{selectedProject.name}</Text>
        <Text style={styles.severityLabel}>Severity:</Text>
        <Text style={[styles.severity, { color: getSeverityColor(selectedProject.severity) }]}>
          {selectedProject.severity}
        </Text>
        </View>
        {/* Defect Severity Breakdown Tables */}
        <View style={styles.cardWithBorder}>
        <Text style={styles.sectionTitle}>Defect Severity Breakdown</Text>
        <View style={styles.cardsContainer}>
          {allDefectData.map(data => (
            <View
              key={data.severity}
              style={[
                styles.breakdownCard,
                {
                  borderColor: data.borderColor,
                  backgroundColor: '#fff',
                  shadowColor: data.color,
                  borderWidth: 2,
                }
              ]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                <Text style={[styles.breakdownTitle, { color: data.color }]}>
                  {`Defects on ${data.severity.split(' ')[0]}`}
                </Text>
                <Text style={styles.breakdownTotal}>{`Total: ${data.total}`}</Text>
              </View>
              {data.breakdown.map((item) => (
                <View key={item.label} style={styles.breakdownRowItem}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={styles.breakdownLabel}>{item.label}</Text>
                  <Text style={styles.breakdownCount}>{item.count}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.chartBtn}
                onPress={() => handleViewChart(data)}
              >
                <Text style={styles.chartBtnText}>View Chart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        </View>
        <DefectDensityMeter
          projectId={parseInt(route.params.id)}
          kloc={0.01} // You can make this dynamic based on project data
          value={12} // Fallback value if API fails
        />
        <View>
          <DefectSeverityIndex
            projectId={parseInt(route.params.id)}
            value={75.0} // Fallback value if API fails
          />
        </View>
        <View>
          <DefectToRemarkRatio
            projectId={parseInt(route.params.id)}
            staticRatio={0.92} // Fallback value if API fails
          />
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

      {/* Pie Chart Modal */}
      {selectedSeverity && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Status Breakdown for {selectedSeverity.severity.split(' ')[0]}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <PieChart
                data={selectedSeverity.breakdown.map(item => ({
                  name: item.label,
                  population: item.count,
                  color: item.color,
                  legendFontColor: '#333',
                  legendFontSize: 12,
                }))}
                width={screenWidth - 40}
                height={180}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
                hasLegend={true}
                center={[0, 0]}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Notification Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={notificationModalVisible}
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Critical Severity Notifications</Text>
              <TouchableOpacity
                onPress={() => setNotificationModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.notificationList}>
              {projects.filter(p => p.severity === 'High Risk').map((project) => (
                <View key={project.id} style={styles.notificationItem}>
                  <Icon name="warning" size={20} color="#ff0000ff" />
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{project.name}</Text>
                    <Text style={styles.notificationSubtitle}>High Risk - Requires immediate attention</Text>
                  </View>
                </View>
              ))}
              {projects.filter(p => p.severity === 'High Risk').length === 0 && (
                <Text style={styles.noNotifications}>No critical notifications</Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fffbff',
    padding: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 4,
    minHeight: 20,
    paddingHorizontal: 0,
    paddingVertical:5,
    backgroundColor: 'transparent',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
   middleSection: {
    flex:7 ,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap:20
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  
  },
   appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D6A4F',
  },

  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#2D6A4F',
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  barContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },  
  severityLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
    fontWeight: '400',
  },
  severity: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
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
    backgroundColor: '#b4f4d7ff',
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
    backgroundColor: '#c3d3ccff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chartBtnText: {
    color: '#000000ff',
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
    backgroundColor: '#c3d3ccff',
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
    // padding: 16,
    paddingHorizontal: 16,
    marginBottom:25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingBottom: 5,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    margin: 20,
    width: '95%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    marginRight: 8,
  },
  logoutButton: {
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 3,
    right: 2,
    backgroundColor: '#e53935',
    borderRadius: 12,
    minWidth: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    width: '90%',
    maxHeight: '70%',
  },
  notificationList: {
    maxHeight: 300,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  noNotifications: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    padding: 20,
  },
});

export default Project;
