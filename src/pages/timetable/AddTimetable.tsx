import React from 'react';
import TimetableForm from '../../components/timetable/TimetableForm';

interface AddTimetableProps {
  onBack: () => void;
  onSuccess: () => void;
}

const AddTimetable: React.FC<AddTimetableProps> = ({ onBack, onSuccess }) => {
  return <TimetableForm onBack={onBack} onSuccess={onSuccess} />;
};

export default AddTimetable;
