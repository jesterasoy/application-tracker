// src/services/storage.js

const STORAGE_KEY = 'job_tracker_applications';

// Helper mock data to populate empty state on first load
const initialMockData = [
  {
    id: "app-1",
    companyName: "Stark Industries",
    position: "Senior React Engineer",
    applicationDate: "2026-06-20",
    status: "Technical Interview", // Wishlist, Applied, HR Screening, Assessment, Technical Interview, Manager Interview, Final Interview, Offer Received, Accepted, Rejected, Withdrawn
    jobType: "Full-time", // Full-time, Part-time, Contract, Internship
    workSetup: "Remote", // Remote, Hybrid, Onsite
    recruiterName: "Pepper Potts",
    recruiterEmail: "pepper@stark.com",
    recruiterContactNumber: "+1-555-0199",
    salaryRange: "$140,000 - $170,000",
    jobLocation: "Los Angeles, CA",
    applicationSource: "LinkedIn",
    nextInterviewDate: "2026-06-30T14:00:00",
    lastUpdated: "2026-06-25",
    priority: "High", // High, Medium, Low
    jobDescription: "Building next-generation UI layers for arc reactor diagnostics dashboards.",
    responsibilities: "Maintain clean state architectural layers, optimize rendering bottlenecks.",
    qualifications: "5+ years of production level React experience.",
    requiredSkills: "React, Tailwind CSS, TypeScript, Zustand",
    companyWebsite: "https://starkindustries.com",
    jobPostingUrl: "https://linkedin.com/jobs/stark-123",
    resumeVersion: "React_Lead_2026.pdf",
    coverLetterVersion: "Stark_Custom_Letter.pdf",
    notes: "Followed up after initial phone screen. They are highly interested in my layout system designs.",
    interviewNotes: "Tech interview will focus heavily on React 19 features and rendering performance.",
    followUpDate: "2026-07-02",
    checklist: [
      { id: "todo-1", task: "Review React fiber architecture documentation", completed: true },
      { id: "todo-2", task: "Prepare system design case study", completed: false }
    ]
  },
  {
    id: "app-2",
    companyName: "Wayne Enterprises",
    position: "Frontend Developer",
    applicationDate: "2026-06-24",
    status: "Applied",
    jobType: "Contract",
    workSetup: "Hybrid",
    recruiterName: "Lucius Fox",
    recruiterEmail: "l.fox@waynecorp.com",
    recruiterContactNumber: "",
    salaryRange: "$120,000 - $140,000",
    jobLocation: "Gotham City",
    applicationSource: "Company Website",
    nextInterviewDate: null,
    lastUpdated: "2026-06-24",
    priority: "Medium",
    jobDescription: "Developing custom responsive tactical telemetry web tracking modules.",
    responsibilities: "Build clean web interfaces mapping geo-spatial components.",
    qualifications: "Solid understanding of mapping libraries and performance optimization.",
    requiredSkills: "JavaScript, Mapbox, Tailwind CSS",
    companyWebsite: "https://wayneenterprises.com",
    jobPostingUrl: "",
    resumeVersion: "General_Frontend_2026.pdf",
    coverLetterVersion: "",
    notes: "Applied via internal portal referral.",
    interviewNotes: "",
    followUpDate: "2026-07-01",
    checklist: []
  }
];

export const storageAPI = {
  // Read all records
  getApplications: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockData));
      return initialMockData;
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