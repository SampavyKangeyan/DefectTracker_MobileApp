import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions, Platform } from 'react-native';
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
  // { id: '11', name: 'Project 8', severity: 'Low Risk' },
  // { id: '12', name: 'Project 9', severity: 'Medium Risk' },
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

// Icon mapping for severity
const SEVERITY_ICONS: Record<SeverityLevel, string> = {
  'High Risk': '❕',
  'Medium Risk': '⏰',
  'Low Risk': '✔️',
};

const DashboardScreen = ({ navigation }: { navigation: StackNavigationProp<any, any> }) => {
  const [filter, setFilter] = useState('All');

  // Responsive logic
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 400;
  const projectCardSize = (screenWidth - 60) / 2; // 2 cards per row, 20px padding on each side, 10px margin between

  const handleBack = async () => {
    await AsyncStorage.removeItem('credentials');
    navigation.replace('Login');
  };

  const filteredProjects =
    filter === 'All'
      ? PROJECTS
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
        <TouchableOpacity onPress={handleBack} style={styles.iconButton} accessibilityLabel="Back">
          <Icon name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.header}>Dashboard Overview</Text>
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
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.value}
              style={[
                styles.filterBtn,
                filter === f.value && styles.filterBtnActive
              ]}
              onPress={() => setFilter(f.value)}
            >
              <Text style={[
                styles.filterBtnText,
                filter === f.value && styles.filterBtnTextActive
              ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafd',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    alignSelf: 'center',
    // Remove marginTop and marginBottom for better alignment in row
    marginTop: 30,
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
    justifyContent: 'flex-start',
    marginVertical: 10,
    backgroundColor: '#e3eafc',
    borderRadius: 20,
    padding: 4,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 1,
    backgroundColor: 'transparent',
  },
  filterBtnActive: {
    backgroundColor: '#1E3A8A',
  },
  filterBtnText: {
    color: '#1E3A8A',
    fontWeight: 'bold',
    position: 'relative',
  },
  filterBtnTextActive: {
    color: '#fff',
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
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#1E3A8A',
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
    marginTop: 10,
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
});

export default DashboardScreen;
