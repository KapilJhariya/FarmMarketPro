import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from './utils';

// Extend jsPDF with autotable plugin
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  subtotal: number;
  name?: string; // Optional product name
}

interface OrderData {
  id: number;
  orderNumber: string;
  orderDate: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
}

/**
 * Formats a date string into a readable format
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Generate a PDF receipt from an order
 */
export const generateOrderReceipt = (order: OrderData, products: any[]): jsPDF => {
  // Create a new PDF document
  const doc = new jsPDF('portrait', 'pt', 'a4') as jsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let yPosition = margin;

  // Add logo or title
  doc.setFontSize(22);
  doc.setTextColor(46, 125, 50); // Primary color #2E7D32
  doc.text('AgriManage', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 25;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Agricultural Management Platform', pageWidth / 2, yPosition, { align: 'center' });
  
  // Add receipt details
  yPosition += 40;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Receipt: #${order.orderNumber}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${formatDate(order.orderDate)}`, pageWidth / 2, yPosition, { align: 'center' });
  
  // Add order items table
  yPosition += 40;
  
  // Get product names for each item
  const enhancedItems = order.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      name: product ? `${product.name} (${product.unit})` : `Product #${item.productId}`
    };
  });
  
  // Create table data
  const tableColumn = ["Product", "Quantity", "Price", "Total"];
  const tableRows = enhancedItems.map(item => [
    item.name || `Product #${item.productId}`,
    item.quantity.toString(),
    formatCurrency(item.price),
    formatCurrency(item.subtotal)
  ]);
  
  // Add the table
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: yPosition,
    theme: 'striped',
    headStyles: { 
      fillColor: [46, 125, 50], // Primary color #2E7D32
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 60, halign: 'center' },
      2: { cellWidth: 80, halign: 'right' },
      3: { cellWidth: 80, halign: 'right' }
    },
    margin: { left: margin, right: margin }
  });
  
  // Get the Y position after the table is drawn
  yPosition = (doc as any).lastAutoTable.finalY + 20;
  
  // Add summary
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  // Subtotal
  const rightColumnX = pageWidth - margin - 100;
  doc.text("Subtotal:", rightColumnX, yPosition);
  doc.text(formatCurrency(order.subtotal), pageWidth - margin, yPosition, { align: 'right' });
  
  // Shipping
  yPosition += 20;
  doc.text("Shipping:", rightColumnX, yPosition);
  doc.text(formatCurrency(order.shippingCost), pageWidth - margin, yPosition, { align: 'right' });
  
  // Total
  yPosition += 20;
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'bold');
  doc.text("Total:", rightColumnX, yPosition);
  doc.text(formatCurrency(order.total), pageWidth - margin, yPosition, { align: 'right' });
  doc.setFont('Helvetica', 'normal');
  
  // Add shipping information
  yPosition += 40;
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'bold');
  doc.text("Shipping Information:", margin, yPosition);
  
  yPosition += 20;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(11);
  doc.text("John Farmer", margin, yPosition);
  
  yPosition += 15;
  doc.text(order.shippingAddress || "No shipping address provided", margin, yPosition);
  
  yPosition += 15;
  doc.text("Phone: (555) 123-4567", margin, yPosition);
  
  // Add payment method
  yPosition += 30;
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'bold');
  doc.text("Payment Method:", margin, yPosition);
  
  yPosition += 20;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(order.paymentMethod || "Not specified", margin, yPosition);
  
  // Add footer
  yPosition = pageHeight - 60;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Thank you for your purchase!", pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  doc.text("Questions? Contact us at support@agrimanage.com", pageWidth / 2, yPosition, { align: 'center' });
  
  return doc;
};

/**
 * Generate and download a PDF receipt
 */
export const downloadOrderReceipt = (order: OrderData, products: any[]): void => {
  const doc = generateOrderReceipt(order, products);
  doc.save(`AgriManage_Receipt_${order.orderNumber}.pdf`);
};