import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Polyline, Circle, Line, G, Text as SvgText } from 'react-native-svg';

type LineChartProps = {
  data: number[];
  labels: string[];
  width?: number;
  height?: number;
  color?: string;
};

const LineChart: React.FC<LineChartProps> = ({
  data,
  labels,
  width = 350,
  height = 240,
  color = '#2563eb',
}) => {
  const dataMax = Math.max(...data);
  // Calculate a nice round maximum that's divisible by 5 for clean intervals
  const maxY = Math.ceil((dataMax + 2) / 5) * 5; // Round up to next multiple of 5
  const minY = 0;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const points: [number, number][] = data.map((y: number, i: number) => {
    const x = padding + (i * chartWidth) / (data.length - 1);
    const yPos = padding + chartHeight - ((y - minY) / (maxY - minY)) * chartHeight;
    return [x, yPos];
  });
  const polylinePoints = points.map(([x, y]) => `${x},${y}`).join(' ');
  return (
    <View>
      <Svg width={width} height={height + 40}>
        {/* Y-axis label */}
        <SvgText
          x={10}
          y={height / 2 + 10}
          fontSize="14"
          fill="#222"
          textAnchor="middle"
          transform={`rotate(-90, 10, ${height / 2 + 10})`}
          fontWeight="bold"
        >
          Defects Count
        </SvgText>
        {/* Grid lines and labels */}
        {[...Array(6)].map((_, i) => {
          const y = padding + (chartHeight * i) / 5;
          return (
            <G key={i}>
              <Line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#e0e0e0"
                strokeWidth={1}
              />
              <SvgText
                x={padding - 8}
                y={y + 4}
                fontSize="10"
                fill="#888"
                textAnchor="end"
              >
                {(maxY * (5 - i)) / 5}
              </SvgText>
            </G>
          );
        })}
        {/* X axis labels */}
        {labels.map((label: string, i: number) => {
          const x = padding + (i * chartWidth) / (labels.length - 1);
          return (
            <SvgText
              key={i}
              x={x}
              y={height - 8}
              fontSize="10"
              fill="#888"
              textAnchor="middle"
            >
              {label}
            </SvgText>
          );
        })}
        {/* Polyline for data */}
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke={color}
          strokeWidth={2}
        />
        {/* Dots */}
        {points.map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r={3} fill="#fff" stroke={color} strokeWidth={2} />
        ))}
        {/* X-axis label */}
        <SvgText
          x={width / 2}
          y={height + 28}
          fontSize="14"
          fill="#222"
          textAnchor="middle"
          fontWeight="bold"
        >
          Days
        </SvgText>
      </Svg>
    </View>
  );
};

const sectionContainer = {
  backgroundColor: '#fff',
  borderRadius: 14,
  padding: 16,
  marginBottom: 22,
  shadowColor: '#000',
  shadowOpacity: 0.04,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

const timeToFindData = [5, 6, 8, 7, 6, 5, 4, 5, 3, 2];
const timeToFindLabels = [
  'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5',
  'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'
];

const timeToFixData = [3, 2, 5, 4, 2, 3, 2, 2, 1, 2];
const timeToFixLabels = [
  'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5',
  'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'
];

const TimeDefectCharts: React.FC = () => {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width - 32, 350);

  return (
    <View>
      {/* Time to Find Defects */}
      <View style={sectionContainer}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Time to Find Defects</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 8 }}>
          <LineChart data={timeToFindData} labels={timeToFindLabels} width={chartWidth} height={240} />
        </View>
      </View>
      {/* Time to Fix Defects */}
      <View style={sectionContainer}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Time to Fix Defects</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 8 }}>
          <LineChart data={timeToFixData} labels={timeToFixLabels} width={chartWidth} height={240} color={'#00b894'} />
        </View>
      </View>
    </View>
  );
};

export default TimeDefectCharts;
