import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FaFilePdf, FaTrash, FaUpload, FaEye } from 'react-icons/fa'; // Añadimos FaEye para ver los PDFs

const MergePDFs: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPdfFiles((prevFiles) => [...prevFiles, ...newFiles]); 
    }
  };

  const removeFile = (fileName: string) => {
    setPdfFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const mergePdfs = async () => {
    const mergedPdf = await PDFDocument.create();
    for (const file of pdfFiles) {
      const fileBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const pdfBytes = await mergedPdf.save();
    downloadBlob(pdfBytes, 'merged.pdf', 'application/pdf');
  };

  const downloadBlob = (data: Uint8Array, fileName: string, mimeType: string) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const viewPdf = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  };

  return (
    <div className="max-w-lg mx-auto rounded-lg p-8 text-center">
      <h1 className="text-4xl font-semibold text-gray-800 mb-6">Unir PDFs</h1>

      {/* Input de subida con icono */}
      <div className="mb-6">
        <label htmlFor="pdf-upload" className="block text-sm font-medium text-gray-700 mb-2">
          Sube tus archivos PDF selecciona minimo dos
        </label>
        <label
          htmlFor="pdf-upload"
          className="flex justify-center items-center w-full p-3 bg-blue-500 text-white rounded-md shadow-md cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          <FaUpload className="mr-2" />
          Elegir archivos
        </label>
        <input
          id="pdf-upload"
          type="file"
          multiple
          onChange={handlePdfUpload}
          accept="application/pdf"
          className="hidden"
        />
        <p className="mt-1 text-sm text-gray-500">Puedes seleccionar varios archivos PDF</p>
      </div>

      {/* Mostrar lista de archivos seleccionados */}
      {pdfFiles.length > 0 && (
        <ul className="mb-6 border border-gray-200 rounded-lg divide-y divide-gray-200">
          {pdfFiles.map((file) => (
            <li key={file.name} className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-2">
                <FaFilePdf className="text-red-500" />
                <span className="text-gray-700 text-sm">{file.name}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
                  onClick={() => viewPdf(file)}
                >
                  <FaEye />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                  onClick={() => removeFile(file.name)}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Botón de unir PDFs */}
      <button
        onClick={mergePdfs}
        className={`w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out ${pdfFiles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={pdfFiles.length === 0}
      >
        Unir PDFs
      </button>
    </div>
  );
};

export default MergePDFs;
