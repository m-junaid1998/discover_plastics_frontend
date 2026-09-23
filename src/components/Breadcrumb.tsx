import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem { label: string; link?: string; }

export const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <nav className="flex items-center gap-0.5 sm:gap-2 text-xs sm:text-sm font-medium py-3 text-[var(--color-muted)]">
    {items.map((item, idx) => {
      const isLast = idx === items.length - 1;
      return (
        <React.Fragment key={idx}>
          {isLast || !item.link ? (
            <span className="text-[var(--color-accent)] font-bold">{item.label}</span>
          ) : (
            <NavLink to={item.link} className="hover:text-[var(--color-accent-text)] transition-colors">
              {item.label}
            </NavLink>
          )}
          {!isLast && <ChevronRight size={14} className="text-[var(--color-muted)] shrink-0" />}
        </React.Fragment>
      );
    })}
  </nav>
);