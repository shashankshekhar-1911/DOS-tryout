import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { getDeliveryPhaseById, getWorkflowSteps, getFeedersForDelivery } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  CheckCircle2, Circle, Loader2, Info, MoreHorizontal,
  Hash, Zap, Clock, RotateCcw, Search, Filter,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function WorkflowStagePage() {
  const { id } = useParams();
  const delivery = getDeliveryPhaseById(id);
  const workflowData = getWorkflowSteps(id);
  const feeders = getFeedersForDelivery(id);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [restartDialogOpen, setRestartDialogOpen] = useState(false);
  const [selectedFeeder, setSelectedFeeder] = useState(null);

  if (!delivery || !workflowData) {
    return (
      <Layout breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Not Found' }]}>
        <div data-testid="workflow-not-found" className="flex items-center justify-center h-64">
          <p className="text-slate-500 text-lg">Workflow data not found</p>
        </div>
      </Layout>
    );
  }

  const breadcrumbs = [
    { label: 'Dashboard', href: '/' },
    { label: delivery.customerName, href: `/customer/${delivery.customerId}` },
    { label: delivery.id, href: `/delivery/${delivery.id}` },
    { label: 'Span Labelling' },
  ];

  const filteredFeeders = feeders.filter(feeder => {
    const matchesSearch = feeder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feeder.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || feeder.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRestartFromStep = (feeder, step) => {
    toast.success(`Restarting "${feeder.name}" from "${step.name}"`);
    setRestartDialogOpen(false);
    setSelectedFeeder(null);
  };

  const statusCounts = {
    all: feeders.length,
    completed: feeders.filter(f => f.status === 'completed').length,
    running: feeders.filter(f => f.status === 'running').length,
    delayed: feeders.filter(f => f.status === 'delayed').length,
    upcoming: feeders.filter(f => f.status === 'upcoming').length,
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div data-testid="workflow-stage-page" className="flex flex-col" style={{ minHeight: 'calc(100vh - 120px)' }}>

        {/* ===== TOP 1/3: Workflow Overview ===== */}
        <div className="pb-6">
          {/* Page Header */}
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>Span Labelling Workflow</h1>
              <StatusBadge status="running" />
            </div>
            <p className="text-sm text-slate-500 mt-1">{delivery.id} - {delivery.customerName}</p>
          </div>

          {/* Status Widgets */}
          <div data-testid="workflow-status-widget" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatusWidget label="Feeders in Scope" value={workflowData.feedersInScope} icon={Hash} color="text-slate-800" bg="bg-slate-50" />
            <StatusWidget label="Released for Labelling" value={workflowData.feedersReleasedForLabelling} icon={Zap} color="text-blue-700" bg="bg-blue-50" />
            <StatusWidget label="Already Labelled" value={workflowData.feedersAlreadyLabelled} icon={CheckCircle2} color="text-emerald-700" bg="bg-emerald-50" />
            <StatusWidget label="Remaining" value={workflowData.feedersRemaining} icon={Clock} color="text-amber-700" bg="bg-amber-50" />
          </div>

          {/* Horizontal Workflow Steps */}
          <Card className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Workflow Steps</h2>
            <div className="flex items-center justify-between">
              {workflowData.steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  {/* Step Node */}
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 ${
                            step.status === 'completed' ? 'bg-emerald-100 border-emerald-400' :
                            step.status === 'running' ? 'bg-blue-100 border-blue-400 shadow-md shadow-blue-100' :
                            'bg-slate-100 border-slate-200'
                          }`}>
                            {step.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : step.status === 'running' ? (
                              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[260px] p-3">
                          <p className="font-semibold text-sm mb-1">Step {step.id}: {step.name}</p>
                          <p className="text-xs text-slate-500">{step.description}</p>
                          <p className="text-xs text-slate-400 mt-1.5">Role: {step.authorizedRole}</p>
                          {step.completedAt && (
                            <p className="text-xs text-emerald-600 mt-1">Completed by {step.completedBy}</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="mt-2 text-center px-1">
                      <p className={`text-[11px] font-semibold leading-tight ${
                        step.status === 'completed' ? 'text-emerald-700' :
                        step.status === 'running' ? 'text-blue-700' : 'text-slate-400'
                      }`}>
                        {step.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{step.authorizedRole}</p>
                    </div>
                  </div>

                  {/* Connector */}
                  {index < workflowData.steps.length - 1 && (
                    <div className="flex items-center -mx-2 -mt-6">
                      <div className={`h-0.5 w-16 ${
                        step.status === 'completed' ? 'bg-emerald-300' : 'bg-slate-200'
                      }`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Separator className="mb-6" />

        {/* ===== BOTTOM 2/3: Feeder List ===== */}
        <div className="flex-1">
          {/* Feeder Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-800" style={{ fontFamily: 'Manrope, sans-serif' }}>Feeder List</h2>
              <p className="text-sm text-slate-500 mt-0.5">{filteredFeeders.length} of {feeders.length} feeders shown</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  data-testid="feeder-search"
                  placeholder="Search feeders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[240px] h-9 text-sm"
                />
              </div>
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-9 text-sm" data-testid="feeder-status-filter">
                  <Filter className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ({statusCounts.all})</SelectItem>
                  <SelectItem value="completed">Completed ({statusCounts.completed})</SelectItem>
                  <SelectItem value="running">Running ({statusCounts.running})</SelectItem>
                  <SelectItem value="delayed">Delayed ({statusCounts.delayed})</SelectItem>
                  <SelectItem value="upcoming">Upcoming ({statusCounts.upcoming})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Feeder Table */}
          <Card className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="feeder-table">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Feeder ID</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Name</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Region</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Priority</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Current Stage</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Last Completed Step</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeeders.map((feeder) => (
                    <FeederRow
                      key={feeder.id}
                      feeder={feeder}
                      workflowSteps={workflowData.steps}
                      onRestartClick={(feeder) => {
                        setSelectedFeeder(feeder);
                        setRestartDialogOpen(true);
                      }}
                    />
                  ))}
                  {filteredFeeders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-sm text-slate-400">
                        No feeders match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Restart Dialog */}
        <Dialog open={restartDialogOpen} onOpenChange={setRestartDialogOpen}>
          <DialogContent className="sm:max-w-[440px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Restart from a Different Step
              </DialogTitle>
            </DialogHeader>
            {selectedFeeder && (
              <RestartStepPicker
                feeder={selectedFeeder}
                workflowSteps={workflowData.steps}
                onSelect={(step) => handleRestartFromStep(selectedFeeder, step)}
                onCancel={() => { setRestartDialogOpen(false); setSelectedFeeder(null); }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

/* ===== Sub-Components ===== */

function StatusWidget({ label, value, icon: Icon, color, bg }) {
  return (
    <Card className={`${bg} border border-slate-100 rounded-xl p-4`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${color}`} />
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{label}</p>
          <p className={`text-xl font-bold ${color}`} style={{ fontFamily: 'Manrope, sans-serif' }}>{value}</p>
        </div>
      </div>
    </Card>
  );
}

function PriorityBadge({ priority }) {
  const config = {
    HIGH: { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-200' },
    MEDIUM: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
    LOW: { bg: 'bg-slate-50', text: 'text-slate-600', ring: 'ring-slate-200' },
  };
  const c = config[priority] || config.LOW;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full ring-1 ring-inset ${c.bg} ${c.text} ${c.ring}`}>
      {priority}
    </span>
  );
}

function FeederRow({ feeder, workflowSteps, onRestartClick }) {
  return (
    <tr
      data-testid={`feeder-row-${feeder.id}`}
      className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors"
    >
      <td className="px-5 py-3.5">
        <span className="text-sm font-mono font-medium text-indigo-700">{feeder.id}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className="text-sm font-medium text-slate-800">{feeder.name}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className="text-sm text-slate-600">{feeder.region}</span>
      </td>
      <td className="px-5 py-3.5">
        <PriorityBadge priority={feeder.priority} />
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <StageIndicator stageId={feeder.currentStageId} totalSteps={workflowSteps.length} />
          <span className="text-sm text-slate-700">{feeder.currentStage}</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className="text-sm text-slate-500">{feeder.lastCompletedStep}</span>
      </td>
      <td className="px-5 py-3.5">
        <StatusBadge status={feeder.status} size="sm" />
      </td>
      <td className="px-5 py-3.5 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
              data-testid={`feeder-actions-${feeder.id}`}
            >
              <MoreHorizontal className="w-4 h-4" />
              <span className="sr-only">Open menu for {feeder.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel className="text-xs text-slate-500">{feeder.id}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onRestartClick(feeder)}
              className="text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart from a different step
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

function StageIndicator({ stageId, totalSteps }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i + 1 < stageId ? 'bg-emerald-400' :
            i + 1 === stageId ? 'bg-blue-500' :
            'bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

function RestartStepPicker({ feeder, workflowSteps, onSelect, onCancel }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-800">{feeder.name}</span>
          <span className="text-slate-400 mx-1.5">|</span>
          <span className="font-mono text-xs text-indigo-600">{feeder.id}</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Currently at: <span className="text-slate-600 font-medium">{feeder.currentStage}</span>
        </p>
      </div>

      <p className="text-sm text-slate-500">Select the step to restart from:</p>

      <div className="space-y-2">
        {workflowSteps.map((step) => (
          <button
            key={step.id}
            onClick={() => onSelect(step)}
            data-testid={`restart-step-${step.id}`}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors text-left group"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
              step.id < feeder.currentStageId ? 'bg-emerald-100 border-emerald-300' :
              step.id === feeder.currentStageId ? 'bg-blue-100 border-blue-300' :
              'bg-slate-100 border-slate-200'
            }`}>
              <span className="text-xs font-bold text-slate-600">{step.id}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-700 transition-colors">{step.name}</p>
              <p className="text-[11px] text-slate-400">{step.authorizedRole}</p>
            </div>
            <RotateCcw className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="text-sm">
          Cancel
        </Button>
      </div>
    </div>
  );
}
