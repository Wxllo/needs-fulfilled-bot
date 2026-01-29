import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface GenderBreakdownChartProps {
  maleCount: number;
  femaleCount: number;
}

export function GenderBreakdownChart({ maleCount, femaleCount }: GenderBreakdownChartProps) {
  const total = maleCount + femaleCount;
  const data = [
    { name: 'Female', value: femaleCount, percentage: Math.round((femaleCount / total) * 100) },
    { name: 'Male', value: maleCount, percentage: Math.round((maleCount / total) * 100) },
  ];

  const COLORS = ['hsl(280, 60%, 55%)', 'hsl(215, 75%, 45%)'];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">Gender Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percentage }) => `${percentage}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [`${value} (${data.find(d => d.name === name)?.percentage}%)`, name]}
            />
            <Legend 
              formatter={(value: string, entry: any) => {
                const item = data.find(d => d.name === value);
                return `${value} (${item?.value || 0})`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
