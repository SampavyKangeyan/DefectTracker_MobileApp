import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';

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
}

interface BreakdownItem {
  label: string;
  count: number;
  color: string;
}

interface DefectData {
  severity: string;
  total: number;
  color: string;
  borderColor: string;
  breakdown: BreakdownItem[];
}

const DefectSeverityBreakdown: React.FC<DefectSeverityBreakdownProps> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<DefectData | null>(null);
  const screenWidth = Dimensions.get('window').width;

  // Sample data for different severity levels
  const defectDataHigh: DefectData = {
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
  };

  const defectDataMedium: DefectData = {
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
  };

  const defectDataLow: DefectData = {
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
  };

  const allDefectData = [defectDataHigh, defectDataMedium, defectDataLow];

  const handleViewChart = (data: DefectData) => {
    setSelectedSeverity(data);
    setModalVisible(true);
  };

  const renderDefectCard = (defectData: DefectData) => (
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
        <Text style={[styles.breakdownTitle, { color: defectData.color }]}>
          {`Defects on ${defectData.severity.split(' ')[0]}`}
        </Text>
        <Text style={styles.breakdownTotal}>{`Total: ${defectData.total}`}</Text>
      </View>
      {defectData.breakdown.map((item) => (
        <View key={item.label} style={styles.breakdownRowItem}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.breakdownLabel}>{item.label}</Text>
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
      name: item.label,
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
      <View style={styles.cardWithBorder}>
      <View style={styles.cardsContainer}>
        {allDefectData.map(data => renderDefectCard(data))}
      </View>
      </View>
      {renderPieChart()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafd',
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
  cardsContainer: {
    padding: 16,
    gap: 16,
    marginLeft:2,
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
