import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageAPI } from '../services/storage';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false); // Tracks secondary background saves

    // Load initial dataset with simulated API lag
    useEffect(() => {
        const loadData = () => {
            setTimeout(() => {
                try {
                    const data = storageAPI.getApplications();
                    setApplications(data);
                } catch (error) {
                    console.error("Failed to fetch records:", error);
                } finally {
                    setLoading(false);
                }
            }, 800); // 800ms natural API spin-up
        };
        loadData();
    }, []);

    const addApplication = async (appData) => {
        setIsMutating(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                const created = storageAPI.createApplication(appData);
                setApplications(prev => [created, ...prev]);
                setIsMutating(false);
                resolve();
            }, 500);
        });
    };

    const updateApplication = async (id, fields) => {
        setIsMutating(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                const updated = storageAPI.updateApplication(id, fields);
                if (updated) {
                    setApplications(prev => prev.map(app => app.id === id ? updated : app));
                }
                setIsMutating(false);
                resolve();
            }, 400);
        });
    };

    const deleteApplication = async (id) => {
        setIsMutating(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                storageAPI.deleteApplication(id);
                setApplications(prev => prev.filter(app => app.id !== id));
                setIsMutating(false);
                resolve();
            }, 400);
        });
    };

    return (
        <JobContext.Provider value={{
            applications,
            loading,
            isMutating,
            addApplication,
            updateApplication,
            deleteApplication
        }}>
            {children}
        </JobContext.Provider>
    );
};

export const useJobs = () => useContext(JobContext);