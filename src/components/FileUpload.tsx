import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useData } from '../context/DataContext';

const FileUpload: React.FC = () => {
  const { importData, isLoading } = useData();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };
  
  const handleFile = (file: File) => {
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.type === 'application/vnd.ms-excel' ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls')) {
      setFileName(file.name);
      importData(file);
    } else {
      alert('Lütfen geçerli bir Excel dosyası (.xlsx veya .xls) yükleyin.');
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls"
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center">
        <Upload size={48} className="text-gray-400 mb-4" />
        
        {fileName ? (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Seçilen dosya:</p>
            <p className="font-medium">{fileName}</p>
          </div>
        ) : (
          <p className="text-gray-500 mb-4">
            Excel dosyanızı buraya sürükleyip bırakın veya dosya seçin
          </p>
        )}
        
        <button
          onClick={handleButtonClick}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Yükleniyor...' : 'Dosya Seç'}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;