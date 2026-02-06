export const MetricCard = ({ title, value, icon: Icon, iconBg, iconColor, subtitle, testId }) => {
  return (
    <div data-testid={testId} className="bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>{title}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
      </div>
    </div>
  );
};
