import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions, Platform, Modal, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Image } from 'react-native';
import ProjectService from '../services/projectServic';
import apiClient from '../services/api';
import { Project } from '../services/projectServic';

// Types
type SeverityLevel = 'High Risk' | 'Medium Risk' | 'Low Risk';

const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  'High Risk': '#e53935',
  'Medium Risk': '#fbc02d',
  'Low Risk': '#43a047',
};

const FILTERS = [
  { label: 'All Projects', value: 'All' },
  { label: 'High Risk', value: 'High Risk' },
  { label: 'Medium Risk', value: 'Medium Risk' },
  { label: 'Low Risk', value: 'Low Risk' },
];

const getSeverityColor = (filterValue: string) => {
  switch (filterValue) {
    case 'High Risk':
      return '#e53935'; // Red
    case 'Medium Risk':
      return '#fbc02d'; // Orange
    case 'Low Risk':
      return '#43a047'; // Green
    default:
      return '#2D6A4F'; // Default color for "All Projects"
  }
};

// Icon mapping for severity
const SEVERITY_ICONS: Record<SeverityLevel, string> = {
  'High Risk': '❕',
  'Medium Risk': '⏰',
  'Low Risk': '✔️',
};

const DashboardScreen = ({ navigation }: { navigation: StackNavigationProp<any, any> }) => {
  const [filter, setFilter] = useState('All');
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectCardColors, setProjectCardColors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highSeverityProjects, setHighSeverityProjects] = useState<Project[]>([]);
  // Add new state for counts
  const [highRiskCount, setHighRiskCount] = useState(0);
  const [mediumRiskCount, setMediumRiskCount] = useState(0);
  const [lowRiskCount, setLowRiskCount] = useState(0);

  // Fetch projects on component mount and on filter change
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Project[] = [];
        let colorMap: Record<string, string> = {};

        if (filter === 'All') {
          data = await ProjectService.getProjects();
          // Fetch color for each project using project-card-color API
          await Promise.all(
            data.map(async (proj: Project) => {
              try {
                const res = await apiClient.get(`/dashboard/project-card-color/${proj.id}`);
                if (
                  res.data &&
                  res.data.status === 'success' &&
                  Array.isArray(res.data.data) &&
                  res.data.data[0]?.colorCode
                ) {
                  colorMap[proj.id] = res.data.data[0].colorCode === 'Red'
                    ? '#e53935'
                    : res.data.data[0].colorCode === 'Yellow'
                    ? '#fbc02d'
                    : res.data.data[0].colorCode === 'Green'
                    ? '#43a047'
                    : '#2D6A4F';
                }
              } catch {
                colorMap[proj.id] = '#2D6A4F';
              }
            })
          );
        } else {
          // Map filter to API status param
          let statusParam = '';
          if (filter === 'High Risk') statusParam = 'High';
          else if (filter === 'Medium Risk') statusParam = 'Medium';
          else if (filter === 'Low Risk') statusParam = 'Low';
          if (statusParam) {
            const res = await apiClient.get(`/dashboard/projects-status-filter?status=${statusParam}`);
            if (res.data && res.data.status === 'success' && Array.isArray(res.data.data)) {
              // Use colorCode directly from API response for filtered projects
              data = res.data.data.map((proj: any, idx: number) => ({
                id: proj.projectName + idx, // Use projectName + idx as key if no id
                project_name: proj.projectName,
                severity: proj.status,
                // ...other fields if needed
              }));
              res.data.data.forEach((proj: any, idx: number) => {
                colorMap[proj.projectName + idx] = proj.colorCode === 'Red'
                  ? '#e53935'
                  : proj.colorCode === 'Yellow'
                  ? '#fbc02d'
                  : proj.colorCode === 'Green'
                  ? '#43a047'
                  : '#2D6A4F';
              });
            }
          }
        }
        setProjects(data);
        setProjectCardColors(colorMap);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [filter]);

  // Fetch high severity projects whenever projects change
  useEffect(() => {
    const fetchHighSeverityProjects = async () => {
      try {
        const res = await apiClient.get('/dashboard/projects-status-filter?status=High');
        if (res.data && res.data.status === 'success' && Array.isArray(res.data.data)) {
          setHighSeverityProjects(
            res.data.data.map((proj: any, idx: number) => ({
              id: proj.projectName + idx,
              project_name: proj.projectName,
              severity: proj.status,
              // ...other fields if needed
            }))
          );
        } else {
          setHighSeverityProjects([]);
        }
      } catch {
        setHighSeverityProjects([]);
      }
    };
    fetchHighSeverityProjects();
  }, [projects]);

  // Fetch counts for each severity
  useEffect(() => {
    const fetchSeverityCounts = async () => {
      try {
        const [highRes, mediumRes, lowRes] = await Promise.all([
          apiClient.get('/dashboard/projects-status-filter?status=High'),
          apiClient.get('/dashboard/projects-status-filter?status=Medium'),
          apiClient.get('/dashboard/projects-status-filter?status=Low'),
        ]);
        setHighRiskCount(Array.isArray(highRes.data?.data) ? highRes.data.data.length : 0);
        setMediumRiskCount(Array.isArray(mediumRes.data?.data) ? mediumRes.data.data.length : 0);
        setLowRiskCount(Array.isArray(lowRes.data?.data) ? lowRes.data.data.length : 0);
      } catch {
        setHighRiskCount(0);
        setMediumRiskCount(0);
        setLowRiskCount(0);
      }
    };
    fetchSeverityCounts();
  }, [projects]);

  // Responsive logic
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 400;
  const projectCardSize = (screenWidth - 60) / 2; // 2 cards per row, 20px padding on each side, 10px margin between

  const handleBack = async () => {
    await AsyncStorage.removeItem('credentials');
    navigation.replace('Login');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('credentials');
    navigation.replace('Login');
  };

  // Sort projects by severity: High > Medium > Low when "All Projects" is selected
  const severityOrder: SeverityLevel[] = ['High Risk', 'Medium Risk', 'Low Risk'];
  const filteredProjects =
    filter === 'All'
      ? [...projects].sort(
          (a, b) =>
            severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
        )
      : projects.filter((p) => p.severity === filter);

  const renderProject = ({ item }: { item: Project }) => (
    <View style={[
      styles.projectCard,
      { backgroundColor: projectCardColors[item.id] || '#ccc' }
    ]}>
      <Text style={styles.projectIcon}>✔️</Text>
      <Text style={styles.projectName}>{item.project_name}</Text>
      <View style={styles.severityBadge}>
        <Text style={styles.severityText}>{item.severity}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7fafd' }}>
      <View style={styles.topBar}> 
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={handleBack}  accessibilityLabel="Back">
            <Icon name="arrow-back" size={22} color="#222" />
          </TouchableOpacity>
        </View>
        <View style={styles.middleSection}>
          <Text style={styles.header}>Dashboard</Text>
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
                {highSeverityProjects.length}
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
      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
        <Text style={styles.subheader}>
          Gain insights into your projects with real-time health metrics and status summaries
        </Text>

        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading projects...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading projects: {error}</Text>
          </View>
        )}

        {!loading && !error && (
          <>
        <Text style={styles.sectionTitle}>Project Status Insights</Text>
        <View style={[styles.statusRow, isSmallScreen && { flexDirection: 'column' }]}> {/* Responsive row/column */}
          <View style={[styles.statusCard, { borderColor: '#e53935', marginBottom: isSmallScreen ? 12 : 0 }]}> {/* Add margin for stacked */}
            <Text style={styles.statusIcon}>❗</Text>
            <Text style={[styles.statusTitle, { color: '#e53935' }]}>High Risk Projects</Text>
            <Text style={styles.statusCount}>
              {highRiskCount}
            </Text>
            <Text style={styles.statusDesc}>Immediate attention required</Text>
          </View>
          <View style={[styles.statusCard, { borderColor: '#fbc02d', marginBottom: isSmallScreen ? 12 : 0 }]}> {/* Add margin for stacked */}
            <Text style={styles.statusIcon}>⏰</Text>
            <Text style={[styles.statusTitle, { color: '#fbc02d' }]}>Medium Risk Projects</Text>
            <Text style={styles.statusCount}>
              {mediumRiskCount}
            </Text>
            <Text style={styles.statusDesc}>Monitor progress closely</Text>
          </View>
          <View style={[styles.statusCard, { borderColor: '#43a047' }]}> {/* No margin for last */}
            <Text style={styles.statusIcon}>✔️</Text>
            <Text style={[styles.statusTitle, { color: '#43a047' }]}>Low Risk Projects</Text>
            <Text style={styles.statusCount}>
              {lowRiskCount}
            </Text>
            <Text style={styles.statusDesc}>Stable and on track</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>All Projects</Text>
        <Text style={styles.sectionDesc}>Filter by severity</Text>
        <View style={styles.filterRow}>
          {FILTERS.map(f => {
            const severityColor = getSeverityColor(f.value);

            return (
              <TouchableOpacity
                key={f.value}
                style={[
                  styles.filterBtn,
                  filter === f.value && { backgroundColor: severityColor }
                ]}
                onPress={() => setFilter(f.value)}
              >
                <Text style={[
                  styles.filterBtnText,
                  { color: filter === f.value ? '#fff' : severityColor },
                  filter === f.value && styles.filterBtnTextActive
                ]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.projectsGrid}>
          {projects.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>
              No projects available.
            </Text>
          ) : (
            (filter === 'All'
              ? [...projects].sort((a, b) => {
                  const severityOrder: SeverityLevel[] = ['High Risk', 'Medium Risk', 'Low Risk'];
                  return severityOrder.indexOf(a.severity as SeverityLevel) - severityOrder.indexOf(b.severity as SeverityLevel);
                })
              : projects
            ).map((item, idx) => (
              <TouchableOpacity
                key={item.id ? item.id : `project-${idx}`}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('ProjectDetails', {
                  id: item.id,
                  name: item.project_name,
                  severity: item.severity,
                })}
                style={[
                  styles.projectCard,
                  {
                    backgroundColor: projectCardColors[item.id] || '#ccc',
                    width: 150,
                    height: 150,
                    borderRadius: 75, // circle
                    margin: 10,
                  },
                ]}
              >
                <Text style={styles.projectIcon}>
                  {SEVERITY_ICONS[item.severity as SeverityLevel] || '⏱️'}
                </Text>
                <Text style={styles.projectName}>{item.project_name ? item.project_name : 'Unnamed Project'}</Text>
                <View style={styles.severityBadge}>
                  <Text style={styles.severityText}>{item.severity}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
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
              <Text style={styles.modalTitle}>High Severity Notifications</Text>
              <TouchableOpacity
                onPress={() => setNotificationModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.notificationList}>
              {/* Show high severity project names from API */}
              {highSeverityProjects.map((project) => (
                <View key={project.id} style={styles.notificationItem}>
                  <Icon name="warning" size={20} color="#e53935" />
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{project.project_name}</Text>
                    <Text style={styles.notificationSubtitle}>
                      <Text>High Risk - Requires immediate attention</Text>
                    </Text>
                  </View>
                </View>
              ))}
              {highSeverityProjects.length === 0 && (
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
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
   
  
  },
  subheader: {
    fontSize: 15,
    color: '#000000ff',
    textAlign: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 10,
    color: '#222',
    textAlign: 'center',
  },
  sectionDesc: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 0, // for React Native 0.71+, otherwise use margin
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    marginHorizontal: 4,
    alignItems: 'center',
    padding: 14,
    elevation: 2,
    minWidth: 110,
    minHeight: 110,
  },
  statusIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statusCount: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statusDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: '#ffffffff',
    borderRadius: 20,
    padding: 4,
    borderWidth:1,
    borderColor:'#000000ff',
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 1,
    backgroundColor: 'transparent',
  },
  filterBtnText: {
    fontWeight: 'bold',
    position: 'relative',
  },
  filterBtnTextActive: {
    color: '#fff',
  },
  topBar: {
    display:'flex',
    flexDirection: 'row',
    marginTop:30 ,
    alignItems: 'center',
    marginHorizontal: 10,
    minHeight: 40,
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
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 30,
  },
  projectCard: {
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 8,
    borderWidth: 4,
    borderColor: '#fff',
    // width/height set dynamically for circle
  },
  projectIcon: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 6,
  },
  projectName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 8,
  },
  severityBadge: {
    // backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'center',
    marginTop: 2,
  },
  severityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
 
  severityBreakdownBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  severityBreakdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color:'#000',
  },
  severityBreakdownText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    // marginLeft: 12,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
 
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    width: '90%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffebee',
    margin: 10,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#c62828',
    textAlign: 'center',
  },
});

export default DashboardScreen;
