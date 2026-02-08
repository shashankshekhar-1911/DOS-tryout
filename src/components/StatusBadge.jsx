const statusConfig = {
  completed: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Completed',
  },
  running: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    ring: 'ring-blue-200',
    dot: 'bg-blue-500',
    label: 'Running',
  },
  delayed: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-200',
    dot: 'bg-amber-500',
    label: 'Delayed',
  },
  upcoming: {
    bg: 'bg-slate-50',
    text: 'text-slate-500',
    ring: 'ring-slate-200',
    dot: 'bg-slate-400',
    label: 'Upcoming',
  },
  error: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    ring: 'ring-rose-200',
    dot: 'bg-rose-500',
    label: 'Error',
  },
};

export const StatusBadge = ({ status, label, size = 'default' }) => {
  const config = statusConfig[status] || statusConfig.upcoming;
  const displayLabel = label || config.label;
  
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-[11px]'
    : 'px-2.5 py-1 text-xs';

  return (
    <span
      data-testid={`status-badge-${status}`}
      className={`inline-flex items-center gap-1.5 ${sizeClasses} font-medium rounded-full ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'running' ? 'animate-pulse' : ''}`} />
      {displayLabel}
    </span>
  );
};
