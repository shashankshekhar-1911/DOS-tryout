import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { getCustomerById, getDeliveryPhasesByCustomer, formatCurrency, formatDate } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Building2, MapPin, DollarSign, FileText, User, Mail, Eye, Calendar, Hash, Network } from 'lucide-react';

export default function CustomerPage() {
  const { id } = useParams();
  const customer = getCustomerById(id);
  const deliveries = getDeliveryPhasesByCustomer(id);
  const runningDeliveries = deliveries.filter(d => d.status !== 'completed');
  const pastDeliveries = deliveries.filter(d => d.status === 'completed');

  if (!customer) {
    return (
      <Layout breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Customer Not Found' }]}>
        <div data-testid="customer-not-found" className="flex items-center justify-center h-64">
          <p className="text-slate-500 text-lg">Customer not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: customer.name }]}>
      <div data-testid="customer-page" className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>{customer.name}</h1>
          <p className="text-sm text-slate-500 mt-1">Customer 360 - Complete overview of contracts and deliveries</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Profile Card */}
          <div className="lg:col-span-1 space-y-5">
            <Card data-testid="customer-profile-card" className="bg-white border border-slate-100 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>{customer.name}</h2>
                  <p className="text-sm text-slate-500">{customer.industry}</p>
                </div>
              </div>

              <Separator className="mb-5" />

              <div className="space-y-4">
                <InfoRow icon={MapPin} label="Headquarters" value={`${customer.hqState}, ${customer.hqCountry}`} />
                <InfoRow icon={DollarSign} label="Annual ARR" value={formatCurrency(customer.arr)} valueClass="text-emerald-700 font-semibold" />
                <InfoRow icon={FileText} label="Contract ID" value={customer.contractId} valueClass="font-mono text-xs" />
                <InfoRow icon={Calendar} label="Contract Period" value={`${formatDate(customer.contractStartDate)} - ${formatDate(customer.contractEndDate)}`} />
              </div>
            </Card>

            <Card data-testid="customer-contact-card" className="bg-white border border-slate-100 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">Primary Contact</h3>
              <div className="space-y-3">
                <InfoRow icon={User} label="Name" value={customer.contactName} />
                <InfoRow icon={Mail} label="Email" value={customer.contactEmail} valueClass="text-xs" />
                <InfoRow icon={Building2} label="Role" value={customer.contactRole} />
              </div>
            </Card>

            <Card data-testid="customer-stats-card" className="bg-white border border-slate-100 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">Delivery Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <StatBlock label="Running" value={runningDeliveries.length} color="text-blue-700" />
                <StatBlock label="Completed" value={pastDeliveries.length} color="text-emerald-700" />
                <StatBlock label="Total Feeders" value={deliveries.reduce((sum, d) => sum + d.feederCount, 0)} color="text-slate-800" />
                <StatBlock label="Total Phases" value={deliveries.length} color="text-slate-800" />
              </div>
            </Card>
          </div>

          {/* Deliveries */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="running" className="w-full">
              <TabsList className="mb-5 bg-slate-100 p-1 rounded-lg">
                <TabsTrigger value="running" data-testid="tab-running" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium">
                  Running ({runningDeliveries.length})
                </TabsTrigger>
                <TabsTrigger value="past" data-testid="tab-past" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium">
                  Past ({pastDeliveries.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="running">
                <div className="space-y-4">
                  {runningDeliveries.length > 0 ? (
                    runningDeliveries.map(delivery => (
                      <DeliveryCard key={delivery.id} delivery={delivery} />
                    ))
                  ) : (
                    <EmptyState message="No running deliveries" />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="past">
                <div className="space-y-4">
                  {pastDeliveries.length > 0 ? (
                    pastDeliveries.map(delivery => (
                      <DeliveryCard key={delivery.id} delivery={delivery} />
                    ))
                  ) : (
                    <EmptyState message="No past deliveries" />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function InfoRow({ icon: Icon, label, value, valueClass = '' }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{label}</p>
        <p className={`text-sm text-slate-700 mt-0.5 break-all ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

function StatBlock({ label, value, color }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 text-center">
      <p className={`text-xl font-bold ${color}`} style={{ fontFamily: 'Manrope, sans-serif' }}>{value}</p>
      <p className="text-[11px] text-slate-500 font-medium mt-1">{label}</p>
    </div>
  );
}

function DeliveryCard({ delivery }) {
  return (
    <Card data-testid={`delivery-card-${delivery.id}`} className="bg-white border border-slate-100 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3">
            <Link to={`/delivery/${delivery.id}`} className="text-base font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors" data-testid={`delivery-link-${delivery.id}`}>
              {delivery.id}
            </Link>
            <StatusBadge status={delivery.status} size="sm" />
          </div>
          <p className="text-sm text-slate-500 mt-1">Phase {delivery.phaseNumber} - {delivery.deliveryYear}</p>
        </div>
        <Link to={`/delivery/${delivery.id}`}>
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 h-8" data-testid={`view-delivery-${delivery.id}`}>
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <DetailItem icon={Hash} label="Feeders" value={delivery.feederCount} />
        <DetailItem icon={Network} label="Network" value={delivery.networkType} />
        <DetailItem icon={Calendar} label="Start" value={formatDate(delivery.startDate)} />
        <DetailItem icon={Calendar} label="EDD" value={formatDate(delivery.estimatedDeliveryDate)} />
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Current Stage:</span>
          <span className="text-xs font-semibold text-slate-700">{delivery.currentStageName}</span>
          {delivery.stageEta !== '-' && (
            <span className="text-xs text-slate-400">- ETA: {delivery.stageEta}</span>
          )}
        </div>
        {/* Mini progress bar */}
        <div className="mt-2 flex gap-1">
          {delivery.stages.map(stage => (
            <div
              key={stage.id}
              className={`h-1.5 flex-1 rounded-full ${
                stage.status === 'completed' ? 'bg-emerald-400' :
                stage.status === 'running' ? 'bg-blue-400' : 'bg-slate-200'
              }`}
              title={`${stage.shortName}: ${stage.status}`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-slate-400" />
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-slate-700 font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex items-center justify-center h-32 bg-slate-50 rounded-xl border border-dashed border-slate-200">
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}
