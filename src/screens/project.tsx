import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import ProjectService from '../services/projectServic';
import { Project } from '../services/projectServic';
import DefectSeverityBreakdown from './DefectSeverityBreakdown';


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

const ProjectDetailsScreen: React.FC<ProjectDetailsProps> = ({ route, navigation }) => {
  // Constants
  const HIGH_RISK_SEVERITY = 'High Risk';

  // Project data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use local state for selected project
  const [selectedProject, setSelectedProject] = useState({
    id: route.params.id,
    project_name: route.params.name,
    severity: route.params.severity,
  });
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await ProjectService.getProjects();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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
                {projects.filter(p => p.severity === HIGH_RISK_SEVERITY).length}
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
            if (a.project_name === selectedProject.project_name) return -1;
            if (b.project_name === selectedProject.project_name) return 1;
            return 0;
          }).map((proj) => (
            <TouchableOpacity
              key={proj.id + proj.project_name}
              style={[styles.selectionBtn, selectedProject.project_name === proj.project_name && styles.selectionBtnActive]}
              onPress={() => {
                if (proj.project_name !== selectedProject.project_name) {
                  setSelectedProject({
                    id: proj.id,
                    project_name: proj.project_name,
                    severity: proj.severity,
                  });
                }
              }}
            >
              <Text style={[styles.selectionBtnText, selectedProject.project_name === proj.project_name && styles.selectionBtnTextActive]}>
                {proj.project_name}
              </Text>
            </TouchableOpacity>
          ))}
        </RNScrollView>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Loading and Error States */}
        {loading && (
          <View style={styles.barContainer}>
            <Text style={styles.title}>Loading projects...</Text>
          </View>
        )}

        {error && (
          <View style={styles.barContainer}>
            <Text style={styles.title}>Error loading projects</Text>
            <Text style={styles.severityLabel}>{error}</Text>
          </View>
        )}

        {!loading && !error && (
          <>
        {/* Project Selection Bar */}
        <View style={styles.barContainer}>
        <Text style={styles.title}>{selectedProject.project_name}</Text>
        <Text style={styles.severityLabel}>Severity:</Text>
        <Text style={[styles.severity, { color: getSeverityColor(selectedProject.severity) }]}>
          {selectedProject.severity}
        </Text>
        </View>
        {/* Defect Severity Breakdown Tables */}
        <View style={styles.cardWithBorder}>
          <Text style={styles.sectionTitle}>Defect Severity Breakdown</Text>
          {/* Pass navigation prop as required by DefectSeverityBreakdown */}
          <DefectSeverityBreakdown
            projectId={selectedProject.id}
            navigation={navigation as any} // Type assertion to fix navigation prop type issue
          />
        </View>
        <DefectDensityMeter projectId={selectedProject.id} />
        <View>
          <DefectSeverityIndex value={75.0} />
        </View>
        <View>
          <DefectToRemarkRatio projectId={selectedProject.id} />
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
        </>
        )}
      </ScrollView>

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
              {projects.filter(p => p.severity === HIGH_RISK_SEVERITY).map((project) => (
                <View key={project.id} style={styles.notificationItem}>
                  <Icon name="warning" size={20} color="#ff0000ff" />
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{project.project_name}</Text>
                    <Text style={styles.notificationSubtitle}>High Risk - Requires immediate attention</Text>
                  </View>
                </View>
              ))}
              {projects.filter(p => p.severity === HIGH_RISK_SEVERITY).length === 0 && (
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

export default ProjectDetailsScreen;

