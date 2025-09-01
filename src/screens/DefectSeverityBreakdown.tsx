import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import apiClient from '../services/api'; // <-- Use apiClient for requests

type RootStackParamList = {
  Dashboard: undefined;
  ProjectDetails: {
    id: string;
    name: string;
    severity: string;
  };
  DefectSeverityBreakdown: undefined;
};

type DefectSeverityBreakdownNavigationProp = StackNavigationProp<RootStackParamList, 'DefectSeverityBreakdown'>;

interface DefectSeverityBreakdownProps {
  navigation: DefectSeverityBreakdownNavigationProp;
  projectId: string; // <-- Add this line
}

interface BreakdownItem {
  status: string;
  count: number;
  color: string;
}

interface DefectData {
  severity_name: string;
  color: string;
  total: number;
  breakdown: BreakdownItem[];
}

const DefectSeverityBreakdown: React.FC<DefectSeverityBreakdownProps> = ({ navigation, projectId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<DefectData | null>(null);
  const [defectData, setDefectData] = useState<DefectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/dashboard/defect-severity-breakdown/${projectId}`);
        const json = res.data;
        if (json.status === 'success' && Array.isArray(json.data)) {
          setDefectData(json.data);
        } else {
          setError('Failed to load data');
        }
      } catch (err) {
        setError('Failed to load data');
      }
      setLoading(false);
    };
    fetchData();
  }, [projectId]);

  const handleViewChart = (data: DefectData) => {
    setSelectedSeverity(data);
    setModalVisible(true);
  };

  const renderDefectCard = (defectData: DefectData) => (
    <View
      key={defectData.severity_name}
      style={[
        styles.breakdownCard,
        { 
          borderColor: defectData.color, 
          backgroundColor: '#fff', 
          shadowColor: defectData.color,
          borderWidth: 2,
          marginBottom:10
        }
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
        <Text style={[styles.breakdownTitle, { color: defectData.color }]}>
          {`Defects on ${defectData.severity_name}`}
        </Text>
        <Text style={styles.breakdownTotal}>{`Total: ${defectData.total}`}</Text>
      </View>
      {defectData.breakdown.map((item) => (
        <View key={item.status} style={styles.breakdownRowItem}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.breakdownLabel}>{item.status}</Text>
          <Text style={styles.breakdownCount}>{item.count}</Text>
        </View>
      ))}
      <TouchableOpacity 
        style={styles.chartBtn}
        onPress={() => handleViewChart(defectData)}
      >
        <Text style={styles.chartBtnText}>View Chart</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPieChart = () => {
    if (!selectedSeverity) return null;

    const chartData = selectedSeverity.breakdown.map(item => ({
      name: item.status,
      population: item.count,
      color: item.color,
      legendFontColor: '#333',
      legendFontSize: 12,
    }));

    const chartConfig = {
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    return (
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
                Status Breakdown for {selectedSeverity.severity_name}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <PieChart
              data={chartData}
              width={screenWidth - 40}
              height={200}
              chartConfig={chartConfig}
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
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2D6A4F" />
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.cardsContainer}>
          {defectData.map(data => renderDefectCard(data))}
        </ScrollView>
      )}
      {renderPieChart()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  cardWithBorder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0, // Remove padding here
    marginBottom: 2,
    // marginTop:5,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardsContainer: {
    // Remove padding and set only gap/margin as needed
    padding: 0,
    gap: 16,
    marginLeft: 2,
  },
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  breakdownTotal: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  breakdownRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    marginRight: 2,
  },
  breakdownLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  breakdownCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  chartBtn: {
    backgroundColor: '#2D6A4F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  chartBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
});


export default DefectSeverityBreakdown;

