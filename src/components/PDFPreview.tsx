"use client";

interface PDFPreviewProps {
  pdfUrl: string;
}

export function PDFPreview({ pdfUrl }: PDFPreviewProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Generated PDF Preview</h3>
        <a 
          href={pdfUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-scaler-blue hover:text-blue-700 font-medium"
        >
          Open in new tab
        </a>
      </div>
      <div className="flex-1 w-full bg-gray-100 relative">
        <iframe 
          src={pdfUrl} 
          className="absolute inset-0 w-full h-full border-0"
          title="PDF Preview"
        />
      </div>
    </div>
  );
}
