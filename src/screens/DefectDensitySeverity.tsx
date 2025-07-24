import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';

const DefectDensitySeverity: React.FC = () => {
  // Mock values
  const defectDensity = 0.0;
  const severityIndex = 67.6;

  // Gauge parameters
  const gaugeMin = 0;
  const gaugeMax = 15;
  const gaugeValue = defectDensity;
  const gaugeRadius = 48;
  const gaugeCenter = gaugeRadius + 8;
  const angle = (value: number) =>
    ((value - gaugeMin) / (gaugeMax - gaugeMin)) * 180 - 90;

  // Calculate needle position
  const theta = (Math.PI / 180) * angle(gaugeValue);
  const needleLength = gaugeRadius - 8;
  const needleX = gaugeCenter + needleLength * Math.cos(theta);
  const needleY = gaugeCenter + needleLength * Math.sin(theta);

  return (
    <View style={styles.container}>
      {/* Defect Density Gauge */}
      <View style={styles.card}>
        <Text style={styles.label}>Defect Density</Text>
        <Text style={styles.valueLabel}>
          Defect Density: <Text style={{ color: '#fbbc05', fontWeight: 'bold' }}>{defectDensity.toFixed(2)}</Text>
        </Text>
        <View style={styles.gaugeContainer}>
          <Svg width={gaugeCenter * 2} height={gaugeCenter + 10}>
            {/* Green arc */}
            <Path
              d={describeArc(gaugeCenter, gaugeCenter, gaugeRadius, 180, 225)}
              stroke="#43a047"
              strokeWidth={10}
              fill="none"
            />
            {/* Yellow arc */}
            <Path
              d={describeArc(gaugeCenter, gaugeCenter, gaugeRadius, 225, 270)}
              stroke="#fbc02d"
              strokeWidth={10}
              fill="none"
            />
            {/* Red arc */}
            <Path
              d={describeArc(gaugeCenter, gaugeCenter, gaugeRadius, 270, 360)}
              stroke="#e53935"
              strokeWidth={10}
              fill="none"
            />
            {/* Needle */}
            <G>
              <Path
                d={`M${gaugeCenter},${gaugeCenter} L${needleX},${needleY}`}
                stroke="#222"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <Circle cx={gaugeCenter} cy={gaugeCenter} r={6} fill="#222" />
            </G>
          </Svg>
        </View>
      </View>
      {/* Defect Severity Index */}
      <View style={styles.card}>
        <Text style={styles.label}>Defect Severity Index</Text>
        <View style={styles.severityRow}>
          <View style={styles.severityPillContainer}>
            <View style={styles.severityPillBg} />
            <View style={[styles.severityPillFill, { height: `${Math.min(severityIndex, 100)}%` }]} />
          </View>
          <Text style={styles.severityValue}>{severityIndex}</Text>
        </View>
        <Text style={styles.severityDesc}>
          Weighted severity score{'\n'}(higher = more severe defects)
        </Text>
      </View>
    </View>
  );
};

// Helper to describe SVG arc
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y,
    'A', r, r, 0, arcSweep, 0, end.x, end.y
  ].join(' ');
}
function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const a = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 12,
    alignItems: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    width: '92%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  valueLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  gaugeContainer: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  severityPillContainer: {
    width: 28,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 18,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  severityPillBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  severityPillFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e53935',
    borderRadius: 16,
    width: '100%',
  },
  severityValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e53935',
  },
  severityDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default DefectDensitySeverity;
