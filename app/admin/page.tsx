'use client';

import React, { useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminDashboardOverview } from '../../components/admin/AdminDashboardOverview';
import { AdminCatalog } from '../../components/admin/AdminCatalog';
import { AdminOrders } from '../../components/admin/AdminOrders';
import { AdminCustomers } from '../../components/admin/AdminCustomers';
import { AdminAnalytics } from '../../components/admin/AdminAnalytics';
import { AdminSettings } from '../../components/admin/AdminSettings';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddAlbumModalOpen, setIsAddAlbumModalOpen] = useState(false);

  const handleOpenAddAlbum = () => {
    setActiveTab('catalog');
    setIsAddAlbumModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
        />

        {/* Tab Views */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboardOverview
              onAddNewAlbumClick={handleOpenAddAlbum}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'catalog' && (
            <AdminCatalog
              searchQuery={searchQuery}
              isAddModalOpen={isAddAlbumModalOpen}
              setIsAddModalOpen={setIsAddAlbumModalOpen}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders searchQuery={searchQuery} />
          )}

          {activeTab === 'customers' && (
            <AdminCustomers searchQuery={searchQuery} />
          )}

          {activeTab === 'analytics' && <AdminAnalytics />}

          {activeTab === 'aiSupport' && <AdminAnalytics />}

          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}
