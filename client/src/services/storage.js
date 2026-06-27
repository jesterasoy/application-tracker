// src/services/storage.js

const STORAGE_KEY = 'job_tracker_applications';


export const storageAPI = {
  // Read all records
  getApplications: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY);
      return STORAGE_KEY;
    }
    return JSON.parse(data);
  },

  // Save/Overwrite entire dataset
  saveApplications: (applications) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
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