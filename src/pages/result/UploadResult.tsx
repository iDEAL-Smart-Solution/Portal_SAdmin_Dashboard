import React, { useEffect, useState } from 'react';
import { useResultStore, CreateResultRequest } from '../../stores/result-store';
import { useClassStore } from '../../stores/class-store';

interface UploadResultProps {
  onBack: () => void;
  onSuccess: () => void;
}

const UploadResult: React.FC<UploadResultProps> = ({ onBack, onSuccess }) => {
  const {
    studentsForResult,
    subjects,
    currentSession,
    fetchStudentsByClass,
    fetchStudentsBySubject,
    fetchStudentList,
    fetchSubjects,
    fetchCurrentSession,
    createResult,
    clearStudents,
    isLoading,
    error,
  } = useResultStore();

  const { classList, fetchClassList } = useClassStore();

  const [searchMode, setSearchMode] = useState<'class' | 'subject' | 'search'>('class');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [scores, setScores] = useState({
    firstCA: 0,
    secondCA: 0,
    thirdCA: 0,
    exam: 0,
  });

  useEffect(() => {
    fetchSubjects();
    fetchClassList();
    fetchCurrentSession();
    return () => clearStudents();
  }, [fetchSubjects, fetchClassList, fetchCurrentSession, clearStudents]);

  const handleLoadStudents = () => {
    if (searchMode === 'class' && selectedClass) {
      const classObj = classList.find(c => c.id === selectedClass);
      if (classObj) {
        fetchStudentsByClass(classObj.name);
      }
    } else if (searchMode === 'subject' && selectedSubject) {
      fetchStudentsBySubject(selectedSubject);
    } else if (searchMode === 'search' && searchTerm) {
      fetchStudentList(searchTerm);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);

    if (!selectedStudent || !selectedSubject || !currentSession) {
      setFormError('Please select a student and subject');
      return;
    }

    const student = studentsForResult.find(s => s.id === selectedStudent);
    const subject = subjects.find(s => s.id === selectedSubject);

    if (!student || !subject) {
      setFormError('Invalid student or subject selection');
      return;
    }

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
      setSuccess('Result uploaded successfully!');
      setScores({ firstCA: 0, secondCA: 0, thirdCA: 0, exam: 0 });
      setSelectedStudent(null);
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Failed to upload result');
    }
  };

  const totalScore = scores.firstCA + scores.secondCA + scores.thirdCA + scores.exam;

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
        <h1 className="text-2xl font-bold text-gray-900">Upload Individual Result</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter result for a single student
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Mode Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Find Student</h2>
          
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => { setSearchMode('class'); clearStudents(); }}
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
              onClick={() => { setSearchMode('subject'); clearStudents(); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                searchMode === 'subject'
                  ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              By Subject
            </button>
            <button
              type="button"
              onClick={() => { setSearchMode('search'); clearStudents(); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                searchMode === 'search'
                  ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              Search
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {searchMode === 'subject' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Choose a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.code} - {subject.name}</option>
                  ))}
                </select>
              </div>
            )}

            {searchMode === 'search' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Student</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter name or ID..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleLoadStudents}
                disabled={isLoading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Load Students'}
              </button>
            </div>
          </div>

          {/* Students List */}
          {studentsForResult.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {studentsForResult.map(student => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    className={`px-4 py-3 cursor-pointer border-b last:border-b-0 ${
                      selectedStudent === student.id
                        ? 'bg-primary-50 border-l-4 border-l-primary-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{student.fullName}</p>
                        <p className="text-sm text-gray-500 font-mono">{student.uin}</p>
                      </div>
                      {student.className && (
                        <span className="text-sm text-gray-500">{student.className}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Subject & Term Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Result Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {/* Score Entry */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Scores</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">1st CA (Max 10)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={scores.firstCA}
                onChange={(e) => setScores({ ...scores, firstCA: Math.min(10, Number(e.target.value)) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">2nd CA (Max 10)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={scores.secondCA}
                onChange={(e) => setScores({ ...scores, secondCA: Math.min(10, Number(e.target.value)) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">3rd CA (Max 10)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={scores.thirdCA}
                onChange={(e) => setScores({ ...scores, thirdCA: Math.min(10, Number(e.target.value)) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam (Max 70)</label>
              <input
                type="number"
                min="0"
                max="70"
                value={scores.exam}
                onChange={(e) => setScores({ ...scores, exam: Math.min(70, Number(e.target.value)) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-primary-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Score</span>
              <span className="text-2xl font-bold text-primary-600">{totalScore}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
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
            disabled={isLoading || !selectedStudent || !selectedSubject}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Uploading...' : 'Upload Result'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadResult;
