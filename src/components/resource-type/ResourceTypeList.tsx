import React, { useEffect, useState } from 'react';
import { useResourceTypeStore } from '../../stores/resource-type-store';
import { Trash2, Edit, Plus } from 'lucide-react';

interface ResourceTypeListProps {
  onAdd: () => void;
  onEdit: (id: string) => void;
}

const ResourceTypeList: React.FC<ResourceTypeListProps> = ({ onAdd, onEdit }) => {
  const { resourceTypes, fetchResourceTypes, deleteResourceType, isLoading, error } = useResourceTypeStore();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchResourceTypes();
  }, [fetchResourceTypes]);

  const handleDelete = async (id: string) => {
    try {
      await deleteResourceType(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete resource type:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Resource Types</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage resource types that staff can use when uploading materials
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={onAdd}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resource Type
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {resourceTypes.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-8 text-center text-sm text-gray-500">
                        No resource types found. Create one to get started.
                      </td>
                    </tr>
                  ) : (
                    resourceTypes.map((resourceType) => (
                      <tr key={resourceType.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {resourceType.name}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {resourceType.description}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => onEdit(resourceType.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Edit className="h-4 w-4 inline" />
                          </button>
                          {deleteConfirm === resourceType.id ? (
                            <div className="inline-flex items-center gap-2">
                              <span className="text-xs text-gray-500">Confirm?</span>
                              <button
                                onClick={() => handleDelete(resourceType.id)}
                                className="text-red-600 hover:text-red-900 text-xs"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="text-gray-600 hover:text-gray-900 text-xs"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(resourceType.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4 inline" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceTypeList;
