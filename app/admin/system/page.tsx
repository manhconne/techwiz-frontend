'use client';
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { 
  Activity, Server, Zap, Users, ArrowRight, ShieldAlert, 
  Terminal, CheckCircle2, ArrowUpRight, Radio, Compass, RefreshCw
} from 'lucide-react';

export default function SystemMonitorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sysStatus, setSysStatus] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/system-status.json?t=' + Date.now());
        const data = await res.json();
        setSysStatus(data);
      } catch (e) {
        // file might not exist if script isn't running
      }
    };
    fetchStatus();
    const iv = setInterval(fetchStatus, 300);
    return () => clearInterval(iv);
  }, []);

  const getStatusColor = (status: string, cpu: number) => {
    if (status === 'SCALING_UP') return 'text-rose-500 border-rose-500 bg-rose-500/10 animate-pulse';
    if (status === 'SCALING_DOWN') return 'text-amber-500 border-amber-500 bg-amber-500/10';
    if (status === 'BALANCED') return 'text-blue-400 border-blue-400 bg-blue-500/10';
    if (cpu > 80) return 'text-red-500 border-red-500 bg-red-500/10 animate-pulse';
    if (cpu > 50) return 'text-amber-500 border-amber-500 bg-amber-500/10';
    return 'text-emerald-500 border-emerald-500 bg-emerald-500/10';
  };

  const getCpuBarColor = (cpu: number) => {
    if (cpu > 80) return 'bg-rose-500';
    if (cpu > 50) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const renderServiceCard = (title: string, svcKey: string, description: string, route: string) => {
    const svc = sysStatus?.services?.[svcKey] || { replicas: 0, avgCpu: 0, status: 'OFFLINE', totalRequests: 0, rps: 0, nodes: [] };
    const isActiveHotspot = sysStatus?.hotspot === svcKey;

    return (
      <div className={`p-6 rounded-2xl border-2 transition-all duration-500 flex flex-col justify-between ${isActiveHotspot ? 'border-rose-500 bg-slate-900/90 shadow-[0_0_25px_rgba(244,63,94,0.25)]' : 'border-slate-800 bg-slate-900'}`}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Server size={20} className={isActiveHotspot ? 'text-rose-400' : 'text-slate-400'} />
                {title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{description}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(svc.status, svc.avgCpu)}`}>
              {svc.status === 'OFFLINE' ? 'OFFLINE' : svc.status}
            </div>
          </div>

          {/* Route & Request Counter */}
          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 mb-5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase">API Route</div>
              <div className="text-xs font-mono font-bold text-blue-400">{route}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-mono uppercase">Live Ingress Traffic</div>
              <div className="text-sm font-mono font-bold text-white flex items-center justify-end gap-1.5">
                <span>{svc.totalRequests?.toLocaleString() || 0}</span>
                <span className="text-[10px] text-slate-400">reqs</span>
                {svc.rps > 0 && (
                  <span className="text-[10px] bg-amber-500/20 border border-amber-500/40 text-amber-400 px-1.5 py-0.5 rounded font-bold animate-pulse">
                    {svc.rps} r/s
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-300">Cluster CPU Load</span>
              <span className={svc.avgCpu > 80 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{svc.avgCpu}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getCpuBarColor(svc.avgCpu)}`} 
                style={{ width: `${Math.min(100, Math.max(0, svc.avgCpu))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase font-bold text-slate-400">Load-Balanced Nodes ({svc.replicas})</h4>
            <span className="text-[10px] font-mono text-slate-500">Algorithm: Round-Robin</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {svc.nodes?.map((node: any, idx: number) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-slate-300 font-mono font-bold truncate mr-1" title={node.name}>
                    {node.name.split('-').pop()}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${node.cpu > 80 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {node.cpu}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Share: {node.share || 100}%</span>
                  <span className="text-slate-400 font-semibold">{node.requests?.toLocaleString() || 0} reqs</span>
                </div>
              </div>
            ))}
            {svc.nodes?.length === 0 && (
              <div className="col-span-2 text-center text-slate-600 text-xs py-3">No active nodes</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col transition-all duration-300 overflow-hidden">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        
        <div className="flex-1 overflow-auto p-6 lg:p-10 bg-slate-950">
          <div className="max-w-[1400px] mx-auto">
            
            {/* Header section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <Activity className="text-emerald-400" size={32} />
                  Live System Monitor
                </h1>
                <p className="text-slate-400 mt-2 text-sm">
                  Kong API Gateway Real-time Routing & Docker Container Auto-Scaling Telemetry
                </p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-xl flex items-center gap-4 flex-1 md:flex-initial">
                  <Users className="text-blue-400" size={24} />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Active User Threads</div>
                    <div className="text-2xl font-black text-white font-mono">{sysStatus?.activeUsers?.toLocaleString() || 0}</div>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-xl flex items-center gap-4 flex-1 md:flex-initial">
                  <Zap className="text-amber-400" size={24} />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Total Routed Requests</div>
                    <div className="text-2xl font-black text-white font-mono">{sysStatus?.totalRequests?.toLocaleString() || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Traffic Pipeline Diagram */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldAlert size={140} className="text-slate-300" />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Compass className="text-blue-400" size={16} />
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Intelligent Traffic Pipeline & Routing Topology
                  </h3>
                </div>
                {sysStatus?.activeEndpoint && (
                  <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
                    <Radio className="text-blue-400 animate-pulse" size={14} />
                    <span className="text-xs font-mono text-blue-300 font-bold">TARGET: {sysStatus.activeEndpoint}</span>
                    {sysStatus.requestsPerSec > 0 && (
                      <span className="text-xs font-mono text-amber-400 font-bold ml-2">⚡ {sysStatus.requestsPerSec} req/s</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                
                {/* Gateway Box */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-xl shadow-[0_0_25px_rgba(37,99,235,0.4)] z-10 w-full lg:w-72 border border-blue-400/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded font-mono font-bold">INSPECTOR</span>
                    <span className="text-[10px] text-emerald-300 font-mono flex items-center gap-1 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                    </span>
                  </div>
                  <div className="text-white font-black text-xl tracking-tight">KONG GATEWAY</div>
                  <div className="text-blue-200 text-xs font-mono mt-1">Port 8080 &bull; Round-Robin Balancer</div>
                  <div className="mt-3 pt-3 border-t border-blue-500/40 flex justify-between text-[11px] font-mono text-blue-100">
                    <span>Active Ingress:</span>
                    <span className="font-bold">{sysStatus?.activeUsers > 0 ? `${sysStatus.activeUsers} Streams` : 'Idle'}</span>
                  </div>
                </div>
                
                {/* Visual Pipeline Beams */}
                <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
                    <span className="text-[11px] text-slate-400">Reverse Proxy Dispatch</span>
                    <span className="text-amber-400 font-bold">{sysStatus?.requestsPerSec > 0 ? `${sysStatus.requestsPerSec} requests/sec` : 'Standing By'}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full relative overflow-hidden border border-slate-800">
                    {sysStatus?.hotspot && (
                      <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 via-rose-500 to-amber-400 animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 mt-2 text-xs font-mono">
                    <ArrowRight size={16} className={sysStatus?.hotspot ? 'text-rose-400 animate-bounce' : 'text-slate-600'} />
                    <span>Dynamic Service Resolution</span>
                  </div>
                </div>

                {/* Target Services Stack */}
                <div className="flex flex-col gap-3 w-full lg:w-96 z-10">
                  
                  {/* Event Target */}
                  <div className={`px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all duration-300 ${sysStatus?.hotspot === 'event-service' ? 'bg-rose-950/80 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-slate-950 border-slate-800'}`}>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        Event Service
                        {sysStatus?.hotspot === 'event-service' && <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded font-mono font-bold animate-pulse">RECEIVING 100%</span>}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">/api/v1/events &bull; {sysStatus?.services?.['event-service']?.totalRequests?.toLocaleString() || 0} reqs</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300">{sysStatus?.services?.['event-service']?.replicas || 1} Nodes</span>
                  </div>

                  {/* Booking Target */}
                  <div className={`px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all duration-300 ${sysStatus?.hotspot === 'booking-service' ? 'bg-amber-950/80 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-950 border-slate-800'}`}>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        Booking Service
                        {sysStatus?.hotspot === 'booking-service' && <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded font-mono font-bold animate-pulse">RECEIVING 100%</span>}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">/api/v1/bookings &bull; {sysStatus?.services?.['booking-service']?.totalRequests?.toLocaleString() || 0} reqs</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300">{sysStatus?.services?.['booking-service']?.replicas || 1} Nodes</span>
                  </div>

                  {/* Payment Target */}
                  <div className={`px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all duration-300 ${sysStatus?.hotspot === 'payment-service' ? 'bg-emerald-950/80 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-950 border-slate-800'}`}>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        Payment Service
                        {sysStatus?.hotspot === 'payment-service' && <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-mono font-bold animate-pulse">RECEIVING 100%</span>}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">/api/v1/payments &bull; {sysStatus?.services?.['payment-service']?.totalRequests?.toLocaleString() || 0} reqs</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300">{sysStatus?.services?.['payment-service']?.replicas || 1} Nodes</span>
                  </div>

                </div>
              </div>
            </div>

            {/* Container Replicas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {renderServiceCard("Event Service", "event-service", "Listing & heavy browse traffic", "/api/v1/events")}
              {renderServiceCard("Booking Service", "booking-service", "Seat reservation & ticket lifecycle", "/api/v1/bookings")}
              {renderServiceCard("Payment Service", "payment-service", "Wallet balance & VNPay checkout", "/api/v1/payments")}
            </div>

            {/* Live Gateway Routing Activity Log */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
                  <Terminal className="text-emerald-400" size={18} />
                  Live Kong Gateway Routing Activity
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <RefreshCw size={12} className="animate-spin text-slate-500" />
                  Streaming Live Telemetry
                </div>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {(Array.isArray(sysStatus?.recentRoutes) ? sysStatus.recentRoutes : (sysStatus?.recentRoutes ? [sysStatus.recentRoutes] : [])).length > 0 ? (
                  (Array.isArray(sysStatus?.recentRoutes) ? sysStatus.recentRoutes : [sysStatus?.recentRoutes]).map((route: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800/80 px-4 py-2.5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">{route.time}</span>
                        <span className="bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded font-bold text-[10px]">{route.gateway}</span>
                        <ArrowRight size={14} className="text-slate-600" />
                        <span className="text-emerald-400 font-bold">{route.destination}</span>
                        <span className="text-slate-400 text-[11px]">({route.algorithm})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-300">{route.endpoint}</span>
                        <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">{route.status}</span>
                        <span className="text-amber-400">{route.latency}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    Gateway idle. Start <code className="text-amber-400">python ScenarioLoadTest.py</code> to view live request dispatching stream.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
