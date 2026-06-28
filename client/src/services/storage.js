// src/services/storage.js

const STORAGE_KEY = 'job_tracker_applications';


export const storageAPI = {
  // Read all records
  getApplications() {
    try {
      const data = localStorage.getItem('applications');
      if (!data) {
        // Correctly pass BOTH the key and the stringified empty array fallback
        localStorage.setItem('applications', JSON.stringify([]));
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      console.error("Storage error:", error);
      return [];
    }
  },
  saveApplications(apps) {
    localStorage.setItem('applications', JSON.stringify(apps));
  },
  // Add a single new record
  createApplication: (newApp) => {
    const apps = storageAPI.getApplications();
    const preparedApp = {
      ...newApp,
      id: `app-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      checklist: newApp.checklist || []
    };
    apps.unshift(preparedApp); // Push new item to the top
    storageAPI.saveApplications(apps);
    return preparedApp;
  },

  // Update an existing record
  updateApplication: (id, updatedFields) => {
    const apps = storageAPI.getApplications();
    const index = apps.findIndex(app => app.id === id);
    if (index !== -1) {
      apps[index] = {
        ...apps[index],
        ...updatedFields,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      storageAPI.saveApplications(apps);
      return apps[index];
    }
    return null;
  },

  // Delete a record
  deleteApplication: (id) => {
    const apps = storageAPI.getApplications();
    const filtered = apps.filter(app => app.id !== id);
    storageAPI.saveApplications(filtered);
    return true;
  }
};