'use client';
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { Activity, Server, Zap, Users, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

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
    const iv = setInterval(fetchStatus, 1500);
    return () => clearInterval(iv);
  }, []);

  const getStatusColor = (status: string, cpu: number) => {
    if (status === 'SCALING_UP') return 'text-rose-500 border-rose-500 bg-rose-500/10 animate-pulse';
    if (status === 'SCALING_DOWN') return 'text-amber-500 border-amber-500 bg-amber-500/10';
    if (cpu > 80) return 'text-red-500 border-red-500 bg-red-500/10 animate-pulse';
    if (cpu > 50) return 'text-amber-500 border-amber-500 bg-amber-500/10';
    return 'text-emerald-500 border-emerald-500 bg-emerald-500/10';
  };

  const getCpuBarColor = (cpu: number) => {
    if (cpu > 80) return 'bg-rose-500';
    if (cpu > 50) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const renderServiceCard = (title: string, svcKey: string, description: string) => {
    const svc = sysStatus?.services?.[svcKey] || { replicas: 0, avgCpu: 0, status: 'OFFLINE', nodes: [] };
    const isActiveHotspot = sysStatus?.hotspot === svcKey;

    return (
      <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${isActiveHotspot ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'border-slate-800 bg-slate-900'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Server size={20} className={isActiveHotspot ? 'text-rose-400' : 'text-slate-400'} />
              {title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(svc.status, svc.avgCpu)}`}>
            {svc.status === 'OFFLINE' ? 'OFFLINE' : svc.status}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-slate-300">Avg CPU Usage</span>
            <span className={svc.avgCpu > 80 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{svc.avgCpu}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getCpuBarColor(svc.avgCpu)}`} 
              style={{ width: `${Math.min(100, Math.max(0, svc.avgCpu))}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold text-slate-500 mb-2">Running Nodes ({svc.replicas})</h4>
          <div className="grid grid-cols-2 gap-2">
            {svc.nodes?.map((node: any, idx: number) => (
              <div key={idx} className="bg-slate-950 border border-slate-700 p-3 rounded-lg flex items-center justify-between">
                <span className="text-[10px] text-slate-300 font-mono truncate mr-2 w-16" title={node.name}>
                  {node.name.split('-').pop()}
                </span>
                <span className={`text-[11px] font-mono font-bold ${node.cpu > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {node.cpu}%
                </span>
              </div>
            ))}
            {svc.nodes?.length === 0 && (
              <div className="col-span-2 text-center text-slate-600 text-xs py-2">No active nodes</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden`}>
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        
        <div className="flex-1 overflow-auto p-6 lg:p-10 bg-slate-950">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <Activity className="text-emerald-400" size={32} />
                  Live System Monitor
                </h1>
                <p className="text-slate-400 mt-2 text-sm">Real-time Auto-Scaling & Load Balancing Telemetry via Kong Gateway</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-xl flex items-center gap-4">
                  <Users className="text-blue-400" size={24} />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Active Users</div>
                    <div className="text-2xl font-black text-white font-mono">{sysStatus?.activeUsers || 0}</div>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-xl flex items-center gap-4">
                  <Zap className="text-amber-400" size={24} />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Total Requests</div>
                    <div className="text-2xl font-black text-white font-mono">{sysStatus?.totalRequests || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Traffic Flow Diagram */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldAlert size={120} className="text-slate-500" />
              </div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Live Traffic Pipeline</h3>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="bg-blue-600 px-6 py-4 rounded-xl text-center shadow-[0_0_20px_rgba(37,99,235,0.3)] z-10 w-full md:w-auto">
                  <div className="text-white font-black text-lg">KONG GATEWAY</div>
                  <div className="text-blue-200 text-xs font-mono">Port 8080 (Round-Robin)</div>
                </div>
                
                <div className="flex-1 flex justify-center py-4 w-full md:w-auto">
                   <div className="flex items-center gap-2 text-slate-600">
                     <span className="w-2 h-2 rounded-full bg-slate-700 animate-ping"></span>
                     <span className="w-2 h-2 rounded-full bg-slate-700 animate-ping" style={{ animationDelay: '0.2s' }}></span>
                     <span className="w-2 h-2 rounded-full bg-slate-700 animate-ping" style={{ animationDelay: '0.4s' }}></span>
                     <ArrowRight size={24} className="text-slate-500" />
                   </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto z-10">
                  <div className={`px-5 py-3 rounded-xl border-2 flex items-center justify-between gap-4 transition-all duration-300 ${sysStatus?.hotspot === 'event-service' ? 'bg-rose-950 border-rose-500' : 'bg-slate-950 border-slate-800'}`}>
                    <span className="text-sm font-bold text-white">Event Service</span>
                    {sysStatus?.hotspot === 'event-service' && <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded font-mono animate-pulse">ðŸ”¥ HOTSPOT</span>}
                  </div>
                  <div className={`px-5 py-3 rounded-xl border-2 flex items-center justify-between gap-4 transition-all duration-300 ${sysStatus?.hotspot === 'booking-service' ? 'bg-amber-950 border-amber-500' : 'bg-slate-950 border-slate-800'}`}>
                    <span className="text-sm font-bold text-white">Booking Service</span>
                    {sysStatus?.hotspot === 'booking-service' && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded font-mono animate-pulse">ðŸ”¥ HOTSPOT</span>}
                  </div>
                  <div className={`px-5 py-3 rounded-xl border-2 flex items-center justify-between gap-4 transition-all duration-300 ${sysStatus?.hotspot === 'payment-service' ? 'bg-emerald-950 border-emerald-500' : 'bg-slate-950 border-slate-800'}`}>
                    <span className="text-sm font-bold text-white">Payment Service</span>
                    {sysStatus?.hotspot === 'payment-service' && <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded font-mono animate-pulse">ðŸ”¥ HOTSPOT</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Container Replicas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderServiceCard("Event", "event-service", "Handles heavy view/listing traffic")}
              {renderServiceCard("Booking", "booking-service", "Handles seat locking & ticket reservation")}
              {renderServiceCard("Payment", "payment-service", "Handles complex wallet & VNPay Tx")}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}