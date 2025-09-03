import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, ActivityIndicator, Pressable, Alert } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import apiClient from '../services/api';

export const DefectsReopenedChart: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSliceIndex, setSelectedSliceIndex] = useState<number | null>(null);

const START_OFFSET_DEG = -90; 


const paddingLeft = 0;
const PAD_LEFT: number = 
  typeof paddingLeft === "string" 
    ? parseFloat(paddingLeft) 
    : (paddingLeft || 0);
const handlePress = (evt: any) => {
  const { locationX, locationY } = evt.nativeEvent;

  console.log({ locationX, locationY });

  // Adjust chart center (consider padding)
  const centerX = 110 ;
  const centerY = 110; // chart height is 220
let angle=0;
  // Distance vector from center
  if (locationX > centerX && locationY < centerY) {
    const dx= locationX - centerX;
    const dy = centerY - locationY;
    angle = -Math.atan2(dy, dx) * (180 / Math.PI); 
    console.log("0-90", {angle});
  }
  else if (locationX < centerX && locationY < centerY) {
   const dx= locationX - centerX;
   const dy = centerY - locationY;
   angle = -Math.atan2(dy, dx) * (180 / Math.PI); 
   console.log("90-180", {angle});
  }
  else if (locationX < centerX && locationY > centerY) {
    const dx= locationX - centerX;
    const dy = locationY - centerY;
    angle = Math.atan2(dy, dx) * (180 / Math.PI); 
    angle = angle + 360
    console.log("180-270", {angle});
  }
   
  else if (locationX > centerX && locationY > centerY) {
    const dx= locationX - centerX;
    const dy = locationY - centerY;
    angle = Math.atan2(dy, dx) * (180 / Math.PI); 
    angle = angle + 360
    console.log("270-360", {angle});
    
  }

  

  // Angle in [0, 360), measured clockwise from +X axis

  

  
  

  // If your pie starts with an offset (e.g. top = -90°), apply it
  angle = (angle - START_OFFSET_DEG + 360) % 360;

  // Find which slice contains the angle
  const total = data.reduce((s, d) => s + d.population, 0);
  let start = 0;

  for (let i = 0; i < data.length; i++) {
    console.log({start});
    
    const sliceAngle = (data[i].population / total) * 360;
    console.log({sliceAngle});
    

    const end = start + sliceAngle;
    console.log({end});
    

    if (angle >= start && angle < end) {
      console.log(`start: ${start}, end: ${end}, angle: ${angle}, sliceAngle: ${sliceAngle}`);
      Alert.alert(data[i].name, `Defects: ${data[i].defectIds.join(", ")}`);
      return 0; 
    }

    start = end;
  }
};

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    setSelectedSliceIndex(null); // Reset selection when project changes
    apiClient
      .get(`/dashboard/defects-reopened-multiple-times/${projectId}`)
      .then((res) => {
        if (res.data && res.data.status === 'success' && Array.isArray(res.data.data)) {
          const filtered = res.data.data.filter((item: any) => item.population > 0);
          setData(
            filtered.length > 0
              ? filtered.map((item: any) => ({
                  ...item,
                  legendFontColor: '#333',
                  legendFontSize: 14,
                }))
              : [
                  {
                    name: 'No Data',
                    population: 1,
                    color: '#e0e0e0',
                    legendFontColor: '#333',
                    legendFontSize: 14,
                  },
                ]
          );
        } else {
          setError('Failed to load chart data');
        }
      })
      .catch(() => setError('Failed to load chart data'))
      .finally(() => setLoading(false));
  }, [projectId]);

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  if (loading) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Defects Reopened Multiple Times</Text>
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Defects Reopened Multiple Times</Text>
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  // If all populations are zero, show a message instead of an empty chart
  if (data.length === 1 && data[0].name === 'No Data') {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Defects Reopened Multiple Times</Text>
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No data available</Text>
      </View>
    );
  }

  // Pie slice press handler
  const handlePiePress = (index: number) => {
    setSelectedSliceIndex(index);
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>Defects Reopened Multiple Times</Text>
      <Pressable onPress={handlePress}>
        <PieChart
        data={data}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend={true}
        center={[0, 0]}
        style={styles.pieWithBorder} 
      />
      </Pressable>

      {/* Show defect IDs for selected slice */}
      {selectedSliceIndex !== null && data[selectedSliceIndex] && data[selectedSliceIndex].defectIds && (
        <View style={styles.defectIdCard}>
          <Text style={styles.defectIdTitle}>{data[selectedSliceIndex].name}</Text>
          <Text style={styles.defectIdSubtitle}>Defect ID</Text>
          {data[selectedSliceIndex].defectIds.map((id: string) => (
            <View key={id} style={styles.defectIdItem}>
              <Text style={styles.defectIdText}>{id}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export const DefectDistributionChart: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40;

  const [typeData, setTypeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setTypeData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    apiClient
      .get(`/dashboard/defects-distribution-by-type/${projectId}`)
      .then((res) => {
        if (res.data && res.data.status === 'success' && Array.isArray(res.data.data)) {
          // Map backend data to chart format, filter out zero counts
          const colors = [
            '#4285F4', '#00bfae', '#fbbc05', '#ff0000ff', '#a259f7', '#ff995aff', '#ffb300', '#8bc34a', '#607d8b', '#e91e63'
          ];
          const chartData = res.data.data
            .filter((item: any) => item.count > 0)
            .map((item: any, idx: number) => ({
              name: item.defect_type_name,
              population: item.count,
              color: colors[idx % colors.length],
              legendFontColor: '#333',
              legendFontSize: 12,
            }));
          setTypeData(chartData);
        } else {
          setError('Failed to load chart data');
        }
      })
      .catch(() => setError('Failed to load chart data'))
      .finally(() => setLoading(false));
  }, [projectId]);

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  if (loading) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Defect Distribution by Type</Text>
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Defect Distribution by Type</Text>
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  if (!typeData.length) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Defect Distribution by Type</Text>
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No data available</Text>
      </View>
    );
  }

  // Calculate total and most common
  const total = typeData.reduce((sum, item) => sum + (item.population || 0), 0);
  const mostCommon = typeData.reduce(
    (max, item) => (item.population > (max?.population || 0) ? item : max),
    typeData[0]
  );

  return (
    <View style={styles.chartContainer} >
      <Text style={styles.title}>Defect Distribution by Type</Text>
      <PieChart
        data={typeData}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend={true}
        center={[0, 0]}
        style={styles.pieWithBorder}
      />
      <Text style={[styles.total, { marginTop: 8 }]}>{total} Total Defects</Text>
      {mostCommon && (
        <Text style={styles.common}>
          {mostCommon.population} Most Common: {mostCommon.name}
        </Text>
      )}
    </View>
  );
};

const DefectPieCharts: React.FC<{ projectId?: string }> = ({ projectId }) => {
  return (
    <View>
      <View >
        <DefectsReopenedChart projectId={projectId} />
      </View>
      <View >
        <DefectDistributionChart projectId={projectId} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    paddingTop: 16,
    marginBottom:40
  },
  pieWithBorder: {
    // Add white border between pie slices
    borderWidth: 0,
    borderColor: '#fff',
    borderRadius: 0,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '600',
    color: '#222',
  },
  legend: {
    fontSize: 14,
    marginTop: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
  },
  common: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
  },
  defectIdCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  defectIdTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#222',
  },
  defectIdSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  defectIdItem: {
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  defectIdText: {
    fontSize: 14,
    color: '#333',
  },
});

export default DefectPieCharts;
