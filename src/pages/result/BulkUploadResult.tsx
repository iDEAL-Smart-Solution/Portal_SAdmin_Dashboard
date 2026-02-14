import React, { useEffect, useState } from 'react';
import { useResultStore, CreateResultRequest } from '../../stores/result-store';
import { useClassStore } from '../../stores/class-store';

interface BulkUploadResultProps {
  onBack: () => void;
  onSuccess: () => void;
}

const BulkUploadResult: React.FC<BulkUploadResultProps> = ({ onBack, onSuccess }) => {
  const {
    studentsForResult,
    subjects,
    currentSession,
    fetchStudentsByClass,
    fetchStudentsBySubject,
    fetchSubjects,
    fetchCurrentSession,
    createResult,
    clearStudents,
    isLoading,
    error,
  } = useResultStore();

  const { classList, fetchClassList } = useClassStore();

  const [searchMode, setSearchMode] = useState<'class' | 'subject'>('class');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  // Bulk scores state
  const [bulkScores, setBulkScores] = useState<Record<string, {
    firstCA: number;
    secondCA: number;
    thirdCA: number;
    exam: number;
  }>>({});

  useEffect(() => {
    fetchSubjects();
    fetchClassList();
    fetchCurrentSession();
    return () => clearStudents();
  }, [fetchSubjects, fetchClassList, fetchCurrentSession, clearStudents]);

  // Initialize bulk scores when students load
  useEffect(() => {
    if (studentsForResult.length > 0) {
      const initialScores: Record<string, { firstCA: number; secondCA: number; thirdCA: number; exam: number }> = {};
      studentsForResult.forEach(student => {
        if (!bulkScores[student.id]) {
          initialScores[student.id] = { firstCA: 0, secondCA: 0, thirdCA: 0, exam: 0 };
        }
      });
      setBulkScores(prev => ({ ...prev, ...initialScores }));
    }
  }, [studentsForResult]);

  const handleLoadStudents = () => {
    if (searchMode === 'class' && selectedClass) {
      const classObj = classList.find(c => c.id === selectedClass);
      if (classObj) {
        fetchStudentsByClass(classObj.name);
      }
    } else if (searchMode === 'subject' && selectedSubject) {
      fetchStudentsBySubject(selectedSubject);
    }
  };

  const updateScore = (studentId: string, field: 'firstCA' | 'secondCA' | 'thirdCA' | 'exam', value: number) => {
    setBulkScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      }
    }));
  };

  const calculateTotal = (scores: { firstCA: number; secondCA: number; thirdCA: number; exam: number }) => {
    return scores.firstCA + scores.secondCA + scores.thirdCA + scores.exam;
  };

  const getGrade = (score: number) => {
    if (score >= 70) return 'A';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    if (score >= 45) return 'D';
    if (score >= 40) return 'E';
    return 'F';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);

    if (!selectedSubject || !currentSession) {
      setFormError('Please select a subject');
      return;
    }

    const subject = subjects.find(s => s.id === selectedSubject);
    if (!subject) {
      setFormError('Invalid subject selection');
      return;
    }

    // Filter students with scores > 0
    const studentsToUpload = studentsForResult.filter(student => {
      const scores = bulkScores[student.id];
      return scores && (scores.firstCA > 0 || scores.secondCA > 0 || scores.thirdCA > 0 || scores.exam > 0);
    });

    if (studentsToUpload.length === 0) {
      setFormError('No scores to upload. Please enter scores for at least one student.');
      return;
    }

    setUploadProgress({ current: 0, total: studentsToUpload.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < studentsToUpload.length; i++) {
      const student = studentsToUpload[i];
      const scores = bulkScores[student.id];

      const data: CreateResultRequest = {
        studentId: student.id,
        studentUin: student.uin,
        subjectCode: subject.code,
        first_CA_Score: scores.firstCA,
        second_CA_Score: scores.secondCA,
        third_CA_Score: scores.thirdCA,
        exam_Score: scores.exam,
        term: selectedTerm,
        session: currentSession.name,
      };

      try {
        await createResult(data);
        successCount++;
      } catch {
        failCount++;
      }

      setUploadProgress({ current: i + 1, total: studentsToUpload.length });
    }

    setUploadProgress(null);

    if (successCount > 0) {
      setSuccess(`Successfully uploaded ${successCount} results${failCount > 0 ? `, ${failCount} failed` : ''}`);
      setBulkScores({});
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      setFormError(`Failed to upload all results`);
    }
  };

  const clearAllScores = () => {
    const clearedScores: Record<string, { firstCA: number; secondCA: number; thirdCA: number; exam: number }> = {};
    studentsForResult.forEach(student => {
      clearedScores[student.id] = { firstCA: 0, secondCA: 0, thirdCA: 0, exam: 0 };
    });
    setBulkScores(clearedScores);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Results
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Results</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter results for multiple students at once
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {(error || formError) && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-sm text-red-700">{error || formError}</p>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-sm text-blue-700">
              Uploading... {uploadProgress.current} of {uploadProgress.total}
            </p>
          </div>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selection Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Load Students</h2>
          
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => { setSearchMode('class'); clearStudents(); setBulkScores({}); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                searchMode === 'class'
                  ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              By Class
            </button>
            <button
              type="button"
              onClick={() => { setSearchMode('subject'); clearStudents(); setBulkScores({}); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                searchMode === 'subject'
                  ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              By Subject
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {searchMode === 'class' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Choose a class</option>
                  {classList.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.code} - {subject.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term *</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(parseInt(e.target.value))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value={1}>First Term</option>
                <option value={2}>Second Term</option>
                <option value={3}>Third Term</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                {currentSession?.name || 'Loading...'}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleLoadStudents}
              disabled={isLoading || (searchMode === 'class' ? !selectedClass : !selectedSubject)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load Students'}
            </button>
          </div>
        </div>

        {/* Bulk Score Entry Table */}
        {studentsForResult.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Enter Scores</h2>
                <p className="text-sm text-gray-500">{studentsForResult.length} students loaded</p>
              </div>
              <button
                type="button"
                onClick={clearAllScores}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear All Scores
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      1st CA (10)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      2nd CA (10)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      3rd CA (10)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam (70)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentsForResult.map(student => {
                    const scores = bulkScores[student.id] || { firstCA: 0, secondCA: 0, thirdCA: 0, exam: 0 };
                    const total = calculateTotal(scores);
                    const grade = getGrade(total);

                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-mono text-sm text-gray-900">{student.uin}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{student.fullName}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={scores.firstCA}
                            onChange={(e) => updateScore(student.id, 'firstCA', Math.min(10, Number(e.target.value)))}
                            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={scores.secondCA}
                            onChange={(e) => updateScore(student.id, 'secondCA', Math.min(10, Number(e.target.value)))}
                            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={scores.thirdCA}
                            onChange={(e) => updateScore(student.id, 'thirdCA', Math.min(10, Number(e.target.value)))}
                            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max="70"
                            value={scores.exam}
                            onChange={(e) => updateScore(student.id, 'exam', Math.min(70, Number(e.target.value)))}
                            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <span className="text-sm font-semibold text-gray-900">{total}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            grade === 'A' ? 'bg-green-100 text-green-800' :
                            grade === 'B' ? 'bg-blue-100 text-blue-800' :
                            grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                            grade === 'D' ? 'bg-orange-100 text-orange-800' :
                            grade === 'E' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        {studentsForResult.length > 0 && (
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedSubject || uploadProgress !== null}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Upload All Results'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default BulkUploadResult;
