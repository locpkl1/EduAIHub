import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';

const pageTitles: Record<string, string> = {
  '/admin': 'Tổng quan',
  '/admin/posts': 'Bài viết',
  '/admin/prompts': 'Prompt mẫu',
  '/admin/curriculum': 'Chương trình học',
  '/admin/resources': 'Tài nguyên',
};

export default function AdminLayout() {
  const { user, displayName } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'Admin Center';
  const userLabel = displayName || user?.email?.split('@')[0] || 'Quản trị viên';

  return (
    <div
      className="min-h-screen bg-bg text-text"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-border) 45%, transparent) 1px, transparent 0)',
        backgroundSize: '30px 30px',
      }}
    >
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-72">
        <AdminTopbar title={title} userLabel={userLabel} onMenuClick={() => setMobileOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
