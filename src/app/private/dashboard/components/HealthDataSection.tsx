import React from 'react';

interface HealthData {
  date: string;
  step_count: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  heart_rate: number;
  sleep_hours: number;
  weight_kg: number;
  body_temperature_celsius: number;
  oxygen_saturation: number;
}

interface HealthMetricBoxProps {
  title: string;
  value: number | string;
  unit: string;
  color: string;
}

const HealthMetricBox: React.FC<HealthMetricBoxProps> = ({ title, value, unit, color }) => (
  <div className={`bg-${color}-100 rounded-lg shadow-md p-4 text-center`}>
    <h3 className="text-lg font-bold mb-2 text-[#2C3E50]">{title}</h3>
    <p className="text-3xl font-bold text-[#2C3E50]">{value}</p>
    <p className="text-sm text-[#34495E]">{unit}</p>
  </div>
);

interface HealthDataSectionProps {
  healthData: HealthData | null;
}

const HealthDataSection: React.FC<HealthDataSectionProps> = ({ healthData }) => {
  if (!healthData) {
    return (
      <div className="col-span-full bg-white rounded-lg shadow-md p-4">
        <p className="text-center text-gray-500">No health data available</p>
      </div>
    );
  }

  return (
    <>
      <div className="col-span-full">
        <h2 className="text-xl font-bold mb-3 text-[#2C3E50]">Your Health Data</h2>
      </div>
      <HealthMetricBox
        title="Steps"
        value={healthData.step_count}
        unit="steps"
        color="blue"
      />
      <HealthMetricBox
        title="Blood Pressure"
        value={`${healthData.blood_pressure_systolic}/${healthData.blood_pressure_diastolic}`}
        unit="mmHg"
        color="red"
      />
      <HealthMetricBox
        title="Heart Rate"
        value={healthData.heart_rate}
        unit="bpm"
        color="pink"
      />
      <HealthMetricBox
        title="Sleep"
        value={healthData.sleep_hours}
        unit="hours"
        color="indigo"
      />
      <HealthMetricBox
        title="Weight"
        value={healthData.weight_kg.toFixed(1)}
        unit="kg"
        color="green"
      />
      <HealthMetricBox
        title="Body Temperature"
        value={healthData.body_temperature_celsius.toFixed(1)}
        unit="°C"
        color="yellow"
      />
      <HealthMetricBox
        title="Oxygen Saturation"
        value={healthData.oxygen_saturation}
        unit="%"
        color="purple"
      />
    </>
  );
};

export default HealthDataSection;