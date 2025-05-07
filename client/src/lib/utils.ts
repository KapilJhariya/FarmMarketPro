import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function calculatePriceChange(current: number, previous: number): {
  percentage: number;
  isIncrease: boolean;
  isDecrease: boolean;
  isUnchanged: boolean;
} {
  if (previous === 0) return { percentage: 0, isIncrease: false, isDecrease: false, isUnchanged: true };
  
  const difference = current - previous;
  const percentage = (Math.abs(difference) / previous) * 100;
  
  return {
    percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
    isIncrease: difference > 0,
    isDecrease: difference < 0,
    isUnchanged: difference === 0,
  };
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return `${formatDate(d)}, ${formatTime(d)}`;
}

export function generateOrderNumber(): string {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function generateTicketNumber(): string {
  return `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function calculateDuration(startDate: Date | string, endDate: Date | string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}
