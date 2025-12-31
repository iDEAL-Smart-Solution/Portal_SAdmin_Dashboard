import React, { useState } from 'react';
import ResourceTypeList from '../../components/resource-type/ResourceTypeList';
import AddResourceType from './AddResourceType';
import UpdateResourceType from './UpdateResourceType';

type ResourceTypeView = 'list' | 'add' | 'edit';

const ResourceTypeManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<ResourceTypeView>('list');
  const [selectedResourceTypeId, setSelectedResourceTypeId] = useState<string>('');

  const handleAdd = () => {
    setCurrentView('add');
  };

  const handleEdit = (id: string) => {
    setSelectedResourceTypeId(id);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedResourceTypeId('');
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedResourceTypeId('');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return <ResourceTypeList onAdd={handleAdd} onEdit={handleEdit} />;
      case 'add':
        return <AddResourceType onBack={handleBackToList} onSuccess={handleSuccess} />;
      case 'edit':
        return <UpdateResourceType resourceTypeId={selectedResourceTypeId} onBack={handleBackToList} onSuccess={handleSuccess} />;
      default:
        return <ResourceTypeList onAdd={handleAdd} onEdit={handleEdit} />;
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderCurrentView()}</div>;
};

export default ResourceTypeManagement;
