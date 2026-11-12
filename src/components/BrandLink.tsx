import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BrandLink({ className = '', textClassName = '', subtitle = false }: {
  className?: string;
  textClassName?: string;
  subtitle?: boolean;
}) {
  return <Link to="/" className={`brand-link ${className}`} aria-label="EduAI-Hub — Trang chủ">
    <span className="brand-mark" aria-hidden="true"><span className="brand-mark-underlay" /><span className="brand-mark-face"><GraduationCap size={21} /></span></span>
    <span className={`min-w-0 ${textClassName}`}><span className="block truncate font-display text-base font-bold sm:text-xl" translate="no">EduAI-Hub</span>{subtitle && <span className="brand-subtitle">Sổ tay học cùng AI</span>}</span>
  </Link>;
}
