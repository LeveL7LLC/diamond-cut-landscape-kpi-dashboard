import Thermometer from '../Thermometer';

export default function ThermometerExample() {
  return (
    <Thermometer
      value={0.78}
      label="Progress Billing On-Time"
      data-testid="thermometer-billing"
    />
  );
}