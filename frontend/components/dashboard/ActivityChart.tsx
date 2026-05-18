'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl px-3.5 py-2 text-xs">
        <div className="text-[#A0A0A0] mb-1.5 font-semibold font-sans">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ color: p.name === 'dms' ? '#FFFFFF' : '#A0A0A0' }} className="font-sans leading-relaxed">
            {p.name === 'dms' ? 'DMs Sent' : 'Comments'}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ActivityChart() {
  return (
    <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 font-sans">
      <div className="flex justify-between items-center mb-6 select-none">
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wide">Activity (Last 7 Days)</h3>
          <p className="text-[#606060] text-xs mt-1 font-light">DMs aur comments ka trend</p>
        </div>
        <div className="flex gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white" />
            <span className="text-[#A0A0A0]">DMs Sent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#606060]" />
            <span className="text-[#A0A0A0]">Comments</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="dmsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="commentsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#808080" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#808080" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#606060', fontSize: 11, fontWeight: 'medium' }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="dms"
            stroke="#FFFFFF"
            strokeWidth={1.5}
            fill="url(#dmsGrad)"
          />
          <Area
            type="monotone"
            dataKey="comments"
            stroke="#808080"
            strokeWidth={1.5}
            fill="url(#commentsGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
