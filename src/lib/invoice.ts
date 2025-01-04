import { CardRequest } from '../types';
import { format } from 'date-fns';
import html2pdf from 'html2pdf.js';

const COMPANY_DETAILS = {
  name: "Cardzilla",
  address: "Kamaraj Nagar, Chennai, Tamil Nadu 600001",
  city: "Chennai, Tamil Nadu 600001",
  email: "contactrohitmenon@gmail.com",
  phone: "+91 75500 00805",
  website: "www.cardzilla.com",
};

const CARD_PRICES = {
  HYBRID: 799,
  AR_QR: 499,
  NFC: 399,
  BASIC_QR: 99
};

const PAYMENT_LINKS = {
  AR_QR: 'https://rzp.io/rzp/0pY1IHOK',
  NFC: 'https://rzp.io/rzp/2YKTFLUr',
  HYBRID: 'https://rzp.io/rzp/BuChdaE',
  BASIC_QR: 'https://rzp.io/rzp/A1wLbgA'
};

export const generateInvoiceHTML = (request: CardRequest): string => {
  const invoiceNumber = `INV-${request.cardSerial}-${format(new Date(), 'yyyyMMdd')}`;
  const orderDate = format(new Date(request.timestamp), 'PPP');
  const amount = CARD_PRICES[request.cardCategory];
  const total = amount;
  const paymentLink = PAYMENT_LINKS[request.cardCategory];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 40px; color: #333; }
        .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .company-details { margin-bottom: 30px; }
        .invoice-title { font-size: 24px; color: #1d4ed8; margin-bottom: 20px; }
        .customer-details { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8fafc; }
        .amount-table td { text-align: right; }
        .amount-table tr:last-child { font-weight: bold; }
        .footer { margin-top: 50px; text-align: center; color: #666; }
        .payment-section { margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 8px; }
        .payment-link { color: #1d4ed8; text-decoration: none; font-weight: bold; }
        @media print {
          body { padding: 20px; }
          .payment-section { break-inside: avoid; }
          .footer { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div>
          <h1 class="invoice-title">INVOICE</h1>
          <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
          <p><strong>Date:</strong> ${orderDate}</p>
        </div>
        <div class="company-details">
          <h2>${COMPANY_DETAILS.name}</h2>
          <p>${COMPANY_DETAILS.address}</p>
          <p>${COMPANY_DETAILS.city}</p>
        </div>
      </div>

      <div class="customer-details">
        <h3>Bill To:</h3>
        <p><strong>${request.name}</strong></p>
        <p>Email: ${request.email}</p>
        <p>Phone: ${request.phone}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Card Type</th>
            <th>Serial Number</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cardzilla Smart Business Card</td>
            <td>${request.cardCategory}</td>
            <td>${request.cardSerial}</td>
            <td>₹${amount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <table class="amount-table">
        <tr>
          <td>Total:</td>
          <td>₹${total.toFixed(2)}</td>
        </tr>
      </table>

      <div class="payment-section">
        <h3>Payment Information</h3>
        <p>To make your payment, please click on the link below:</p>
        <p><a href="${paymentLink}" class="payment-link" target="_blank">Click here to pay ₹${total.toFixed(2)}</a></p>
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>${COMPANY_DETAILS.website} | ${COMPANY_DETAILS.email} | ${COMPANY_DETAILS.phone}</p>
      </div>
    </body>
    </html>
  `;
};

export const downloadInvoice = async (request: CardRequest) => {
  const html = generateInvoiceHTML(request);
  const element = document.createElement('div');
  element.innerHTML = html;
  
  const opt = {
    margin: 1,
    filename: `Invoice-${request.cardSerial}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};