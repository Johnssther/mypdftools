import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

const PDFViewer = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="application/pdf" />
      {file && (
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => console.log(`Loaded ${numPages} pages`)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      )}
    </div>
  );
};

export default PDFViewer;
