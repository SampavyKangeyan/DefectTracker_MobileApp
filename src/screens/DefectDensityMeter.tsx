// DefectDensityMeter.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import DefectDensityMeterService from '../services/defectDensityMeter';
import { DefectDensityData } from '../types/api';

interface DefectDensityMeterProps {
  value?: number; // Optional for backward compatibility
  projectId?: number; // For API integration
  kloc?: number; // For API integration
  size?: number;
  title?: string;
  unit?: string;
}

// Custom SVG Speedometer Component
const CustomSpeedometer: React.FC<{
  value: number;
  size: number;
  maxValue: number;
  currentColor: string;
}> = ({ value, size, maxValue, currentColor }) => {
  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;

  // Visual scale for proper gauge display (matches the tick labels 0, 5, 10, 15)
  const visualMaxValue = 15;

  // Calculate angle for the needle (180 degrees arc, from -90 to +90)
  const startAngle = -90;
  const endAngle = 90;
  const totalAngle = endAngle - startAngle;
  // Use visual scale for correct needle positioning
  const clampedValue = Math.min(value, visualMaxValue);
  const valueAngle = startAngle + (clampedValue / visualMaxValue) * totalAngle;
  const needleAngleRad = (valueAngle * Math.PI) / 180;

  // Needle coordinates
  const needleLength = radius - 10;
  const needleX = centerX + needleLength * Math.cos(needleAngleRad);
  const needleY = centerY + needleLength * Math.sin(needleAngleRad);

  // Create arc path for the gauge background
  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;
    const x1 = centerX + radius * Math.cos(start);
    const y1 = centerY + radius * Math.sin(start);
    const x2 = centerX + radius * Math.cos(end);
    const y2 = centerY + radius * Math.sin(end);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Create colored segments based on defect density thresholds
  const lowEndAngle = startAngle + (7 / visualMaxValue) * totalAngle;
  const mediumEndAngle = startAngle + (10 / visualMaxValue) * totalAngle;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Low range (green) */}
        <Path
          d={createArcPath(startAngle, lowEndAngle, radius)}
          stroke="#43a047"
          strokeWidth="7"
          fill="none"
          strokeLinecap="square"
        />
        {/* Medium range (yellow) */}
        <Path
          d={createArcPath(lowEndAngle, mediumEndAngle, radius)}
          stroke="#fbc02d"
          strokeWidth="7"
          fill="none"
          strokeLinecap="square"
        />
        {/* High range (red) */}
        <Path
          d={createArcPath(mediumEndAngle, endAngle, radius)}
          stroke="#ef4444"
          strokeWidth="7"
          fill="none"
          strokeLinecap="square"
        />

        {/* Tick marks */}
        {Array.from({ length: 20 }, (_, i) => {
          const tickAngle = startAngle + (i / 20) * totalAngle;
          const tickAngleRad = (tickAngle * Math.PI) / 180;
          const tickStartRadius = radius - 15;
          const tickEndRadius = radius - 5;
          const x1 = centerX + tickStartRadius * Math.cos(tickAngleRad);
          const y1 = centerY + tickStartRadius * Math.sin(tickAngleRad);
          const x2 = centerX + tickEndRadius * Math.cos(tickAngleRad);
          const y2 = centerY + tickEndRadius * Math.sin(tickAngleRad);

          return (
            <Line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#374151"
              strokeWidth="2"
            />
          );
        })}

        {/* Tick labels */}
        {[0, 5, 10, 15].map((tickValue) => {
          const tickAngle = startAngle + (tickValue / visualMaxValue) * totalAngle;
          const tickAngleRad = (tickAngle * Math.PI) / 180;
          const labelRadius = radius - 25;
          const x = centerX + labelRadius * Math.cos(tickAngleRad);
          const y = centerY + labelRadius * Math.sin(tickAngleRad);

          return (
            <SvgText
              key={tickValue}
              x={x}
              y={y}
              fontSize="12"
              fill="#374151"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {tickValue}
            </SvgText>
          );
        })}

        {/* Needle - Tapered design with thin tip */}
        <Path
          d={(() => {
            // Calculate perpendicular offset for needle width
            const baseWidth = 3;
            const tipWidth = 0.5;
            const needleLength = Math.sqrt((needleX - centerX) ** 2 + (needleY - centerY) ** 2);
            const unitX = (needleX - centerX) / needleLength;
            const unitY = (needleY - centerY) / needleLength;
            const perpX = -unitY;
            const perpY = unitX;

            // Base points (wider at center)
            const baseX1 = centerX + perpX * baseWidth / 2;
            const baseY1 = centerY + perpY * baseWidth / 2;
            const baseX2 = centerX - perpX * baseWidth / 2;
            const baseY2 = centerY - perpY * baseWidth / 2;

            // Tip points (narrower at end)
            const tipX1 = needleX + perpX * tipWidth / 2;
            const tipY1 = needleY + perpY * tipWidth / 2;
            const tipX2 = needleX - perpX * tipWidth / 2;
            const tipY2 = needleY - perpY * tipWidth / 2;

            return `M ${baseX1} ${baseY1} L ${tipX1} ${tipY1} L ${tipX2} ${tipY2} L ${baseX2} ${baseY2} Z`;
          })()}
          fill={currentColor}
          stroke={currentColor}
          strokeWidth="0.5"
        />

        {/* Center circle */}
        <Circle
          cx={centerX}
          cy={centerY}
          r="6"
          fill={currentColor}
        />
      </Svg>
    </View>
  );
};

const DefectDensityMeter: React.FC<DefectDensityMeterProps> = ({
  value,
  projectId,
  kloc,
  size = 200,
  title = 'Defect Density',
}) => {
  const [apiData, setApiData] = useState<DefectDensityData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API if projectId and kloc are provided
  useEffect(() => {
    const fetchDefectDensity = async () => {
      if (projectId && kloc) {
        setLoading(true);
        setError(null);
        try {
          const data = await DefectDensityMeterService.getDefectDensity(projectId, kloc);
          setApiData(data);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch defect density data');
          console.error('Error fetching defect density:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDefectDensity();
  }, [projectId, kloc]);

  // Determine the value to display (API data takes precedence over prop value)
  const displayValue = apiData?.defectDensity ?? value ?? 0;
  const displayTitle = apiData?.projectName ? `${title} - ${apiData.projectName}` : title;

  // Define color based on defect density thresholds
  const getColorForValue = (val: number) => {
    if (val < 7) return '#43a047'; // Green for Low (0-7)
    if (val <= 10) return '#fbc02d'; // Yellow for Medium (7-10)
    return '#ef4444'; // Red for High (10+)
  };

  const getCurrentLevel = (val: number) => {
    if (val < 7) return 'Low';
    if (val <= 10) return 'Medium';
    return 'High';
  };

  // Configure speedometer with proper segment distribution
  const maxValue = 20;

  const currentColor = getColorForValue(displayValue);
  const currentLevel = getCurrentLevel(displayValue);

  // Show loading state
  if (loading) {
    return (
      <View style={styles.cardWithBorder}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading defect density...</Text>
        </View>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={styles.cardWithBorder}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Text style={styles.errorSubtext}>Please check your connection and try again</Text>
        </View>
      </View>
    );
  }

  return (
  <View style={styles.cardWithBorder}>
      <Text style={styles.title}>{displayTitle}</Text>
      <CustomSpeedometer
        value={Math.min(displayValue, maxValue)}
        size={size}
        maxValue={maxValue}
        currentColor={currentColor}
      />
      {/* Reduce marginTop in valueText for minimal gap */}
      <Text style={[styles.valueText, { color: currentColor, marginTop: -75 }]}>
        {displayValue.toFixed(2)}
      </Text>
      {/* Show additional API data if available */}
      {apiData && (
        <Text style={styles.unitText}>
          {apiData.defects} defects in {apiData.kloc} KLOC
        </Text>
      )}
      <Text style={[styles.levelText, { color: currentColor }]}>
        {apiData?.meaning || `${currentLevel} Risk`}
      </Text>

      <View style={styles.legendContainer}>
        <View
          style={[
            styles.legendItem,
            currentLevel === 'Low' && styles.activeLegendItem,
          ]}
        >
          <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
          <Text
            style={[
              styles.legendText,
              currentLevel === 'Low' && styles.activeLegendText,
            ]}
          >
            Low (0-7)
          </Text>
        </View>
        <View
          style={[
            styles.legendItem,
            currentLevel === 'Medium' && styles.activeLegendItem,
          ]}
        >
          <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
          <Text
            style={[
              styles.legendText,
              currentLevel === 'Medium' && styles.activeLegendText,
            ]}
          >
            Medium (7-10)
          </Text>
        </View>
        <View
          style={[
            styles.legendItem,
            currentLevel === 'High' && styles.activeLegendItem,
          ]}
        >
          <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
          <Text
            style={[
              styles.legendText,
              currentLevel === 'High' && styles.activeLegendText,
            ]}
          >
            High (10+)
          </Text>
        </View>
      </View>
    </View>  
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 1,
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 0, // will be overridden inline
    textAlign: 'center',
  },
  unitText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  legendItem: {
    alignItems: 'center',
    flex: 1,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  activeLegendItem: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 4,
  },
  activeLegendText: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default DefectDensityMeter;
