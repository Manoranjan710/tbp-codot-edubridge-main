import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../ui/button/Button';

interface VisaStatusUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

const VisaStatusUpload: React.FC<VisaStatusUploadProps> = ({ onFileUpload, isProcessing }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* CSV Format Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-400 mb-2">CSV Format Requirements</h3>
        <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
          Your CSV file should match the PRISMS export format with these key columns:
        </p>
        <div className="bg-white dark:bg-gray-800 p-3 rounded border font-mono text-sm space-y-1">
          <div className="text-gray-600 dark:text-gray-400">
            <strong>Column 17:</strong> Passport Number
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            <strong>Column 66:</strong> Visa Granted (Yes/No)
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            <strong>Column 67:</strong> Visa Grant Status
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            <strong>Column 68:</strong> Visa Grant Number
          </div>
        </div>
        <div className="mt-3 space-y-1 text-sm text-blue-800 dark:text-blue-300">
          <p><strong>Passport Number:</strong> Used to match students in the database</p>
          <p><strong>Visa Granted:</strong> Yes/No indicating if visa is granted</p>
          <p><strong>Visa Grant Status:</strong> Status like "In Effect", "Cancelled", "Refused", etc.</p>
          <p><strong>Visa Grant Number:</strong> The official visa grant number</p>
          <p className="font-medium">📋 Upload the complete PRISMS export CSV file - the system will extract the required columns automatically.</p>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          {selectedFile ? (
            <div className="space-y-2">
              <p className="text-green-600 dark:text-green-400 font-medium">
                Selected: {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {isDragActive ? 'Drop the CSV file here' : 'Drop CSV file here, or click to select'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports CSV files up to 10MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* File Actions */}
      {selectedFile && (
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ready to process
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRemoveFile}
              disabled={isProcessing}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <Button
              onClick={handleUpload}
              disabled={isProcessing}
              color="primary"
              size="sm"
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Process File'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Sample CSV Download */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Need a template? Download a sample CSV file
        </p>
        <Button
          onClick={() => {
            // Create a sample CSV with the same structure as PRISMS export
            const sampleHeaders = [
              'Provider Code', 'COE Code', 'COE Status', 'COE Type', 'Principal CoE', 
              'Immigration Post', 'Provider Student ID', 'Courtesy Title', 'First Name', 'Second Name',
              'Family Name', 'Gender', 'Date Of Birth', 'Country Of Birth', 'Nationality',
              'Country Of Passport', 'Passport Number', 'Email Address', 'Mobile', 'Phone',
              // ... (columns 21-65 - simplified for template)
              ...Array(45).fill('...'), 
              'Visa Granted', 'Visa Grant Status', 'Visa Grant Number'
            ];
            
            const sampleData = [
              sampleHeaders.join(','),
              [
                '03732F', 'A54FC897', 'Studying', 'Offshore COE', 'Yes',
                '', '2019-LIOS-OFF-AB-72', 'Ms', 'John', '',
                'DOE', 'MALE', '15/02/1999', 'India', 'India',
                'India', 'R1234567', 'john.doe@email.com', '0449622483', '',
                ...Array(45).fill(''),
                'Yes', 'In Effect', '1069547659435'
              ].join(','),
              [
                '03732F', 'AD7D7790', 'Studying', 'Onshore COE', 'No',
                '', '2019-LI-ON-AB-102', 'Mr', 'Jane', '',
                'SMITH', 'FEMALE', '26/05/1997', 'Nepal', 'Nepal',
                'Nepal', 'S9876543', 'jane.smith@email.com', '0470223286', '',
                ...Array(45).fill(''),
                'No', 'Refused', ''
              ].join(',')
            ];
            
            const sampleCSV = sampleData.join('\n');
            const blob = new Blob([sampleCSV], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'prisms-visa-status-template.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
          color="secondary"
          size="sm"
        >
          Download PRISMS Template
        </Button>
      </div>
    </div>
  );
};

export default VisaStatusUpload;