// API Client for UčimZnam
// Handles all communication with the backend server

class ApiClient {
    constructor() {
        this.baseURL = process.env.API_BASE_URL || 'http://localhost:3000/api';
        this.token = localStorage.getItem('auth_token');
    }

    // Helper method for making API requests
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        // Add authorization token if available
        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication methods
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        this.token = data.token;
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('current_user', JSON.stringify(data.user));

        return data;
    }

    async register(email, password, message = '') {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, message }),
        });
    }

    logout() {
        this.token = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('current_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Chapters methods
    async getChapters() {
        return await this.request('/chapters');
    }

    async createChapter(chapterData) {
        return await this.request('/chapters', {
            method: 'POST',
            body: JSON.stringify(chapterData),
        });
    }

    // Lessons methods
    async getChapterLessons(chapterId) {
        return await this.request(`/chapters/${chapterId}/lessons`);
    }

    async getLesson(lessonId) {
        return await this.request(`/lessons/${lessonId}`);
    }

    async createLesson(lessonData) {
        return await this.request('/lessons', {
            method: 'POST',
            body: JSON.stringify(lessonData),
        });
    }

    async updateLesson(lessonId, lessonData) {
        return await this.request(`/lessons/${lessonId}`, {
            method: 'PUT',
            body: JSON.stringify(lessonData),
        });
    }

    async deleteLesson(lessonId) {
        return await this.request(`/lessons/${lessonId}`, {
            method: 'DELETE',
        });
    }

    // Progress methods
    async getUserProgress(userId) {
        return await this.request(`/progress/${userId}`);
    }

    async saveProgress(lessonId, isCompleted) {
        return await this.request('/progress', {
            method: 'POST',
            body: JSON.stringify({ lessonId, isCompleted }),
        });
    }

    // Student requests methods
    async getStudentRequests() {
        return await this.request('/student-requests');
    }

    async approveStudentRequest(requestId, password) {
        return await this.request(`/student-requests/${requestId}/approve`, {
            method: 'POST',
            body: JSON.stringify({ password }),
        });
    }

    async rejectStudentRequest(requestId) {
        return await this.request(`/student-requests/${requestId}/reject`, {
            method: 'POST',
        });
    }

    // Quiz methods
    async saveQuizAttempt(lessonId, score, totalQuestions, passed) {
        return await this.request('/quiz-attempts', {
            method: 'POST',
            body: JSON.stringify({
                lessonId,
                score,
                totalQuestions,
                percentage: (score / totalQuestions) * 100,
                passed,
            }),
        });
    }

    async getQuizAttempts(userId, lessonId) {
        const params = lessonId ? `?lessonId=${lessonId}` : '';
        return await this.request(`/quiz-attempts/${userId}${params}`);
    }
}

// Create global API client instance
const api = new ApiClient();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
} else {
    window.api = api;
}
