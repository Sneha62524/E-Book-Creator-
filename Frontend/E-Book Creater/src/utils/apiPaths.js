export const BASE_URL = "http://localhost:8000/api";

export const API_PATHS = {
    // Authentication APIs
    AUTH: {
        REGISTER: `${BASE_URL}/auth/register`,
        LOGIN: `${BASE_URL}/auth/login`,
        GET_PROFILE: `${BASE_URL}/auth/profile`, 
        UPDATE_PROFILE: `${BASE_URL}/auth/profile`,
    },
    
    // E-Book Management APIs
    BOOK: {
        CREATE: `${BASE_URL}/books`,
        GET_ALL: `${BASE_URL}/books`,
        GET_BOOK_BY_ID: (id) => `${BASE_URL}/books/${id}`,
        UPDATE_BOOK: (id) => `${BASE_URL}/books/${id}`,
        DELETE_BOOK: (id) => `${BASE_URL}/books/${id}`,
        UPLOAD_COVER: (id) => `${BASE_URL}/books/cover/${id}`,
    },

    // AI Generation APIs
    AI: {
        GENERATE_OUTLINE: `${BASE_URL}/ai/generate-outline`,
        GENERATE_CHAPTER: `${BASE_URL}/ai/generate-chapter-content`,
    },

    // Export APIs (PDF aur DOCX)
    EXPORT: {
        PDF: (id) => `${BASE_URL}/export/${id}/pdf`,
        DOCX: (id) => `${BASE_URL}/export/${id}/docx`,
    }
};