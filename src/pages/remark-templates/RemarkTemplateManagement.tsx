import React, { useEffect, useState } from 'react';
import { useRemarkTemplateStore, type CreateRemarkTemplateRequest, type UpdateRemarkTemplateRequest, type RemarkTemplateResponse } from '../../stores/remark-template-store';

const RemarkTemplateManagement: React.FC = () => {
  const {
    templates,
    isLoading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    clearError,
  } = useRemarkTemplateStore();

  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<RemarkTemplateResponse | null>(null);
  const [formData, setFormData] = useState({ minPercentage: 0, maxPercentage: 100, remarkText: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (editingTemplate) {
        const updateData: UpdateRemarkTemplateRequest = {
          id: editingTemplate.id,
          ...formData,
        };
        await updateTemplate(updateData);
        setSuccessMessage('Remark template updated successfully!');
      } else {
        const createData: CreateRemarkTemplateRequest = { ...formData };
        await createTemplate(createData);
        setSuccessMessage('Remark template created successfully!');
      }
      resetForm();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      // Error is handled by store
    }
  };

  const handleEdit = (template: RemarkTemplateResponse) => {
    setEditingTemplate(template);
    setFormData({
      minPercentage: template.minPercentage,
      maxPercentage: template.maxPercentage,
      remarkText: template.remarkText,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id);
      setDeleteConfirm(null);
      setSuccessMessage('Remark template deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      // Error is handled by store
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTemplate(null);
    setFormData({ minPercentage: 0, maxPercentage: 100, remarkText: '' });
  };

  // Suggested default templates
  const defaultTemplates = [
    { minPercentage: 0, maxPercentage: 20, remarkText: 'Very poor performance. Requires serious attention and extra coaching.' },
    { minPercentage: 21, maxPercentage: 40, remarkText: 'Below average performance. Needs to put in more effort.' },
    { minPercentage: 41, maxPercentage: 60, remarkText: 'Average performance. Can do much better with consistent effort.' },
    { minPercentage: 61, maxPercentage: 80, remarkText: 'Good performance. Keep up the good work and strive for excellence.' },
    { minPercentage: 81, maxPercentage: 100, remarkText: 'Excellent performance! Outstanding academic achievement. Keep it up!' },
  ];

  const handleLoadDefaults = async () => {
    if (templates.length > 0) {
      const confirm = window.confirm('This will add default templates. Existing templates with overlapping ranges may cause errors. Continue?');
      if (!confirm) return;
    }

    for (const t of defaultTemplates) {
      try {
        await createTemplate(t);
      } catch {
        // Skip if overlap error
      }
    }
    setSuccessMessage('Default templates loaded!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Principal Remark Templates</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure automatic principal remarks based on student percentage ranges.
            These remarks appear on report cards.
          </p>
        </div>
        <div className="flex flex-row gap-2 mt-3 sm:mt-0">
          {templates.length === 0 && (
            <button
              onClick={handleLoadDefaults}
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Load Defaults
            </button>
          )}
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Add Template
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
          <button onClick={clearError} className="ml-2 text-red-500 underline text-xs">Dismiss</button>
        </div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingTemplate ? 'Edit Remark Template' : 'Create Remark Template'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Percentage
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.minPercentage}
                  onChange={e => setFormData({ ...formData, minPercentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Percentage
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.maxPercentage}
                  onChange={e => setFormData({ ...formData, maxPercentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Principal's Remark
              </label>
              <textarea
                value={formData.remarkText}
                onChange={e => setFormData({ ...formData, remarkText: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter the principal's remark for students within this percentage range..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Saving...' : editingTemplate ? 'Update Template' : 'Create Template'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Templates List */}
      {isLoading && templates.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Remark Templates</h3>
          <p className="text-gray-500 text-sm mb-4">
            Create remark templates so that principal remarks are automatically generated on student report cards.
          </p>
          <button
            onClick={handleLoadDefaults}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Load Default Templates
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal's Remark</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {templates.map(template => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {template.minPercentage}% — {template.maxPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 max-w-lg">{template.remarkText}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {deleteConfirm === template.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-red-600">Confirm?</span>
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(template)}
                          className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(template.id)}
                          className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">How It Works</h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Each template defines a percentage range and a corresponding principal remark.</li>
          <li>When a student's report card is generated, their overall percentage is matched to a template.</li>
          <li>The matching remark is automatically printed on the report card — no manual input needed.</li>
          <li>Ranges should not overlap. Cover 0%–100% for best results.</li>
        </ul>
      </div>
    </div>
  );
};

export default RemarkTemplateManagement;
