import React, { useState } from 'react';
import Layout from './components/ui/Layout';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import CalendarView from './pages/CalendarView';
import { useJobs } from './context/JobContext';
import ApplicationFormModal from './components/ui/ApplicationFormModal';
import ConfirmationModal from './components/ui/ConfirmationModal';
import ApplicationDetailsModal from './components/ui/ApplicationDetailsModal';
// Import your new Toast component
import Toast from './components/ui/Toast';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  const [view, setView] = useState('dashboard');
  const { loading, isMutating, addApplication, updateApplication, deleteApplication } = useJobs();

  // Modal Control System States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeApplication, setActiveApplication] = useState(null);
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  // Toast System States
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Form Submission Logic Wrapper
  const handleFormSubmit = (data) => {
    if (activeApplication) {
      updateApplication(activeApplication.id, data);
      showToast(`Updated application for ${data.companyName}!`);
    } else {
      addApplication(data);
      showToast(`Successfully added ${data.companyName}!`);
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteApplication(targetDeleteId);
    setIsDeleteOpen(false);
    showToast('Application record permanently removed.', 'error');
    if (activeApplication?.id === targetDeleteId) {
      setIsDetailsOpen(false);
    }
  };

  const handleOpenEdit = (app) => {
    setActiveApplication(app);
    setIsFormOpen(true);
  };

  const handleOpenAdd = () => {
    setActiveApplication(null);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id) => {
    setTargetDeleteId(id);
    setIsDeleteOpen(true);
  };

  if (loading) {
    return <LoadingSpinner fullPage={true} />;
  }

  return (
    <div className='relative min-h-screen'>
      {isMutating && <LoadingSpinner />}
      <Layout currentView={view} setView={setView}>
        {view === 'dashboard' && (
          <Dashboard
            setView={setView}
            onOpenAddModal={handleOpenAdd}
          />
        )}

        {view === 'applications' && (
          <Applications
            onOpenAddModal={handleOpenAdd}
            onOpenViewModal={(app) => {
              setActiveApplication(app);
              setIsDetailsOpen(true);
            }}
            onOpenEditModal={handleOpenEdit}
            onOpenDeleteModal={handleOpenDelete}
          />
        )}

        {view === 'calendar' && (
          <CalendarView
            onOpenViewModal={(app) => {
              setActiveApplication(app);
              setIsDetailsOpen(true);
            }}
          />
        )}

        <ApplicationFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          editingApplication={activeApplication}
        />

        <ConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
        />

        <ApplicationDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          application={activeApplication}
        />

        {/* Render the Toast if state is active */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </Layout>
    </div>
  );
}

export default App;