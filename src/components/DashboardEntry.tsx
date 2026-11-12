import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { clearLoginDestination, readLoginDestination } from '../lib/loginDestination';
import Dashboard from '../pages/Dashboard';
import LoadingState from './ui/LoadingState';

export default function DashboardEntry() {
  const { user, loading } = useAuth();
  const [destination] = useState(readLoginDestination);
  useEffect(() => { if (user && !loading && destination) clearLoginDestination(); }, [user, loading, destination]);
  if (loading && (!user || destination)) return <LoadingState label="Đang mở không gian học tập…" />;
  return user && destination ? <Navigate to={destination} replace /> : <Dashboard />;
}
