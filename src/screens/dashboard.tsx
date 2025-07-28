import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions, Platform, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Image } from 'react-native';

// Types
type SeverityLevel = 'High Risk' | 'Medium Risk' | 'Low Risk';

interface Project {
  id: string;
  name: string;
  severity: SeverityLevel;
}

// Project data
const PROJECTS: Project[] = [
  { id: '1', name: 'Defect Tracker', severity: 'High Risk' },
  { id: '2', name: 'QA testing', severity: 'High Risk' },
  { id: '3', name: 'Dashbord testing', severity: 'Low Risk' },
  { id: '4', name: 'Project 1', severity: 'Low Risk' },
  { id: '5', name: 'Project 2', severity: 'High Risk' },
  { id: '6', name: 'Project 3', severity: 'Low Risk' },
  { id: '7', name: 'Project 4', severity: 'Low Risk' },
  { id: '8', name: 'Project 5', severity: 'Medium Risk' },
  { id: '9', name: 'Project 6', severity: 'Medium Risk' },
  { id: '10', name: 'Project 7', severity: 'Medium Risk' },
  { id: '11', name: 'Project 9', severity: 'Medium Risk' },
  // { id: '12', name: 'Project 8', severity: 'Low Risk' },
  // { id: '13', name: 'Project 10', severity: 'Low Risk' },
  // { id: '14', name: 'Project 11', severity: 'Medium Risk' },
  // { id: '15', name: 'Project 12', severity: 'Low Risk' },
  // Add more projects as needed
];

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

  // Responsive logic
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 400;
  const projectCardSize = (screenWidth - 60) / 2; // 2 cards per row, 20px padding on each side, 10px margin between

  const handleBack = async () => {
    await AsyncStorage.removeItem('credentials');
    navigation.replace('Login');
  };

  // Sort projects by severity: High > Medium > Low when "All Projects" is selected
  const severityOrder: SeverityLevel[] = ['High Risk', 'Medium Risk', 'Low Risk'];
  const filteredProjects =
    filter === 'All'
      ? [...PROJECTS].sort(
          (a, b) =>
            severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
        )
      : PROJECTS.filter((p) => p.severity === filter);

  const renderProject = ({ item }: { item: Project }) => (
    <View style={[
      styles.projectCard,
      { backgroundColor: SEVERITY_COLORS[item.severity] || '#ccc' }
    ]}>
      <Text style={styles.projectIcon}>✔️</Text>
      <Text style={styles.projectName}>{item.name}</Text>
      <View style={styles.severityBadge}>
        <Text style={styles.severityText}>{item.severity}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f7fafd' }}>
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={handleBack} style={styles.iconButton} accessibilityLabel="Back">
            <Icon name="arrow-back" size={18} color="#222" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.appTitle}>DefectTracker Pro</Text>
          <Text style={styles.header}>Dashboard</Text>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => setNotificationModalVisible(true)}
          >
            <Icon name="notifications" size={20} color="#000000ff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>
                {PROJECTS.filter(p => p.severity === 'High Risk').length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
        <Text style={styles.subheader}>
          Gain insights into your projects with real-time health metrics and status summaries
        </Text>
        <Text style={styles.sectionTitle}>Project Status Insights</Text>
        <View style={[styles.statusRow, isSmallScreen && { flexDirection: 'column' }]}> {/* Responsive row/column */}
          <View style={[styles.statusCard, { borderColor: '#e53935', marginBottom: isSmallScreen ? 12 : 0 }]}> {/* Add margin for stacked */}
            <Text style={styles.statusIcon}>❗</Text>
            <Text style={[styles.statusTitle, { color: '#e53935' }]}>High Risk Projects</Text>
            <Text style={styles.statusCount}>
              {PROJECTS.filter(p => p.severity === 'High Risk').length}
            </Text>
            <Text style={styles.statusDesc}>Immediate attention required</Text>
          </View>
          <View style={[styles.statusCard, { borderColor: '#fbc02d', marginBottom: isSmallScreen ? 12 : 0 }]}> {/* Add margin for stacked */}
            <Text style={styles.statusIcon}>⏰</Text>
            <Text style={[styles.statusTitle, { color: '#fbc02d' }]}>Medium Risk Projects</Text>
            <Text style={styles.statusCount}>
              {PROJECTS.filter(p => p.severity === 'Medium Risk').length}
            </Text>
            <Text style={styles.statusDesc}>Monitor progress closely</Text>
          </View>
          <View style={[styles.statusCard, { borderColor: '#43a047' }]}> {/* No margin for last */}
            <Text style={styles.statusIcon}>✔️</Text>
            <Text style={[styles.statusTitle, { color: '#43a047' }]}>Low Risk Projects</Text>
            <Text style={styles.statusCount}>
              {PROJECTS.filter(p => p.severity === 'Low Risk').length}
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
          {filteredProjects.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('ProjectDetails', {
                id: item.id,
                name: item.name,
                severity: item.severity,
              })}
              style={[
                styles.projectCard,
                {
                  backgroundColor: SEVERITY_COLORS[item.severity] || '#ccc',
                  width: 120,
                  height: 120,
                  borderRadius: 60, // circle
                  margin: 10,
                },
              ]}
            >
              {item.severity === 'High Risk' ? (
                <Text style={[styles.projectIcon, { color: '#000' }]}>❕</Text>
              ) : (
                <Text style={styles.projectIcon}>{SEVERITY_ICONS[item.severity]}</Text>
              )}
              <Text style={styles.projectName}>{item.name}</Text>
              <View style={styles.severityBadge}>
                <Text style={styles.severityText}>{item.severity}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
              {PROJECTS.filter(p => p.severity === 'High Risk').map((project) => (
                <View key={project.id} style={styles.notificationItem}>
                  <Icon name="warning" size={20} color="#e53935" />
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{project.name}</Text>
                    <Text style={styles.notificationSubtitle}>High Risk - Requires immediate attention</Text>
                  </View>
                </View>
              ))}
              {PROJECTS.filter(p => p.severity === 'High Risk').length === 0 && (
                <Text style={styles.noNotifications}>No critical notifications</Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafd',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 0,
  },
  subheader: {
    fontSize: 15,
    color: '#666',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 4,
    minHeight: 40,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  //   topBar: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   marginBottom: 4,
  //   minHeight: 20,
  //   paddingHorizontal: 0,
  //   backgroundColor: 'transparent',
  // },

  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
    paddingTop: 30,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: 30,
  },
  iconButton: {
    padding: 6,
    marginTop: 30,
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
    backgroundColor: 'rgba(255,255,255,0.18)',
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
  appTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D6A4F',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 2,
    letterSpacing: 1,
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
  },
  severityBreakdownText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#e53935',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
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
});

export default DashboardScreen;
