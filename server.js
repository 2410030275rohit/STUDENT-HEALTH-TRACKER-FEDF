const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images and documents are allowed'));
        }
    }
});

// Initialize SQLite database
const db = new sqlite3.Database('health_care.db');

// Create tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        name TEXT NOT NULL,
        google_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Documents table
    db.run(`CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        notes TEXT,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        file_type TEXT,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Chat messages table
    db.run(`CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// User registration
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
            [email, hashedPassword, name],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Email already exists' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }

                const token = jwt.sign(
                    { userId: this.lastID, email, name },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    token,
                    user: { id: this.lastID, email, name }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        db.get(
            'SELECT * FROM users WHERE email = ?',
            [email],
            async (err, user) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                if (!user) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                const token = jwt.sign(
                    { userId: user.id, email: user.email, name: user.name },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    token,
                    user: { id: user.id, email: user.email, name: user.name }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Google OAuth login (simplified)
app.post('/api/google-login', (req, res) => {
    try {
        const { email, name, googleId } = req.body;

        if (!email || !name || !googleId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user exists
        db.get(
            'SELECT * FROM users WHERE email = ? OR google_id = ?',
            [email, googleId],
            (err, user) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                if (user) {
                    // User exists, login
                    const token = jwt.sign(
                        { userId: user.id, email: user.email, name: user.name },
                        JWT_SECRET,
                        { expiresIn: '24h' }
                    );

                    res.json({
                        token,
                        user: { id: user.id, email: user.email, name: user.name }
                    });
                } else {
                    // Create new user
                    db.run(
                        'INSERT INTO users (email, name, google_id) VALUES (?, ?, ?)',
                        [email, name, googleId],
                        function(err) {
                            if (err) {
                                return res.status(500).json({ error: 'Database error' });
                            }

                            const token = jwt.sign(
                                { userId: this.lastID, email, name },
                                JWT_SECRET,
                                { expiresIn: '24h' }
                            );

                            res.json({
                                token,
                                user: { id: this.lastID, email, name }
                            });
                        }
                    );
                }
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Upload document
app.post('/api/documents', authenticateToken, upload.single('document'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { title, category, notes } = req.body;

        if (!title || !category) {
            return res.status(400).json({ error: 'Title and category are required' });
        }

        db.run(
            `INSERT INTO documents (user_id, title, category, notes, file_name, file_path, file_size, file_type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.userId,
                title,
                category,
                notes || '',
                req.file.originalname,
                req.file.path,
                req.file.size,
                req.file.mimetype
            ],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                res.json({
                    id: this.lastID,
                    title,
                    category,
                    notes,
                    fileName: req.file.originalname,
                    fileSize: req.file.size,
                    fileType: req.file.mimetype,
                    uploadDate: new Date().toISOString()
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user documents
app.get('/api/documents', authenticateToken, (req, res) => {
    db.all(
        'SELECT * FROM documents WHERE user_id = ? ORDER BY upload_date DESC',
        [req.user.userId],
        (err, documents) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            const formattedDocs = documents.map(doc => ({
                id: doc.id,
                title: doc.title,
                category: doc.category,
                notes: doc.notes,
                fileName: doc.file_name,
                fileSize: doc.file_size,
                fileType: doc.file_type,
                uploadDate: doc.upload_date
            }));

            res.json(formattedDocs);
        }
    );
});

// Download document
app.get('/api/documents/:id/download', authenticateToken, (req, res) => {
    const documentId = req.params.id;

    db.get(
        'SELECT * FROM documents WHERE id = ? AND user_id = ?',
        [documentId, req.user.userId],
        (err, document) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!document) {
                return res.status(404).json({ error: 'Document not found' });
            }

            const filePath = document.file_path;
            if (fs.existsSync(filePath)) {
                res.download(filePath, document.file_name);
            } else {
                res.status(404).json({ error: 'File not found on server' });
            }
        }
    );
});

// Delete document
app.delete('/api/documents/:id', authenticateToken, (req, res) => {
    const documentId = req.params.id;

    db.get(
        'SELECT * FROM documents WHERE id = ? AND user_id = ?',
        [documentId, req.user.userId],
        (err, document) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!document) {
                return res.status(404).json({ error: 'Document not found' });
            }

            // Delete file from filesystem
            if (fs.existsSync(document.file_path)) {
                fs.unlinkSync(document.file_path);
            }

            // Delete from database
            db.run(
                'DELETE FROM documents WHERE id = ?',
                [documentId],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.json({ message: 'Document deleted successfully' });
                }
            );
        }
    );
});

// Chat endpoint
app.post('/api/chat', authenticateToken, (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Simple health response generator
        const response = generateHealthResponse(message);

        // Save chat to database
        db.run(
            'INSERT INTO chat_messages (user_id, message, response) VALUES (?, ?, ?)',
            [req.user.userId, message, response],
            (err) => {
                if (err) {
                    console.error('Error saving chat:', err);
                }
            }
        );

        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get chat history
app.get('/api/chat/history', authenticateToken, (req, res) => {
    db.all(
        'SELECT * FROM chat_messages WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50',
        [req.user.userId],
        (err, messages) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(messages.reverse());
        }
    );
});

// Health response generator function
function generateHealthResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    const responses = {
        'headache': 'For headaches, try staying hydrated, getting adequate rest, and managing stress. Apply a cold or warm compress to your head or neck. If headaches persist, are severe, or are accompanied by other symptoms, please consult a healthcare professional.',
        
        'fever': 'For fever, rest and stay hydrated with water, clear broths, or electrolyte solutions. Monitor your temperature regularly. Seek medical attention if fever is high (over 103°F/39.4°C), persists for more than 3 days, or is accompanied by severe symptoms.',
        
        'cold': 'For cold symptoms, get plenty of rest, drink warm fluids like tea or soup, and consider using a humidifier. Gargle with salt water for sore throat. Most colds resolve within 7-10 days. See a doctor if symptoms worsen or persist beyond 10 days.',
        
        'cough': 'For coughs, stay hydrated, use honey (for ages 1+), and consider a humidifier. Avoid irritants like smoke. See a healthcare provider if cough persists more than 3 weeks, produces blood, or is accompanied by fever and difficulty breathing.',
        
        'diet': 'A balanced diet should include: 5-9 servings of fruits and vegetables daily, whole grains, lean proteins (fish, poultry, beans), healthy fats (nuts, olive oil), and adequate water. Limit processed foods, added sugars, and excessive sodium.',
        
        'exercise': 'Adults should aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week, plus muscle-strengthening activities 2+ days per week. Start slowly if you\'re new to exercise and consult a doctor if you have health concerns.',
        
        'sleep': 'Adults should aim for 7-9 hours of quality sleep nightly. Maintain a consistent sleep schedule, create a relaxing bedtime routine, keep your bedroom cool and dark, and avoid screens before bed. If you have persistent sleep problems, consult a healthcare provider.',
        
        'stress': 'To manage stress: practice deep breathing or meditation, exercise regularly, maintain social connections, get adequate sleep, and consider talking to a counselor. If stress becomes overwhelming or affects daily functioning, seek professional help.',
        
        'blood pressure': 'Normal blood pressure is less than 120/80 mmHg. To maintain healthy blood pressure: eat a low-sodium diet, exercise regularly, maintain a healthy weight, limit alcohol, don\'t smoke, and manage stress. Regular monitoring is important.',
        
        'diabetes': 'For diabetes management: monitor blood sugar regularly, follow your prescribed medication regimen, eat a balanced diet with controlled carbohydrates, exercise regularly, and maintain regular check-ups with your healthcare team.',
        
        'weight': 'Healthy weight management involves: eating a balanced, calorie-appropriate diet, regular physical activity, adequate sleep, stress management, and staying hydrated. Aim for gradual weight changes (1-2 lbs per week) rather than rapid loss.',
        
        'heart': 'For heart health: eat a diet rich in fruits, vegetables, and whole grains; exercise regularly; don\'t smoke; limit alcohol; manage stress; maintain healthy weight; and control blood pressure, cholesterol, and diabetes. Regular check-ups are essential.',
        
        'mental health': 'Mental health is as important as physical health. Practice self-care, maintain social connections, exercise regularly, get adequate sleep, and don\'t hesitate to seek professional help when needed. Many effective treatments are available.',
        
        'vaccination': 'Stay up-to-date with recommended vaccinations including annual flu shots, COVID-19 boosters as recommended, and other vaccines based on age, health conditions, and travel plans. Consult your healthcare provider for personalized recommendations.'
    };

    // Check for keywords in the message
    for (const [keyword, response] of Object.entries(responses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }

    // Default response
    return "I'm here to provide general health information and wellness tips. For specific medical concerns, symptoms, or conditions, please consult with a qualified healthcare professional. What aspect of health and wellness would you like to learn about?";
}

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
        }
    }
    res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Smart Health Care server running on http://localhost:${PORT}`);
});

module.exports = app;
