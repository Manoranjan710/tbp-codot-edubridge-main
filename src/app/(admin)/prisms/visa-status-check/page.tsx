'use client';

import React, { useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import VisaStatusUpload from '@/components/prisms/VisaStatusUpload';
import VisaStatusResults from '@/components/prisms/VisaStatusResults';

interface UpdatedStudent {
  id: number;
  passportNumber: string;
  firstName: string | null;
  familyName: string | null;
  previousVisaGranted: string | null;
  previousVisaStatus: string | null;
  previousVisaNumber: string | null;
  newVisaGranted: string;
  newVisaStatus: string;
  newVisaNumber: string;
  agentName: string | null;
  courseCode: string | null;
  courseName: string | null;
}

interface ProcessResult {
  success: boolean;
  message: string;
  updatedStudents: UpdatedStudent[];
  totalProcessed: number;
  totalUpdated: number;
  errors: Array<{
    row: number;
    passport: string;
    error: string;
  }>;
}

const VisaStatusCheckPage = () => {
  const [results, setResults] = useState<ProcessResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/prisms/visa-status-update', {
        method: 'POST',
        body: formData,
      });

      const result: ProcessResult = await response.json();
      
      if (result.success) {
        setResults(result);
      } else {
        alert(result.message || 'Failed to process visa status updates');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <>
      <PageBreadCrumb title="Visa Status Check" />
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PRISMS Visa Status Update</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Upload a CSV file to update student visa status information based on passport numbers
          </p>
        </div>
      </div>
      
      {!results ? (
        <ComponentCard
          title="Upload Visa Status CSV"
          desc="Upload a CSV file containing passport numbers and visa status updates"
        >
          <VisaStatusUpload 
            onFileUpload={handleFileUpload} 
            isProcessing={isProcessing}
          />
        </ComponentCard>
      ) : (
        <div className="space-y-6">
          <ComponentCard
            title="Processing Results"
            desc={`Processed ${results.totalProcessed} records, updated ${results.totalUpdated} students`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-400">Total Processed</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{results.totalProcessed}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 dark:text-green-400">Successfully Updated</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-300">{results.totalUpdated}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-red-900 dark:text-red-400">Errors</h3>
                <p className="text-2xl font-bold text-red-600 dark:text-red-300">{results.errors.length}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Upload Another File
              </button>
            </div>
          </ComponentCard>

          {results.updatedStudents.length > 0 && (
            <ComponentCard
              title="Updated Students"
              desc="Students whose visa information was successfully updated"
            >
              <VisaStatusResults students={results.updatedStudents} />
            </ComponentCard>
          )}

          {results.errors.length > 0 && (
            <ComponentCard
              title="Processing Errors"
              desc="Records that could not be processed"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Row
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Passport Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Error
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {results.errors.map((error, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {error.row}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {error.passport}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                          {error.error}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ComponentCard>
          )}
        </div>
      )}
    </>
  );
};

export default VisaStatusCheckPage;