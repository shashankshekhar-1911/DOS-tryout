export const STAGES = [
  { id: 0, name: 'Project Setup & Management', shortName: 'Project Setup', description: "Project's initial configuration is defined along with information on project phasing, along with necessary feeder accounting for Project Managers" },
  { id: 1, name: 'Customer Data Ingestion', shortName: 'Data Ingestion', description: "Customer's network shapefiles, device shapefiles, outage data, etc. are ingested into the system" },
  { id: 2, name: 'Shapefile Correction', shortName: 'Shapefile Correction', description: "Network shapefiles are corrected by GIS team to align the span endpoints with poles visible on a basemap imagery" },
  { id: 3, name: 'Imagery Feasibility', shortName: 'Image Feasibility', description: "Availability of required 2-D imagery and DSM data is checked via APIs of multiple vendors" },
  { id: 4, name: 'Imagery Procurement Decisioning', shortName: 'Image Procurement', description: "Project Manager decides what imagery to procure based on feasibility results" },
  { id: 5, name: 'Imagery Acquisition', shortName: 'Image Acquisition', description: "Orders are placed and imageries are downloaded and ingested into the system" },
  { id: 6, name: 'Labelling', shortName: 'Span Labelling', description: "Network shapefile is annotated by GIS against the procured imagery to detect vegetation encroachment" },
  { id: 7, name: 'Model Runs', shortName: 'Model Runs', description: "ML models identify vegetation polygons around conductor lines and heights are tagged to each polygon" },
  { id: 8, name: 'Analytics', shortName: 'Analytics', description: "Algorithm creates business analytics metrics such as risk bands, predicted trim year, cost calculations" },
];

export const CUSTOMERS = [
  {
    id: 'cust-001',
    name: 'Pacific Power',
    industry: 'Electric Utility',
    hqCountry: 'United States',
    hqState: 'Oregon',
    arr: 2500000,
    contractId: 'CNT-2024-PP-001',
    contractStartDate: '2024-01-15',
    contractEndDate: '2027-01-14',
    contactName: 'Sarah Mitchell',
    contactEmail: 'sarah.mitchell@pacificpower.com',
    contactRole: 'VP Operations',
  },
  {
    id: 'cust-002',
    name: 'Midwest Grid Corp',
    industry: 'Electric Utility',
    hqCountry: 'United States',
    hqState: 'Illinois',
    arr: 3800000,
    contractId: 'CNT-2023-MGC-001',
    contractStartDate: '2023-06-01',
    contractEndDate: '2026-05-31',
    contactName: 'David Chen',
    contactEmail: 'david.chen@midwestgrid.com',
    contactRole: 'Director of Grid Operations',
  },
  {
    id: 'cust-003',
    name: 'Southeast Energy',
    industry: 'Electric Utility',
    hqCountry: 'United States',
    hqState: 'Georgia',
    arr: 1900000,
    contractId: 'CNT-2024-SE-001',
    contractStartDate: '2024-03-01',
    contractEndDate: '2027-02-28',
    contactName: 'Jennifer Torres',
    contactEmail: 'j.torres@southeastenergy.com',
    contactRole: 'Vegetation Manager',
  },
  {
    id: 'cust-004',
    name: 'Northern Utilities',
    industry: 'Electric Utility',
    hqCountry: 'Canada',
    hqState: 'Ontario',
    arr: 2100000,
    contractId: 'CNT-2024-NU-001',
    contractStartDate: '2024-07-01',
    contractEndDate: '2027-06-30',
    contactName: 'Michael Brown',
    contactEmail: 'm.brown@northernutilities.ca',
    contactRole: 'Program Manager',
  },
  {
    id: 'cust-005',
    name: 'Great Plains Electric',
    industry: 'Electric Utility',
    hqCountry: 'United States',
    hqState: 'Kansas',
    arr: 1500000,
    contractId: 'CNT-2024-GPE-001',
    contractStartDate: '2024-09-01',
    contractEndDate: '2027-08-31',
    contactName: 'Lisa Anderson',
    contactEmail: 'l.anderson@greatplains.com',
    contactRole: 'Asset Manager',
  },
];

function generateStageStatuses(currentStageId, feederCount) {
  return STAGES.map(stage => {
    let status = 'upcoming';
    let feeders = 0;
    if (stage.id < currentStageId) {
      status = 'completed';
      feeders = feederCount;
    } else if (stage.id === currentStageId) {
      status = 'running';
      feeders = Math.floor(feederCount * 0.7);
    }
    return {
      ...stage,
      status,
      feedersProcessed: feeders,
      feedersTotal: feederCount,
    };
  });
}

export const DELIVERY_PHASES = [
  {
    id: 'DP-2025-001',
    customerId: 'cust-001',
    customerName: 'Pacific Power',
    deliveryYear: 2025,
    phaseNumber: 1,
    feederCount: 45,
    networkType: 'Dx-only',
    contractId: 'CNT-2024-PP-001',
    startDate: '2025-01-10',
    estimatedDeliveryDate: '2025-06-30',
    currentStage: 6,
    currentStageName: 'Span Labelling',
    stageEta: 'Mar 15, 2025',
    status: 'running',
    stages: generateStageStatuses(6, 45),
  },
  {
    id: 'DP-2025-002',
    customerId: 'cust-001',
    customerName: 'Pacific Power',
    deliveryYear: 2025,
    phaseNumber: 2,
    feederCount: 32,
    networkType: 'Both Dx/Tx',
    contractId: 'CNT-2024-PP-001',
    startDate: '2025-02-01',
    estimatedDeliveryDate: '2025-08-15',
    currentStage: 3,
    currentStageName: 'Image Feasibility',
    stageEta: 'Feb 28, 2025',
    status: 'running',
    stages: generateStageStatuses(3, 32),
  },
  {
    id: 'DP-2025-003',
    customerId: 'cust-002',
    customerName: 'Midwest Grid Corp',
    deliveryYear: 2025,
    phaseNumber: 1,
    feederCount: 68,
    networkType: 'Dx-only',
    contractId: 'CNT-2023-MGC-001',
    startDate: '2025-01-05',
    estimatedDeliveryDate: '2025-07-20',
    currentStage: 7,
    currentStageName: 'Model Runs',
    stageEta: 'Mar 10, 2025',
    status: 'running',
    stages: generateStageStatuses(7, 68),
  },
  {
    id: 'DP-2025-004',
    customerId: 'cust-003',
    customerName: 'Southeast Energy',
    deliveryYear: 2025,
    phaseNumber: 1,
    feederCount: 55,
    networkType: 'Tx-only',
    contractId: 'CNT-2024-SE-001',
    startDate: '2025-01-20',
    estimatedDeliveryDate: '2025-09-01',
    currentStage: 4,
    currentStageName: 'Image Procurement',
    stageEta: 'Mar 05, 2025',
    status: 'delayed',
    stages: generateStageStatuses(4, 55),
  },
  {
    id: 'DP-2025-005',
    customerId: 'cust-004',
    customerName: 'Northern Utilities',
    deliveryYear: 2025,
    phaseNumber: 1,
    feederCount: 41,
    networkType: 'Dx-only',
    contractId: 'CNT-2024-NU-001',
    startDate: '2025-02-10',
    estimatedDeliveryDate: '2025-10-15',
    currentStage: 1,
    currentStageName: 'Data Ingestion',
    stageEta: 'Mar 01, 2025',
    status: 'running',
    stages: generateStageStatuses(1, 41),
  },
  {
    id: 'DP-2025-006',
    customerId: 'cust-005',
    customerName: 'Great Plains Electric',
    deliveryYear: 2025,
    phaseNumber: 1,
    feederCount: 28,
    networkType: 'Both Dx/Tx',
    contractId: 'CNT-2024-GPE-001',
    startDate: '2025-01-15',
    estimatedDeliveryDate: '2025-07-31',
    currentStage: 5,
    currentStageName: 'Image Acquisition',
    stageEta: 'Feb 25, 2025',
    status: 'running',
    stages: generateStageStatuses(5, 28),
  },
  {
    id: 'DP-2024-001',
    customerId: 'cust-001',
    customerName: 'Pacific Power',
    deliveryYear: 2024,
    phaseNumber: 1,
    feederCount: 50,
    networkType: 'Dx-only',
    contractId: 'CNT-2024-PP-001',
    startDate: '2024-02-01',
    estimatedDeliveryDate: '2024-08-30',
    currentStage: 8,
    currentStageName: 'Analytics',
    stageEta: '-',
    status: 'completed',
    stages: generateStageStatuses(9, 50),
  },
  {
    id: 'DP-2024-002',
    customerId: 'cust-002',
    customerName: 'Midwest Grid Corp',
    deliveryYear: 2024,
    phaseNumber: 1,
    feederCount: 62,
    networkType: 'Dx-only',
    contractId: 'CNT-2023-MGC-001',
    startDate: '2024-01-10',
    estimatedDeliveryDate: '2024-07-15',
    currentStage: 8,
    currentStageName: 'Analytics',
    stageEta: '-',
    status: 'completed',
    stages: generateStageStatuses(9, 62),
  },
  {
    id: 'DP-2024-003',
    customerId: 'cust-003',
    customerName: 'Southeast Energy',
    deliveryYear: 2024,
    phaseNumber: 1,
    feederCount: 38,
    networkType: 'Both Dx/Tx',
    contractId: 'CNT-2024-SE-001',
    startDate: '2024-04-01',
    estimatedDeliveryDate: '2024-11-30',
    currentStage: 8,
    currentStageName: 'Analytics',
    stageEta: '-',
    status: 'completed',
    stages: generateStageStatuses(9, 38),
  },
];

export const WORKFLOW_STEPS = {
  'DP-2025-001': {
    stageId: 6,
    stageName: 'Span Labelling',
    feedersInScope: 45,
    feedersReleasedForLabelling: 32,
    feedersAlreadyLabelled: 18,
    feedersRemaining: 14,
    steps: [
      {
        id: 1,
        name: 'Share Requirement',
        authorizedRole: 'PM / Project Analyst',
        description: 'Define scope, finalize requirements (custom instructions, things-to-note, etc.) and release data',
        status: 'completed',
        completedAt: '2025-02-10T09:30:00Z',
        completedBy: 'John Parker (PM)',
        query: "SELECT feeder_id FROM feeders WHERE region = 'West' AND priority = 'HIGH' AND status = 'ready'",
        instructions: 'Focus on high-priority feeders in the western corridor. Ensure all span endpoints are clearly visible. Flag any feeders with overlapping vegetation zones for additional review.',
      },
      {
        id: 2,
        name: 'Accept Labelling Work',
        authorizedRole: 'GIS',
        description: 'Download data to start labelling',
        status: 'running',
        completedAt: null,
        completedBy: null,
      },
      {
        id: 3,
        name: 'Submit Labelled Shapefile',
        authorizedRole: 'GIS',
        description: 'Upload labelled shapefiles back',
        status: 'upcoming',
        completedAt: null,
        completedBy: null,
      },
    ],
  },
};

export const AUDIT_LOGS = {
  'DP-2025-001': [
    { id: 'log-001', timestamp: '2025-02-10T09:30:00Z', user: 'John Parker', role: 'PM', action: 'Submitted labelling requirement', details: 'Query: SELECT feeder_id FROM feeders WHERE region = \'West\' AND priority = \'HIGH\'', stage: 'Span Labelling - Step 1' },
    { id: 'log-002', timestamp: '2025-02-10T09:30:05Z', user: 'System', role: 'System', action: 'Notification sent to GIS PoC', details: 'Email notification sent to gis-team@aidash.com', stage: 'Span Labelling - Step 1' },
    { id: 'log-003', timestamp: '2025-02-10T09:31:00Z', user: 'System', role: 'System', action: 'Data package prepared', details: '32 feeders packaged for labelling (124 MB)', stage: 'Span Labelling - Step 2' },
    { id: 'log-004', timestamp: '2025-02-10T14:15:00Z', user: 'Maria Gonzalez', role: 'GIS', action: 'Viewed labelling request', details: 'Opened delivery phase DP-2025-001 span labelling workflow', stage: 'Span Labelling - Step 2' },
    { id: 'log-005', timestamp: '2025-02-08T11:00:00Z', user: 'System', role: 'System', action: 'Stage 5 completed', details: 'Imagery acquisition completed for all 45 feeders', stage: 'Image Acquisition' },
    { id: 'log-006', timestamp: '2025-02-05T16:45:00Z', user: 'John Parker', role: 'PM', action: 'Approved imagery procurement', details: 'Approved procurement for Vendor A (Maxar) - 45 feeders', stage: 'Image Procurement' },
    { id: 'log-007', timestamp: '2025-01-28T10:20:00Z', user: 'System', role: 'System', action: 'Imagery feasibility completed', details: 'Feasibility check passed: 45/45 feeders have available imagery', stage: 'Image Feasibility' },
    { id: 'log-008', timestamp: '2025-01-20T09:00:00Z', user: 'Alex Kim', role: 'GIS', action: 'Shapefile correction completed', details: 'All 45 feeder shapefiles corrected and validated', stage: 'Shapefile Correction' },
  ],
};

export function getRunningPhases() {
  return DELIVERY_PHASES.filter(p => p.status !== 'completed');
}

export function getPastPhases() {
  return DELIVERY_PHASES.filter(p => p.status === 'completed');
}

export function getCustomerById(id) {
  return CUSTOMERS.find(c => c.id === id);
}

export function getDeliveryPhaseById(id) {
  return DELIVERY_PHASES.find(p => p.id === id);
}

export function getDeliveryPhasesByCustomer(customerId) {
  return DELIVERY_PHASES.filter(p => p.customerId === customerId);
}

export function getWorkflowSteps(deliveryPhaseId) {
  return WORKFLOW_STEPS[deliveryPhaseId] || null;
}

export function getAuditLogs(deliveryPhaseId) {
  return AUDIT_LOGS[deliveryPhaseId] || [];
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr || dateStr === '-') return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTimestamp(isoStr) {
  if (!isoStr) return '-';
  const date = new Date(isoStr);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
