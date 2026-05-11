-- UčimZnam Database Schema
-- PostgreSQL/SQLite compatible schema

-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chapters table
CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'book',
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons table
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    chapter_id INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    text_content TEXT,
    video_url TEXT,
    pdf_url TEXT,
    key_points JSONB, -- Array of key points
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz questions table
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of 4 options
    correct_answer INTEGER NOT NULL, -- Index of correct answer (0-3)
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student progress table
CREATE TABLE student_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Quiz attempts table
CREATE TABLE quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    score INTEGER NOT NULL, -- Number of correct answers
    total_questions INTEGER NOT NULL,
    percentage DECIMAL(5,2), -- Score percentage
    passed BOOLEAN NOT NULL,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student requests table (for approval workflow)
CREATE TABLE student_requests (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    processed_by INTEGER REFERENCES users(id),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session management table (optional, for enhanced security)
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_chapters_order ON chapters(order_index);
CREATE INDEX idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX idx_lessons_order ON lessons(order_index);
CREATE INDEX idx_quiz_lesson ON quiz_questions(lesson_id);
CREATE INDEX idx_progress_user ON student_progress(user_id);
CREATE INDEX idx_progress_lesson ON student_progress(lesson_id);
CREATE INDEX idx_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_attempts_lesson ON quiz_attempts(lesson_id);
CREATE INDEX idx_requests_status ON student_requests(status);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, role, is_approved) 
VALUES ('admin@ucimznam.rs', '$2b$10$rQ8K8Z8Z8Z8Z8Z8Z8Z8ZO', 'admin', TRUE);

-- Insert sample data (optional)
INSERT INTO chapters (title, description, icon, order_index) VALUES
('Uvod u informatiku', 'Osnovni pojmovi i koncepti informacionih tehnologija', 'computer', 1),
('Hardver i softver', 'Upoznavanje računarskih komponenti i programa', 'cpu', 2),
('Internet i mreže', 'Kako funkcioniše internet i mrežne komunikacije', 'globe', 3);

-- Sample lesson
INSERT INTO lessons (chapter_id, title, description, text_content, order_index) VALUES
(1, 'Šta je informatika?', 'Uvod u svet informacionih tehnologija', 'Informatika je nauka koja se bavi...', 1);

-- Sample quiz question
INSERT INTO quiz_questions (lesson_id, question, options, correct_answer, order_index) VALUES
(1, 'Šta je računar?', 
'["Elektronski uređaj", "Mehanički uređaj", "Hemijski uređaj", "Biološki uređaj"]',
0, 1);
