'use client';

export default function PdfViewer({ url }) {
  return (
    <iframe
      src={`${url}#toolbar=0`}
      className="w-full h-screen"
      title="PDF Viewer"
    />
  );
}