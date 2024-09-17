import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FaFilePdf, FaUpload, FaCheckCircle } from 'react-icons/fa';

const ExtractPages: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageRange, setPageRange] = useState<string>(''); // Para el rango de páginas
  const [selectedPages, setSelectedPages] = useState<number[]>([]); // Para la selección manual
  const [pdfDocument, setPdfDocument] = useState<PDFDocument | null>(null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setPdfFile(file);

      const fileBytes = await file.arrayBuffer();
      const loadedPdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
      setPdfDocument(loadedPdf);
      setPageCount(loadedPdf.getPageCount());
    }
  };

  const togglePageSelection = (pageNum: number) => {
    setSelectedPages((prevSelected) =>
      prevSelected.includes(pageNum)
        ? prevSelected.filter((page) => page !== pageNum)
        : [...prevSelected, pageNum]
    );
  };

  // Convertir el rango de texto (ejemplo: "3-5") a un array de páginas [3, 4, 5]
  const parsePageRange = (range: string): number[] => {
    const pages: number[] = [];
    const rangeParts = range.split(','); // Permitir múltiples rangos separados por comas
    rangeParts.forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      } else {
        pages.push(Number(part));
      }
    });
    return pages.filter(page => page > 0 && page <= pageCount); // Asegurarse de que las páginas estén en el rango válido
  };

  const extractSelectedPages = async () => {
    if (!pdfDocument) return;

    // Combinar las páginas seleccionadas manualmente y las del rango
    const rangePages = parsePageRange(pageRange);
    const combinedPages = Array.from(new Set([...selectedPages, ...rangePages])); // Unir ambas listas eliminando duplicados

    if (combinedPages.length === 0) return;

    const extractedPdf = await PDFDocument.create();
    for (const pageNum of combinedPages) {
      const [copiedPage] = await extractedPdf.copyPages(pdfDocument, [pageNum - 1]);
      extractedPdf.addPage(copiedPage);
    }

    const pdfBytes = await extractedPdf.save();
    downloadBlob(pdfBytes, 'extracted-pages.pdf', 'application/pdf');
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

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h1 className="text-4xl font-semibold text-gray-800 mb-6 text-center">Extraer Páginas de PDF</h1>

      {/* Input para subir PDF */}
      <div className="flex justify-center mb-6">
        <div onClick={() => document.getElementById('pdf-upload')?.click()} className="flex flex-col justify-center items-center w-40 h-60 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer hover:bg-blue-100 transition duration-300 ease-in-out">
          <FaUpload className="text-blue-500 text-4xl mb-2" />
          <span className="font-medium text-blue-500">Subir PDF</span>
          <input
            id="pdf-upload"
            type="file"
            onChange={handlePdfUpload}
            accept="application/pdf"
            className="hidden"
          />
        </div>
      </div>

      {/* Mostrar las páginas del PDF para seleccionar manualmente */}
      {pdfFile && (
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {[...Array(pageCount)].map((_, index) => (
            <div
              key={index}
              className={`w-40 h-60 flex flex-col items-center justify-center border rounded-lg shadow-md relative bg-white cursor-pointer ${selectedPages.includes(index + 1) ? 'border-green-500' : 'border-gray-200'
                }`}
              onClick={() => togglePageSelection(index + 1)}
            >
              <FaFilePdf className="text-red-500 text-5xl" />
              <span className="mt-2 text-sm text-gray-700">Página {index + 1}</span>
              {selectedPages.includes(index + 1) && (
                <FaCheckCircle className="text-green-500 text-2xl absolute top-2 right-2" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Mostrar input para el rango de páginas */}
      {pdfFile && (
        <div className="mb-6">
          <label htmlFor="pageRange" className="block text-lg font-medium text-gray-700 mb-2">Ingresar rango de páginas (ej. 3-5, 7):</label>
          <input
            type="text"
            id="pageRange"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Ej. 3-5, 7"
          />
        </div>
      )}

      {/* Botón para extraer páginas */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={extractSelectedPages}
          className={`py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out ${selectedPages.length === 0 && !pageRange ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={selectedPages.length === 0 && !pageRange}
        >
          Extraer páginas seleccionadas
        </button>
      </div>
    </div>
  );
};

export default ExtractPages;
