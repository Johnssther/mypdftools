import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MergePDFs from './pages/MergePDFs';
import ExtractPage from './pages/ExtractPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar */}
        <nav className="w-full bg-white shadow-lg py-4 mb-8">
          <div className="container mx-auto flex justify-between items-center px-4 lg:px-8">
            <h1 className="text-xl font-bold text-gray-700">PDF Tools</h1>
            <ul className="flex space-x-8 text-gray-600 font-medium">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-500 transition-colors duration-300"
                >
                  Unir PDFs
                </Link>
              </li>
              <li>
                <Link
                  to="/extract"
                  className="hover:text-blue-500 transition-colors duration-300"
                >
                  Extraer Página
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto flex-grow p-6">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <Routes>
              <Route path="/" element={<MergePDFs />} />
              <Route path="/extract" element={<ExtractPage />} />
            </Routes>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-100 py-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2024 PDF Tools - Todos los derechos reservados
          </p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
