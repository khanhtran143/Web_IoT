export function formatSensorValue(value: number, unit: string): string {
  if (unit === "°C") return `${value.toFixed(1)} °C`;
  if (unit === "%") return `${Math.round(value)} %`;
  if (unit === "lux") return `${Math.round(value)} lux`;
  return `${value} ${unit}`;
}
