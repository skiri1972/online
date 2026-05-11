const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Database setup
const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();

// Use environment variable to determine database type
const DB_TYPE = process.env.DB_TYPE || 'sqlite';

let db;

if (DB_TYPE === 'postgresql') {
    // PostgreSQL setup
    db = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'ucimznam',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
    });
} else {
    // SQLite setup (default)
    db = new sqlite3.Database('./ucimznam.db', (err) => {
        if (err) {
            console.error('Error opening SQLite database:', err);
        } else {
            console.log('Connected to SQLite database');
        }
    });
}

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Previše zahteva, pokušajte ponovo kasnije.'
});
app.use('/api/', limiter);

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Pristup zabranjen - nedostaje token' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Nevalidan token' });
        }
        req.user = user;
        next();
    });
};

// Helper functions
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Database query helper
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        if (DB_TYPE === 'postgresql') {
            db.query(sql, params)
                .then(result => resolve(result.rows))
                .catch(reject);
        } else {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        }
    });
};

// Routes

// Authentication routes
app.post('/api/auth/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email i lozinka su obavezni' });
    }

    const users = await query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    if (users.length === 0) {
        return res.status(401).json({ error: 'Pogrešni podaci' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        return res.status(401).json({ error: 'Pogrešni podaci' });
    }

    if (!user.is_approved && user.role !== 'admin') {
        return res.status(401).json({ error: 'Nalog nije odobren' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    });
}));

app.post('/api/auth/register', asyncHandler(async (req, res) => {
    const { email, password, message } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email i lozinka su obavezni' });
    }

    // Check if user already exists
    const existingUsers = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'Korisnik sa ovim emailom već postoji' });
    }

    // Create student request
    await query(
        'INSERT INTO student_requests (email, message) VALUES (?, ?)',
        [email, message || '']
    );

    res.json({ message: 'Zahtev poslat. Čekajte odobrenje administratora.' });
}));

// Chapters routes
app.get('/api/chapters', asyncHandler(async (req, res) => {
    const chapters = await query('SELECT * FROM chapters ORDER BY order_index');
    res.json(chapters);
}));

app.post('/api/chapters', authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
        return res.status(403).json({ error: 'Pristup zabranjen' });
    }

    const { title, description, icon, order_index } = req.body;
    
    const result = await query(
        'INSERT INTO chapters (title, description, icon, order_index) VALUES (?, ?, ?, ?)',
        [title, description, icon || 'book', order_index]
    );

    res.json({ id: result.insertId || result[0].id, message: 'Poglavlje kreirano' });
}));

// Lessons routes
app.get('/api/chapters/:chapterId/lessons', asyncHandler(async (req, res) => {
    const { chapterId } = req.params;
    const lessons = await query(
        'SELECT * FROM lessons WHERE chapter_id = ? ORDER BY order_index',
        [chapterId]
    );
    res.json(lessons);
}));

app.get('/api/lessons/:lessonId', asyncHandler(async (req, res) => {
    const { lessonId } = req.params;
    const lessons = await query('SELECT * FROM lessons WHERE id = ?', [lessonId]);
    
    if (lessons.length === 0) {
        return res.status(404).json({ error: 'Lekcija nije pronađena' });
    }

    // Get quiz questions
    const questions = await query(
        'SELECT * FROM quiz_questions WHERE lesson_id = ? ORDER BY order_index',
        [lessonId]
    );

    res.json({
        ...lessons[0],
        quiz: questions
    });
}));

// Progress routes
app.get('/api/progress/:userId', authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.id !== parseInt(req.params.userId) && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Pristup zabranjen' });
    }

    const progress = await query(
        'SELECT * FROM student_progress WHERE user_id = ?',
        [req.params.userId]
    );

    res.json(progress);
}));

app.post('/api/progress', authenticateToken, asyncHandler(async (req, res) => {
    const { lessonId, isCompleted } = req.body;
    
    await query(
        `INSERT INTO student_progress (user_id, lesson_id, is_completed, completed_at) 
         VALUES (?, ?, ?, ?) 
         ON CONFLICT(user_id, lesson_id) 
         DO UPDATE SET is_completed = ?, completed_at = ?`,
        [req.user.id, lessonId, isCompleted, isCompleted ? new Date() : null, isCompleted, isCompleted ? new Date() : null]
    );

    res.json({ message: 'Napredak sačuvan' });
}));

// Student requests routes
app.get('/api/student-requests', authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
        return res.status(403).json({ error: 'Pristup zabranjen' });
    }

    const requests = await query('SELECT * FROM student_requests ORDER BY created_at');
    res.json(requests);
}));

app.post('/api/student-requests/:id/approve', authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
        return res.status(403).json({ error: 'Pristup zabranjen' });
    }

    const { id } = req.params;
    const { password } = req.body;

    // Get request
    const requests = await query('SELECT * FROM student_requests WHERE id = ?', [id]);
    if (requests.length === 0) {
        return res.status(404).json({ error: 'Zahtev nije pronađen' });
    }

    const request = requests[0];

    // Create user account
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    await query(
        'INSERT INTO users (email, password, role, is_approved) VALUES (?, ?, ?, ?)',
        [request.email, hashedPassword, 'student', true]
    );

    // Update request status
    await query(
        'UPDATE student_requests SET status = ?, processed_by = ?, processed_at = ? WHERE id = ?',
        ['approved', req.user.id, new Date(), id]
    );

    res.json({ message: 'Učenik odobren' });
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Interna serverska greška' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server pokrenut na portu ${PORT}`);
    console.log(`Database tip: ${DB_TYPE}`);
});

module.exports = app;
