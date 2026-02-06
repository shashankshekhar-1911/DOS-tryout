import { NavLink, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Building2, ChevronRight, Satellite, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { CUSTOMERS } from '@/data/mockData';

export const Layout = ({ children, breadcrumbs = [] }) => {
  const location = useLocation();
  const [customersExpanded, setCustomersExpanded] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50/60">
      {/* Sidebar */}
      <aside data-testid="sidebar" className="w-[260px] min-h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-30">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3" data-testid="sidebar-logo">
            <div className="w-9 h-9 rounded-lg bg-indigo-700 flex items-center justify-center">
              <Satellite className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>AiDASH</h1>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">Delivery Orchestration</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/"
            end
            data-testid="nav-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <LayoutDashboard className="w-[18px] h-[18px]" />
            Dashboard
          </NavLink>

          <div>
            <button
              data-testid="nav-customers-toggle"
              onClick={() => setCustomersExpanded(!customersExpanded)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname.includes('/customer')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <Building2 className="w-[18px] h-[18px]" />
                Customers
              </span>
              {customersExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {customersExpanded && (
              <div className="ml-9 mt-1 space-y-0.5">
                {CUSTOMERS.map(customer => (
                  <NavLink
                    key={customer.id}
                    to={`/customer/${customer.id}`}
                    data-testid={`nav-customer-${customer.id}`}
                    className={({ isActive }) =>
                      `block px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                        isActive
                          ? 'text-indigo-700 font-medium bg-indigo-50/60'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`
                    }
                  >
                    {customer.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-medium">DOS v1.0.0 Beta</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[260px] min-h-screen">
        {/* Breadcrumb Header */}
        {breadcrumbs.length > 0 && (
          <div className="px-8 pt-6 pb-0">
            <nav data-testid="breadcrumb-nav" className="flex items-center gap-1.5 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-1.5">
                  {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                  {crumb.href ? (
                    <Link
                      to={crumb.href}
                      data-testid={`breadcrumb-${index}`}
                      className="text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span data-testid={`breadcrumb-${index}`} className="text-slate-800 font-medium">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        )}

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
