/**
 * Reusable Card component for content containers.
 *
 * Educational note: Cards are common UI patterns for grouping related content.
 * This component provides consistent styling with optional title and actions.
 */

import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Card component with optional header.
 *
 * @param title Optional card title
 * @param children Card content
 * @param actions Optional action buttons in header
 * @param className Additional CSS classes
 */
export function Card({ title, children, actions, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {(title || actions) && (
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
