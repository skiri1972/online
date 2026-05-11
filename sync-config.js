// Data synchronization configuration for UčimZnam
// This file handles switching between localStorage and API modes

const SyncConfig = {
    // Configuration
    USE_API: true, // Enable Firebase synchronization
    API_BASE_URL: 'https://ucimznam-sync-default-rtdb.firebaseio.com', // Firebase Realtime Database URL
    
    // Current mode detection
    isApiMode() {
        return this.USE_API && window.location.hostname !== 'localhost';
    },
    
    // Get data source method
    getDataSource() {
        return this.isApiMode() ? 'api' : 'localStorage';
    },
    
    // Initialize data loading
    async initializeData() {
        if (this.isApiMode()) {
            console.log('Loading data from API...');
            return this.loadFromAPI();
        } else {
            console.log('Loading data from localStorage...');
            return this.loadFromLocalStorage();
        }
    },
    
    // Load from API (Firebase)
    async loadFromAPI() {
        try {
            // Load all data from Firebase
            const response = await fetch(`${this.API_BASE_URL}/data.json`);
            const data = await response.json();
            
            // Load user progress if logged in
            let progress = {};
            const currentUser = JSON.parse(localStorage.getItem('current_user'));
            if (currentUser && data.progress && data.progress[currentUser.email]) {
                progress = data.progress[currentUser.email];
            }
            
            return {
                chapters: data.chapters || [],
                progress: progress,
                pendingStudents: data.pendingStudents || [],
                approvedStudents: data.approvedStudents || []
            };
        } catch (error) {
            console.error('Failed to load from Firebase, falling back to localStorage:', error);
            return this.loadFromLocalStorage();
        }
    },
    
    // Load from localStorage
    loadFromLocalStorage() {
        try {
            const cacheVersion = localStorage.getItem('uz_cache_version');
            if (cacheVersion !== '4.1') {
                localStorage.clear();
                localStorage.setItem('uz_cache_version', '4.1');
            }

            // Load chapters
            const savedChapters = localStorage.getItem('uz_chapters');
            let chapters;
            if (savedChapters) {
                chapters = JSON.parse(savedChapters);
            } else {
                // Load initial data from lessons.js
                chapters = window.initialChapters || [];
                localStorage.setItem('uz_chapters', JSON.stringify(chapters));
            }

            // Load progress
            const savedProgress = localStorage.getItem('uz_progress');
            const progress = savedProgress ? JSON.parse(savedProgress) : {};

            // Load pending students
            const savedPendingStudents = localStorage.getItem('uz_pending_students');
            const pendingStudents = savedPendingStudents ? JSON.parse(savedPendingStudents) : [];

            // Load approved students
            const savedApprovedStudents = localStorage.getItem('approved_students_permanent');
            const approvedStudents = savedApprovedStudents ? JSON.parse(savedApprovedStudents) : [];

            return {
                chapters,
                progress,
                pendingStudents,
                approvedStudents
            };
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return {
                chapters: [],
                progress: {},
                pendingStudents: [],
                approvedStudents: []
            };
        }
    },
    
    // Save data methods
    async saveData(key, data) {
        if (this.isApiMode()) {
            return this.saveToAPI(key, data);
        } else {
            return this.saveToLocalStorage(key, data);
        }
    },
    
    // Save to API (Firebase)
    async saveToAPI(key, data) {
        try {
            // Get current data from Firebase
            const currentResponse = await fetch(`${this.API_BASE_URL}/data.json`);
            let currentData = {};
            if (currentResponse.ok) {
                currentData = await currentResponse.json();
            }

            // Update specific data
            if (key === 'progress') {
                const currentUser = JSON.parse(localStorage.getItem('current_user'));
                if (currentUser) {
                    currentData.progress = currentData.progress || {};
                    currentData.progress[currentUser.email] = data;
                }
            } else {
                currentData[key] = data;
            }

            // Save to Firebase
            const response = await fetch(`${this.API_BASE_URL}/data.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentData)
            });

            if (!response.ok) {
                throw new Error(`Firebase request failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to save to Firebase:', error);
            // Fallback to localStorage
            return this.saveToLocalStorage(key, data);
        }
    },
    
    // Save to localStorage
    saveToLocalStorage(key, data) {
        try {
            const storageKey = `uz_${key}`;
            localStorage.setItem(storageKey, JSON.stringify(data));
            console.log(`Saved ${key} to localStorage`);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },
    
    // Authentication methods
    async login(email, password) {
        if (this.isApiMode()) {
            try {
                const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('auth_token', data.token);
                    localStorage.setItem('current_user', JSON.stringify(data.user));
                    return data;
                } else {
                    throw new Error('Login failed');
                }
            } catch (error) {
                console.error('API login failed, falling back to localStorage:', error);
                return this.loginLocalStorage(email, password);
            }
        } else {
            return this.loginLocalStorage(email, password);
        }
    },
    
    // Local storage login fallback
    loginLocalStorage(email, password) {
        // Check approved students
        const approvedStudents = JSON.parse(localStorage.getItem('approved_students_permanent') || '[]');
        const student = approvedStudents.find(s => s.email === email && s.password === password);
        
        if (student) {
            const user = { id: student.id, email: student.email, role: 'student' };
            localStorage.setItem('current_user', JSON.stringify(user));
            return { user, token: 'local-token' };
        }
        
        throw new Error('Invalid credentials');
    },
    
    // Logout
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
    },
    
    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('current_user');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    // Check if authenticated
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SyncConfig;
} else {
    window.SyncConfig = SyncConfig;
}
