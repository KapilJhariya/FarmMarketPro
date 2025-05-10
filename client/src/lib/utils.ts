import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  // Convert to Indian Rupees (assuming current conversion rate of ~75 INR per USD)
  // Then reduce by factor of 1/100 as requested
  const inrAmount = (amount * 75) / 100;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(inrAmount);
}

export function generateOrderNumber(): string {
  return `AG${Date.now().toString().slice(-5)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function generateTicketNumber(): string {
  return `TICK-${Date.now().toString().slice(-5)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
}

export function calculateDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate difference in days
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1 ? '1 day' : `${diffDays} days`;
}
