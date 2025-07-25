// DefectDensityMeter.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';

interface DefectDensityMeterProps {
  value: number;
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

  // Calculate angle for the needle (180 degrees arc, from -90 to +90)
  const startAngle = -90;
  const endAngle = 90;
  const totalAngle = endAngle - startAngle;
  const valueAngle = startAngle + (value / maxValue) * totalAngle;
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

  // Create colored segments
  const lowEndAngle = startAngle + (7 / maxValue) * totalAngle;
  const mediumEndAngle = startAngle + (10 / maxValue) * totalAngle;

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      {/* Low range (green) */}
      <Path
        d={createArcPath(startAngle, lowEndAngle, radius)}
        stroke="#10b981"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Medium range (yellow) */}
      <Path
        d={createArcPath(lowEndAngle, mediumEndAngle, radius)}
        stroke="#f59e0b"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      {/* High range (red) */}
      <Path
        d={createArcPath(mediumEndAngle, endAngle, radius)}
        stroke="#ef4444"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Tick marks */}
      {Array.from({ length: 16 }, (_, i) => {
        const tickAngle = startAngle + (i / 15) * totalAngle;
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
        const tickAngle = startAngle + (tickValue / maxValue) * totalAngle;
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

      {/* Needle */}
      <Line
        x1={centerX}
        y1={centerY}
        x2={needleX}
        y2={needleY}
        stroke={currentColor}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Center circle */}
      <Circle
        cx={centerX}
        cy={centerY}
        r="6"
        fill={currentColor}
      />
    </Svg>
  );
};

const DefectDensityMeter: React.FC<DefectDensityMeterProps> = ({
  value,
  size = 200,
  title = 'Defect Density',
}) => {
  // Define color based on defect density thresholds
  const getColorForValue = (val: number) => {
    if (val < 7) return '#10b981'; // Green for Low (0-7)
    if (val <= 10) return '#f59e0b'; // Yellow for Medium (7-10)
    return '#ef4444'; // Red for High (10+)
  };

  const getCurrentLevel = (val: number) => {
    if (val < 7) return 'Low';
    if (val <= 10) return 'Medium';
    return 'High';
  };

  // Configure speedometer with proper segment distribution
  // We'll use 15 segments to match our 0-15 scale, with proper color distribution
  const maxValue = 15;

  const currentColor = getColorForValue(value);
  const currentLevel = getCurrentLevel(value);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <CustomSpeedometer
        value={Math.min(value, maxValue)}
        size={size}
        maxValue={maxValue}
        currentColor={currentColor}
      />
      <Text style={[styles.valueText, { color: currentColor }]}>
        {value.toFixed(2)}
      </Text>
      <Text style={styles.unitText}>defects/1000 LOC</Text>
      <Text style={[styles.levelText, { color: currentColor }]}>
        {currentLevel} Risk
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
  container: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },

  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
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
});

export default DefectDensityMeter;
