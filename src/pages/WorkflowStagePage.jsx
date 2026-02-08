import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { getDeliveryPhaseById, getWorkflowSteps, getAuditLogs, formatTimestamp } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  CheckCircle2, Circle, Loader2, Info, Download, Upload, Send,
  FileText, History, User, Clock, AlertCircle, Hash, Zap,
  ChevronDown, ChevronRight
} from 'lucide-react';

export default function WorkflowStagePage() {
  const { id, stageId } = useParams();
  const delivery = getDeliveryPhaseById(id);
  const workflowData = getWorkflowSteps(id);
  const auditLogs = getAuditLogs(id);
  const [expandedStep, setExpandedStep] = useState(null);
  const [queryText, setQueryText] = useState('');
  const [instructionText, setInstructionText] = useState('');
  const [showAuditLogs, setShowAuditLogs] = useState(false);

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

  const handleSubmitRequirement = () => {
    if (!queryText.trim()) {
      toast.error('Please enter a query to define the feeder scope');
      return;
    }
    toast.success('Requirement submitted successfully! Notification sent to GIS team.');
    setQueryText('');
    setInstructionText('');
  };

  const handleDownload = () => {
    toast.success('Downloading shapefile package... (124 MB)');
  };

  const handleUpload = () => {
    toast.success('Shapefile uploaded successfully! Validation passed.');
  };

  const toggleStep = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div data-testid="workflow-stage-page" className="space-y-8">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>Span Labelling Workflow</h1>
            <StatusBadge status="running" />
          </div>
          <p className="text-sm text-slate-500 mt-1">{delivery.id} - {delivery.customerName}</p>
        </div>

        {/* Status Widget */}
        <div data-testid="workflow-status-widget" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatusWidget label="Feeders in Scope" value={workflowData.feedersInScope} icon={Hash} color="text-slate-800" bg="bg-slate-50" />
          <StatusWidget label="Released for Labelling" value={workflowData.feedersReleasedForLabelling} icon={Zap} color="text-blue-700" bg="bg-blue-50" />
          <StatusWidget label="Already Labelled" value={workflowData.feedersAlreadyLabelled} icon={CheckCircle2} color="text-emerald-700" bg="bg-emerald-50" />
          <StatusWidget label="Remaining" value={workflowData.feedersRemaining} icon={Clock} color="text-amber-700" bg="bg-amber-50" />
        </div>

        {/* Workflow Steps */}
        <div data-testid="workflow-steps">
          <h2 className="text-base font-semibold text-slate-800 mb-5" style={{ fontFamily: 'Manrope, sans-serif' }}>Workflow Steps</h2>
          <div className="space-y-0">
            {workflowData.steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Vertical Connector */}
                {index < workflowData.steps.length - 1 && (
                  <div className="absolute left-[23px] top-[56px] bottom-0 w-0.5 bg-slate-200 z-0" />
                )}

                <Card
                  data-testid={`workflow-step-${step.id}`}
                  className={`relative z-10 bg-white border rounded-xl shadow-sm mb-4 overflow-hidden transition-shadow duration-200 ${
                    step.status === 'running' ? 'border-blue-200 shadow-md' :
                    step.status === 'completed' ? 'border-emerald-200' : 'border-slate-100'
                  }`}
                >
                  {/* Step Header */}
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50/50 transition-colors"
                    data-testid={`step-toggle-${step.id}`}
                  >
                    {/* Step Icon */}
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                      step.status === 'completed' ? 'bg-emerald-100 border-emerald-400' :
                      step.status === 'running' ? 'bg-blue-100 border-blue-400' : 'bg-slate-100 border-slate-200'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : step.status === 'running' ? (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-slate-800">Step {step.id} - {step.name}</h3>
                        <StatusBadge status={step.status} size="sm" />
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-slate-400 cursor-help flex-shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-[280px] p-3">
                              <p className="text-sm">{step.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Role: {step.authorizedRole}</p>
                      {step.completedAt && (
                        <p className="text-xs text-slate-400 mt-0.5">Completed: {formatTimestamp(step.completedAt)} by {step.completedBy}</p>
                      )}
                    </div>

                    {/* Expand Icon */}
                    {expandedStep === step.id ? (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {/* Step Content (Expanded) */}
                  {expandedStep === step.id && (
                    <div className="px-5 pb-5 border-t border-slate-100">
                      <div className="pt-4">
                        {step.id === 1 && <ShareRequirementContent step={step} queryText={queryText} setQueryText={setQueryText} instructionText={instructionText} setInstructionText={setInstructionText} onSubmit={handleSubmitRequirement} />}
                        {step.id === 2 && <AcceptLabellingContent step={step} onDownload={handleDownload} />}
                        {step.id === 3 && <SubmitShapefileContent step={step} onUpload={handleUpload} />}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs */}
        <div data-testid="audit-logs-section">
          <Button
            variant="outline"
            onClick={() => setShowAuditLogs(!showAuditLogs)}
            className="text-sm font-medium text-slate-600 border-slate-200 hover:bg-slate-50"
            data-testid="toggle-audit-logs"
          >
            <History className="w-4 h-4 mr-2" />
            {showAuditLogs ? 'Hide' : 'View'} Audit Logs ({auditLogs.length})
          </Button>

          {showAuditLogs && (
            <Card className="mt-4 bg-white border border-slate-100 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Audit Trail</h3>
              <div className="space-y-0">
                {auditLogs.map((log, index) => (
                  <div key={log.id} className="relative flex gap-4" data-testid={`audit-log-${log.id}`}>
                    {/* Timeline line */}
                    {index < auditLogs.length - 1 && (
                      <div className="absolute left-[15px] top-[30px] bottom-0 w-px bg-slate-200" />
                    )}

                    {/* Timeline dot */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center border ${
                        log.role === 'System' ? 'bg-slate-100 border-slate-200' :
                        log.role === 'PM' ? 'bg-indigo-100 border-indigo-200' : 'bg-emerald-100 border-emerald-200'
                      }`}>
                        {log.role === 'System' ? <Zap className="w-3.5 h-3.5 text-slate-500" /> :
                         log.role === 'PM' ? <User className="w-3.5 h-3.5 text-indigo-600" /> :
                         <User className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    </div>

                    {/* Log Content */}
                    <div className="pb-6 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800">{log.user}</span>
                        <span className="text-xs text-slate-400">({log.role})</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">{log.action}</p>
                      <p className="text-xs text-slate-400 mt-1">{log.details}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-slate-400">{formatTimestamp(log.timestamp)}</span>
                        <span className="text-[11px] text-indigo-500 font-medium">{log.stage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

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

function ShareRequirementContent({ step, queryText, setQueryText, instructionText, setInstructionText, onSubmit }) {
  if (step.status === 'completed') {
    return (
      <div className="space-y-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm font-medium text-emerald-800">Requirement submitted successfully</p>
          <p className="text-xs text-emerald-600 mt-1">Submitted on {formatTimestamp(step.completedAt)} by {step.completedBy}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Query Used</p>
          <div className="bg-slate-900 rounded-lg p-4">
            <code className="text-sm text-emerald-400 font-mono">{step.query}</code>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Instructions</p>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-700">{step.instructions}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Query Builder */}
      <div>
        <label className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2 block">Query Builder</label>
        <div className="bg-slate-900 rounded-lg p-4">
          <Input
            data-testid="query-input"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="SELECT feeder_id FROM feeders WHERE region = 'West' AND priority = 'HIGH'"
            className="bg-transparent border-none text-emerald-400 font-mono text-sm placeholder:text-slate-600 focus-visible:ring-0 p-0 h-auto"
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-1.5">Enter a query to extract the feeder list for labelling scope</p>
      </div>

      {/* Manual Instructions */}
      <div>
        <label className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2 block">Manual Instructions</label>
        <Textarea
          data-testid="instruction-input"
          value={instructionText}
          onChange={(e) => setInstructionText(e.target.value)}
          placeholder="Enter any specific instructions, things-to-note, or custom requirements for the GIS team..."
          className="min-h-[100px] resize-none text-sm"
        />
      </div>

      {/* Submit */}
      <Button
        onClick={onSubmit}
        className="bg-indigo-700 hover:bg-indigo-800 text-white shadow-sm rounded-lg px-6 py-2.5 font-medium"
        data-testid="submit-requirement-btn"
      >
        <Send className="w-4 h-4 mr-2" />
        Submit Requirement
      </Button>
    </div>
  );
}

function AcceptLabellingContent({ step, onDownload }) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">Labelling data package ready for download</p>
            <p className="text-xs text-blue-600 mt-1">32 feeders packaged (124 MB) - Includes shapefiles and base imagery references</p>
          </div>
        </div>
      </div>
      <Button
        onClick={onDownload}
        variant="outline"
        className="border-blue-200 text-blue-700 hover:bg-blue-50"
        data-testid="download-btn"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Shapefile Package
      </Button>
    </div>
  );
}

function SubmitShapefileContent({ step, onUpload }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  return (
    <div className="space-y-4">
      {step.status === 'upcoming' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-600">Waiting for Step 2 to complete</p>
              <p className="text-xs text-slate-400 mt-1">Upload will be available once labelling data is downloaded</p>
            </div>
          </div>
        </div>
      )}

      <div
        data-testid="upload-dropzone"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); onUpload(); }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
        } ${step.status === 'upcoming' ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-600">Drag and drop labelled shapefiles here</p>
        <p className="text-xs text-slate-400 mt-1">Supports .shp, .shx, .dbf, .prj files (max 500MB)</p>
        <Button
          onClick={onUpload}
          variant="outline"
          className="mt-4 text-sm"
          disabled={step.status === 'upcoming'}
          data-testid="upload-btn"
        >
          <FileText className="w-4 h-4 mr-2" />
          Choose Files
        </Button>
      </div>

      {step.status !== 'upcoming' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-700"><strong>Validation:</strong> Uploaded shapefiles must contain matching feeder IDs, valid geometry, and proper CRS projection (EPSG:4326)</p>
        </div>
      )}
    </div>
  );
}
