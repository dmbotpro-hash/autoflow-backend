'use client';
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { day: 'Mon', dms: 12, comments: 45 },
  { day: 'Tue', dms: 28, comments: 89 },
  { day: 'Wed', dms: 19, comments: 62 },
  { day: 'Thu', dms: 45, comments: 134 },
  { day: 'Fri', dms: 38, comments: 98 },
  { day: 'Sat', dms: 67, comments: 201 },
  { day: 'Sun', dms: 52, comments: 156 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1F2937] border border-white/10 rounded-xl px-3 py-2.5 text-xs shadow-xl">
        <div className="text-gray-400 mb-1.5 font-medium">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
            <span style={{ color: p.color }}>
              {p.name === 'dms' ? 'DMs Sent' : 'Comments'}: {p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ActivityChart() {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Activity (Last 7 Days)</h3>
          <p className="text-gray-500 text-xs mt-0.5">
            DMs and comments over the last 7 days
          </p>
        </div>
        <div className="flex items-center gap-4">
          {[
            { color: '#F97316', label: 'DMs' },
            { color: '#8B5CF6', label: 'Comments' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
              <span className="text-gray-500 text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="dmsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="commentsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 11 }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="dms"
            stroke="#F97316"
            strokeWidth={2}
            fill="url(#dmsGrad)"
          />
          <Area
            type="monotone"
            dataKey="comments"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="url(#commentsGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
