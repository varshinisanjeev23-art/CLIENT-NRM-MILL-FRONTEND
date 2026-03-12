import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InvoiceModal({ order, isOpen, onClose }) {
  const invoiceRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !order) return null;


  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    try {
      setIsDownloading(true);
      
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice-NRM-${order._id.slice(-8).toUpperCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download PDF. Please try again or use the Print option.');
    } finally {
      setIsDownloading(false);
    }
  };

  const calculateSubtotal = () => {
    return order.totalAmount;
  };

  // Prevent background scrolling when modal is open
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm print:bg-transparent">
      {/* Container to handle vertical centering without clipping tall content */}
      <div className="min-h-full flex items-start justify-center p-4 sm:p-6 md:py-12 px-2 print:p-0">
        
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden transition-all print:shadow-none print:w-full print:max-w-none print:rounded-none">
          
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 print:hidden">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Order Invoice
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Invoice Area to Print */}
          <div ref={invoiceRef} className="p-0 text-gray-800 bg-white" id="invoice-content">

            
            {/* Letterhead Header from Template */}
            <div className="flex w-full relative border-b border-gray-200" style={{ minHeight: '160px' }}>
              {/* Left Block - Beige */}
              <div className="w-[12%] sm:w-[15%] bg-[#FFF4E3]"></div>
              
              {/* Center Logo Block - White */}
              <div className="w-[45%] sm:w-[40%] bg-white flex flex-col items-center justify-center py-6 px-4">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center relative mb-1">
                    <div className="text-[#a68a56] text-1xl font-serif relative top-1">⸙</div>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-serif font-black text-[#6a5e42] tracking-tighter leading-none mb-2">NRM</h1>
                  <div className="w-16 h-[1px] bg-[#d9caad] mb-3"></div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#74694b] tracking-[0.1em] leading-none mb-1.5 whitespace-nowrap">NATARAJAN</h2>
                  <p className="text-[9px] sm:text-[11px] font-bold text-[#74694b] tracking-[0.3em] uppercase whitespace-nowrap">RICE MILL</p>
                </div>
              </div>
              
              {/* Right Contact Block - Beige */}
              <div className="flex-1 bg-[#FFF4E3] flex flex-col justify-center py-6 pl-4 sm:pl-8 overflow-hidden">
                <div className="border-l border-gray-800 pl-4 sm:pl-6 h-full flex flex-col justify-center">
                  <div className="text-[#2c2c2c] text-[11px] sm:text-[13px] font-semibold space-y-2 leading-relaxed font-serif">
                    <div>
                      <span className="inline-block w-16">Ph No.</span>
                      <span className="font-sans">9442352398</span>
                    </div>
                    <div className="flex">
                      <span className="inline-block w-16 whitespace-nowrap">Email-ID:</span>
                      <span className="font-sans truncate pl-1">natarajanricemillnrm@gmail.com</span>
                    </div>
                    <div className="pt-2">
                      <p className="font-sans">Karur road, Ottakadai,</p>
                      <p className="font-sans">Ganapathypalayam,</p>
                      <p className="font-sans">kodumudi - 638151.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Body Content */}
            <div className="px-8 sm:px-12 py-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Bill To:</h3>
                  <p className="text-xl font-black text-gray-900">{order.user?.name || 'Valued Customer'}</p>
                  <p className="text-sm font-bold text-gray-500 mt-1">{order.user?.email}</p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full ring-1 ring-green-100">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Payment Verified
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <h2 className="text-5xl font-black text-gray-100 uppercase tracking-tighter mb-4 select-none">Invoice</h2>
                  <div className="text-sm space-y-1.5 font-bold">
                    <p className="text-gray-400">Order ID: <span className="text-gray-900">#{order._id.slice(-8).toUpperCase()}</span></p>
                    <p className="text-gray-400">Date: <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full mb-12 min-w-[500px]">
                  <thead>
                    <tr className="border-b-2 border-gray-900 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <th className="py-4">Description of Goods</th>
                      <th className="py-4 text-center">Net Weight</th>
                      <th className="py-4 text-right">Unit Price</th>
                      <th className="py-4 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="text-gray-900">
                      <td className="py-8">
                        <div className="font-black text-xl text-gray-900 uppercase tracking-tight">{order.riceType}</div>
                        <div className="text-[10px] sm:text-xs text-[#a68a56] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                           <span className="w-4 h-[1px] bg-[#a68a56]"></span>
                           {order.processType || 'Premium Batch Production'}
                        </div>
                      </td>
                      <td className="py-8 text-center">
                        <span className="inline-block px-3 sm:px-4 py-1 bg-gray-50 rounded-lg font-black text-base sm:text-lg border border-gray-100 shadow-sm">{order.quantityKg} <span className="text-[10px] text-gray-400 ml-1">KG</span></span>
                      </td>
                      <td className="py-8 text-right font-bold text-gray-500">₹{(order.totalAmount / order.quantityKg).toFixed(2)}</td>
                      <td className="py-8 text-right font-black text-xl sm:text-2xl text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start pt-8 border-t-2 border-gray-900 gap-8">
                <div className="max-w-[300px] order-2 md:order-1">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Notes & Terms:</h4>
                  <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                    * This is a computer generated invoice and does not require a physical signature.<br/>
                    * Standard quality checked organic produce.<br/>
                    * Please mention the Order ID for any service queries.
                  </p>
                </div>
                <div className="w-full md:w-72 space-y-4 order-1 md:order-2">
                  <div className="flex justify-between text-gray-400 font-bold text-sm">
                    <span>Gross Subtotal</span>
                    <span className="text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}.00</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-bold text-sm">
                    <span>Shipping & Handling</span>
                    <span className="text-gray-900">FREE</span>
                  </div>
                  <div className="pt-4 border-t border-dashed border-gray-200">
                    <div className="flex justify-between items-center text-2xl sm:text-3xl font-black text-gray-900">
                      <span className="text-[10px] sm:text-sm uppercase tracking-widest text-[#a68a56] mt-2">Grand Total</span>
                      <span>₹{order.totalAmount.toLocaleString('en-IN')}.00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 sm:mt-24 pt-8 text-center border-t border-gray-50">
                <div className="flex flex-wrap justify-center gap-6 sm:gap-12 mb-6 grayscale opacity-20">
                  <div className="flex flex-col items-center">
                    <div className="text-xl">⚙️</div>
                    <span className="text-[8px] font-black uppercase tracking-tighter mt-1 text-gray-900">Certified ISO</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xl">🌿</div>
                    <span className="text-[8px] font-black uppercase tracking-tighter mt-1 text-gray-900">100% Organic</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xl">🚜</div>
                    <span className="text-[8px] font-black uppercase tracking-tighter mt-1 text-gray-900">Direct Farm</span>
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-[#a68a56] font-black uppercase tracking-[0.3em] mb-4">Thank you for your patronage</p>
              </div>
            </div>
          </div>

          {/* Modal Footer (Controls) */}
          <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 print:hidden">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="bg-green-600 text-white px-8 py-2 rounded-lg font-black uppercase tracking-widest text-xs shadow-lg shadow-green-600/30 hover:bg-green-700 transition-all flex items-center gap-2 disabled:bg-green-400"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
