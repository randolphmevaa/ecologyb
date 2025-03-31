import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MultiFileUploadProps {
  primaryColor?: string;
  accept?: string;
}

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({ 
  primaryColor = 'blue', 
  accept = "application/pdf,image/jpeg,image/png" 
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Convert bytes to readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept={accept}
      />
      
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-${primaryColor}-500 transition-colors cursor-pointer bg-gray-50`}
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <DocumentArrowUpIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          Glissez et déposez vos fichiers ici, ou
          <span className={`text-${primaryColor}-600 font-medium ml-1`}>parcourir vos fichiers</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PDF, JPEG, PNG jusqu&apos;à 10MB par fichier
        </p>
        {files.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
          </p>
        )}
      </div>
      
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Fichiers sélectionnés</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className={`flex items-center justify-between p-3 bg-${primaryColor}-50 rounded-lg border border-${primaryColor}-100`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <DocumentArrowUpIcon className={`h-5 w-5 text-${primaryColor}-500 flex-shrink-0`} />
                  <div className="truncate">
                    <p className="text-sm font-medium text-gray-700 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className={`p-1 text-${primaryColor}-700 hover:bg-${primaryColor}-100 rounded-full transition-colors flex-shrink-0`}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiFileUpload;