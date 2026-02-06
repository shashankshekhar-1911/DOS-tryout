import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { MetricCard } from '@/components/MetricCard';
import { getRunningPhases, getPastPhases, formatDate } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, CheckCircle2, Clock, AlertTriangle, Search, ChevronDown, ChevronUp, Eye, ArrowUpDown } from 'lucide-react';

export default function Dashboard() {
  const runningPhases = getRunningPhases();
  const pastPhases = getPastPhases();
  const [showPast, setShowPast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const totalActive = runningPhases.length;
  const onTrack = runningPhases.filter(p => p.status === 'running').length;
  const delayed = runningPhases.filter(p => p.status === 'delayed').length;
  const completed = pastPhases.length;

  const uniqueCustomers = [...new Set(runningPhases.map(p => p.customerName))];
  const uniqueStages = [...new Set(runningPhases.map(p => p.currentStageName))];

  const filteredRunning = useMemo(() => {
    let result = [...runningPhases];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.id.toLowerCase().includes(term) ||
        p.customerName.toLowerCase().includes(term) ||
        p.contractId.toLowerCase().includes(term)
      );
    }
    if (filterCustomer !== 'all') {
      result = result.filter(p => p.customerName === filterCustomer);
    }
    if (filterStage !== 'all') {
      result = result.filter(p => p.currentStageName === filterStage);
    }
    if (filterStatus !== 'all') {
      result = result.filter(p => p.status === filterStatus);
    }
    if (sortField) {
      result.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [runningPhases, searchTerm, filterCustomer, filterStage, filterStatus, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortHeader = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-slate-700 transition-colors"
      data-testid={`sort-${field}`}
    >
      {children}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  const renderPhaseRow = (phase) => (
    <TableRow key={phase.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0" data-testid={`phase-row-${phase.id}`}>
      <TableCell className="font-medium">
        <Link to={`/delivery/${phase.id}`} className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors" data-testid={`phase-link-${phase.id}`}>
          {phase.id}
        </Link>
      </TableCell>
      <TableCell>
        <Link to={`/customer/${phase.customerId}`} className="text-slate-700 hover:text-indigo-600 hover:underline transition-colors" data-testid={`customer-link-${phase.customerId}`}>
          {phase.customerName}
        </Link>
      </TableCell>
      <TableCell className="text-slate-600">{phase.deliveryYear}</TableCell>
      <TableCell className="text-slate-600">{phase.phaseNumber}</TableCell>
      <TableCell className="text-slate-600 font-medium">{phase.feederCount}</TableCell>
      <TableCell>
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
          {phase.networkType}
        </span>
      </TableCell>
      <TableCell className="text-slate-500 text-xs font-mono">{phase.contractId}</TableCell>
      <TableCell className="text-slate-500 text-sm">{formatDate(phase.startDate)}</TableCell>
      <TableCell className="text-slate-500 text-sm">{formatDate(phase.estimatedDeliveryDate)}</TableCell>
      <TableCell>
        <span className="text-sm font-medium text-slate-700">{phase.currentStageName}</span>
      </TableCell>
      <TableCell className="text-slate-500 text-sm">{phase.stageEta}</TableCell>
      <TableCell>
        <StatusBadge status={phase.status} size="sm" />
      </TableCell>
      <TableCell>
        <Link to={`/delivery/${phase.id}`}>
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 h-8 px-3" data-testid={`action-btn-${phase.id}`}>
            <Eye className="w-4 h-4 mr-1.5" />
            Details
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div data-testid="dashboard-page" className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>Delivery Orchestration</h1>
          <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Monitor and manage all delivery phases across customers</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            testId="metric-active"
            title="Active Deliveries"
            value={totalActive}
            icon={Activity}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            subtitle={`Across ${uniqueCustomers.length} customers`}
          />
          <MetricCard
            testId="metric-on-track"
            title="On Track"
            value={onTrack}
            icon={Clock}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            subtitle="Within estimated timeline"
          />
          <MetricCard
            testId="metric-delayed"
            title="Delayed"
            value={delayed}
            icon={AlertTriangle}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            subtitle="Requires attention"
          />
          <MetricCard
            testId="metric-completed"
            title="Completed"
            value={completed}
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            subtitle="Delivered to customers"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3" data-testid="filters-section">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              data-testid="search-input"
              placeholder="Search by ID, customer, contract..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-white border-slate-200 text-sm"
            />
          </div>
          <Select value={filterCustomer} onValueChange={setFilterCustomer}>
            <SelectTrigger data-testid="filter-customer" className="w-[180px] h-10 bg-white border-slate-200 text-sm">
              <SelectValue placeholder="All Customers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              {uniqueCustomers.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger data-testid="filter-stage" className="w-[180px] h-10 bg-white border-slate-200 text-sm">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {uniqueStages.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger data-testid="filter-status" className="w-[160px] h-10 bg-white border-slate-200 text-sm">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Running Delivery Phases Table */}
        <div data-testid="running-phases-section">
          <h2 className="text-base font-semibold text-slate-800 mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Running Delivery Phases</h2>
          <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b border-slate-100">
                    <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"><SortHeader field="id">Phase ID</SortHeader></TableHead>
                    <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"><SortHeader field="customerName">Customer</SortHeader></TableHead>
                    <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Year</TableHead>
                    <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Phase</TableHead>
                    <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"><SortHeader field="feederCount">Feeders</SortHeader></TableHead>
                    <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Network</TableHead>
                    <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Contract</TableHead>
                    <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"><SortHeader field="startDate">Start Date</SortHeader></TableHead>
                    <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">EDD</TableHead>
                    <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Current Stage</TableHead>
                    <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Stage ETA</TableHead>
                    <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRunning.length > 0 ? (
                    filteredRunning.map(renderPhaseRow)
                  ) : (
                    <TableRow>
                      <TableCell colSpan={13} className="text-center py-12 text-slate-400">No delivery phases match your filters</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Past Delivery Phases */}
        <div data-testid="past-phases-section">
          <Button
            variant="outline"
            onClick={() => setShowPast(!showPast)}
            className="text-sm font-medium text-slate-600 border-slate-200 hover:bg-slate-50"
            data-testid="toggle-past-phases"
          >
            {showPast ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
            Past Deliveries ({pastPhases.length})
          </Button>
          {showPast && (
            <div className="mt-4 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80 border-b border-slate-100">
                      <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Phase ID</TableHead>
                      <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Customer</TableHead>
                      <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Year</TableHead>
                      <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Phase</TableHead>
                      <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Feeders</TableHead>
                      <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Network</TableHead>
                      <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Contract</TableHead>
                      <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Start Date</TableHead>
                      <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">EDD</TableHead>
                      <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Current Stage</TableHead>
                      <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Stage ETA</TableHead>
                      <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastPhases.map(renderPhaseRow)}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
