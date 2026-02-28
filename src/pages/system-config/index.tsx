import { useEffect, useState } from 'react';
import { useSystemConfigStore } from '../../stores/system-config-store';
import AdminPrincipalSignature from '../../components/signature/AdminPrincipalSignature';

export default function SystemConfigManagement() {
  const { configurations, isLoading, error, fetchConfigurations, deleteConfiguration } = useSystemConfigStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleValues, setVisibleValues] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchConfigurations();
  }, [fetchConfigurations]);

  const filteredConfigs = configurations.filter((config) =>
    config.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    config.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
    config.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      try {
        await deleteConfiguration(id);
      } catch (err) {
        console.error('Failed to delete configuration');
      }
    }
  };

  const toggleValueVisibility = (id: string) => {
    setVisibleValues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">System Configurations</h1>
        <p className="text-text-secondary">Manage school system settings and integrations</p>
      </div>

      <AdminPrincipalSignature />
      <div className="flex justify-end">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Configuration
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <svg className="absolute left-3 top-3 w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search configurations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Configurations Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-text-primary">
            Configurations ({filteredConfigs.length})
          </h3>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredConfigs.length === 0 ? (
            <div className="text-center py-8 text-text-tertiary">
              No configurations found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Key</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredConfigs.map((config) => (
                    <tr key={config.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-4 whitespace-nowrap font-medium text-text-primary">
                        <code className="px-2 py-1 bg-neutral-100 rounded text-sm">{config.key}</code>
                      </td>
                      <td className="px-4 py-4 text-text-secondary">
                        <div className="flex items-center gap-2 max-w-md">
                          <div className="flex-1 truncate font-mono text-sm" title={visibleValues.has(config.id) ? config.value : undefined}>
                            {visibleValues.has(config.id) 
                              ? config.value 
                              : '••••••••••••••••'}
                          </div>
                          <button
                            onClick={() => toggleValueVisibility(config.id)}
                            className="p-1 text-text-tertiary hover:text-text-primary transition-colors flex-shrink-0"
                            title={visibleValues.has(config.id) ? 'Hide value' : 'Show value'}
                          >
                            {visibleValues.has(config.id) ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-text-secondary">
                        {config.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingConfig(config);
                            setIsCreateModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(config.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <SystemConfigModal
          isOpen={isCreateModalOpen}
          editingConfig={editingConfig}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingConfig(null);
          }}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            setEditingConfig(null);
            fetchConfigurations();
          }}
        />
      )}
    </div>
  );
}

function SystemConfigModal({ isOpen, editingConfig, onClose, onSuccess }: any) {
  const { createConfiguration, updateConfiguration, isLoading } = useSystemConfigStore();
  const [formData, setFormData] = useState({
    key: editingConfig?.key || '',
    value: editingConfig?.value || '',
    description: editingConfig?.description || '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingConfig) {
        await updateConfiguration({
          id: editingConfig.id,
          key: formData.key,
          value: formData.value,
          description: formData.description,
        });
      } else {
        await createConfiguration({
          key: formData.key,
          value: formData.value,
          description: formData.description,
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save configuration');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-text-primary">
            {editingConfig ? 'Edit Configuration' : 'Create Configuration'}
          </h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Key *</label>
            <input
              type="text"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="e.g., PaystackKey, SchoolLogo"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              required
              disabled={!!editingConfig}
            />
            {editingConfig && (
              <p className="mt-1 text-xs text-text-tertiary">Key cannot be changed after creation</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Value *</label>
            <textarea
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="Enter configuration value"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this configuration is used for"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg text-text-primary hover:bg-neutral-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : editingConfig ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
