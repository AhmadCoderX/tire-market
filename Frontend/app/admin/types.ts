export interface User {
  name: string;
  email: string;
  registeredDate: string;
  lastActive: string;
  status: "Approved" | "Suspended" | "Banned";
  avatarUrl: string;
}

export interface StatisticCard {
  title: string;
  value: string;
  iconUrl: string;
}

export interface ChartCardProps {
  title: string;
  chartUrl: string;
}
// Define ChartDataItem interface
export interface ChartDataItem {
  label: string;
  value: number;
}

interface InteractiveChartProps {
  data: ChartDataItem[];
  title: string;
  type: "donut" | "bar" | "pie";
}