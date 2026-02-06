import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { getDeliveryPhaseById, getCustomerById, STAGES } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, Circle, Loader2, Info, ArrowRight, Hash, Network, Calendar, Building2 } from 'lucide-react';

export default function DeliveryPage() {
  const { id } = useParams();
  const delivery = getDeliveryPhaseById(id);
  const customer = delivery ? getCustomerById(delivery.customerId) : null;

  if (!delivery) {
    return (
      <Layout breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Not Found' }]}>
        <div data-testid="delivery-not-found" className="flex items-center justify-center h-64">
          <p className="text-slate-500 text-lg">Delivery phase not found</p>
        </div>
      </Layout>
    );
  }

  const breadcrumbs = [
    { label: 'Dashboard', href: '/' },
    { label: delivery.customerName, href: `/customer/${delivery.customerId}` },
    { label: delivery.id },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div data-testid="delivery-page" className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>{delivery.id}</h1>
              <StatusBadge status={delivery.status} />
            </div>
            <p className="text-sm text-slate-500 mt-1">{delivery.customerName} - Phase {delivery.phaseNumber} ({delivery.deliveryYear})</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MiniCard icon={Hash} label="Feeders" value={delivery.feederCount} />
          <MiniCard icon={Network} label="Network Type" value={delivery.networkType} />
          <MiniCard icon={Calendar} label="Start Date" value={delivery.startDate} />
          <MiniCard icon={Calendar} label="Est. Delivery" value={delivery.estimatedDeliveryDate} />
        </div>

        {/* Pipeline Flowchart */}
        <div data-testid="stage-pipeline">
          <h2 className="text-base font-semibold text-slate-800 mb-5" style={{ fontFamily: 'Manrope, sans-serif' }}>Delivery Pipeline</h2>
          <Card className="bg-white border border-slate-100 rounded-xl shadow-sm p-6">
            <div className="overflow-x-auto pb-2">
              <div className="flex items-start gap-0 min-w-[900px]">
                {delivery.stages.map((stage, index) => (
                  <div key={stage.id} className="flex items-start flex-1">
                    {/* Stage Node */}
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative">
                              {stage.id === delivery.currentStage && stage.name === 'Labelling' ? (
                                <Link to={`/delivery/${delivery.id}/stage/${stage.id}`} className="block">
                                  <StageNode stage={stage} isClickable={true} />
                                </Link>
                              ) : (
                                <StageNode stage={stage} isClickable={false} />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-[240px] p-3">
                            <p className="font-semibold text-sm mb-1">{stage.name}</p>
                            <p className="text-xs text-slate-500">{STAGES[stage.id]?.description}</p>
                            <div className="mt-2 text-xs">
                              <span className="text-slate-400">Feeders: </span>
                              <span className="font-medium">{stage.feedersProcessed}/{stage.feedersTotal}</span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Stage Label */}
                      <div className="mt-3 text-center px-1">
                        <p className={`text-[11px] font-semibold leading-tight ${
                          stage.status === 'completed' ? 'text-emerald-700' :
                          stage.status === 'running' ? 'text-blue-700' : 'text-slate-400'
                        }`}>
                          {stage.shortName}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {stage.feedersProcessed}/{stage.feedersTotal}
                        </p>
                      </div>
                    </div>

                    {/* Connector */}
                    {index < delivery.stages.length - 1 && (
                      <div className="flex items-center pt-5 -mx-1">
                        <div className={`h-0.5 w-6 ${
                          stage.status === 'completed' ? 'bg-emerald-300' : 'bg-slate-200'
                        }`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100">
              <LegendItem color="bg-emerald-100 border-emerald-300" label="Completed" />
              <LegendItem color="bg-blue-100 border-blue-300" label="Running" />
              <LegendItem color="bg-slate-100 border-slate-200" label="Upcoming" />
            </div>
          </Card>
        </div>

        {/* Current Stage Details */}
        <div data-testid="current-stage-details">
          <h2 className="text-base font-semibold text-slate-800 mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Current Stage Details</h2>
          <Card className="bg-white border border-slate-100 rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      Stage {delivery.currentStage} - {delivery.currentStageName}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">ETA: {delivery.stageEta}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                  {STAGES[delivery.currentStage]?.description}
                </p>
              </div>
              {delivery.currentStage === 6 && (
                <Link to={`/delivery/${delivery.id}/stage/6`}>
                  <Button className="bg-indigo-700 hover:bg-indigo-800 text-white shadow-sm rounded-lg px-4 py-2 font-medium" data-testid="open-workflow-btn">
                    Open Workflow
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function StageNode({ stage, isClickable }) {
  const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-shadow duration-200";
  const statusClasses = {
    completed: 'bg-emerald-100 border-emerald-400',
    running: 'bg-blue-100 border-blue-400 shadow-md shadow-blue-100',
    upcoming: 'bg-slate-100 border-slate-200',
  };

  return (
    <div
      data-testid={`stage-node-${stage.id}`}
      className={`${baseClasses} ${statusClasses[stage.status] || statusClasses.upcoming} ${isClickable ? 'cursor-pointer hover:shadow-lg' : ''}`}
    >
      {stage.status === 'completed' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      ) : stage.status === 'running' ? (
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      ) : (
        <Circle className="w-5 h-5 text-slate-300" />
      )}
    </div>
  );
}

function MiniCard({ icon: Icon, label, value }) {
  return (
    <Card className="bg-white border border-slate-100 rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-slate-400" />
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{label}</p>
          <p className="text-sm font-semibold text-slate-800">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full border ${color}`} />
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}
