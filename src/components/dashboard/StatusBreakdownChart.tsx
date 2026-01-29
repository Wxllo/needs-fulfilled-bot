import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StatusData {
  name: string;
  value: number;
}

interface StatusBreakdownChartProps {
  data: StatusData[];
}

export function StatusBreakdownChart({ data }: StatusBreakdownChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: Math.round((item.value / total) * 100),
  }));

  const COLORS = [
    'hsl(150, 60%, 40%)', // Active - green
    'hsl(30, 90%, 50%)',   // Probation - orange
    'hsl(45, 85%, 50%)',   // Leave - gold
    'hsl(0, 0%, 50%)',     // Inactive - gray
  ];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">Employment Status Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercentage}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={5}
              dataKey="value"
              label={({ percentage }) => `${percentage}%`}
              labelLine={false}
            >
              {dataWithPercentage.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
