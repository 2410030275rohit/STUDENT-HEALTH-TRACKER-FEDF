# Smart Health Care - Medical Document Storage Website

A secure web application for storing and managing medical certificates and health documents, featuring Google authentication, health chatbot, and personalized diet plans.

## Features

### 🔐 Secure Authentication
- Google OAuth integration
- Email/password login
- JWT-based session management
- Secure user data protection

### 📄 Document Management
- Upload medical certificates, prescriptions, lab reports
- Secure cloud storage with file encryption
- Smart categorization and search
- Download and view documents anytime
- Support for PDF, images, and document formats

### 🤖 Health Chatbot
- AI-powered health assistant
- Get answers to common health questions
- Personalized health tips and advice
- Chat history tracking

### 🥗 Diet Planning
- Pre-designed 7-day diet plans
- Balanced nutrition recommendations
- Calorie tracking and meal suggestions
- Healthy lifestyle guidance

### 📱 Responsive Design
- Mobile-friendly interface
- Modern, intuitive UI
- Cross-platform compatibility
- Accessible design principles

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone or download the project files**
   ```bash
   cd "C:\Users\pinet\SMART HEALTH CARE"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   Open your browser and navigate to: `http://localhost:3000`

## Usage Guide

### Getting Started
1. **Sign Up/Login**: Use Google authentication or create an account with email
2. **Dashboard Access**: After login, access your personal dashboard
3. **Upload Documents**: Navigate to the Upload tab to add medical documents
4. **Organize Files**: Categorize documents (Medical Certificate, Prescription, Lab Report, etc.)
5. **Search & Retrieve**: Use the search function to quickly find documents

### Document Categories
- **Medical Certificate**: Official health certificates
- **Prescription**: Doctor prescriptions and medication records
- **Lab Report**: Blood tests, X-rays, and diagnostic reports
- **Vaccination**: Immunization records and vaccine certificates
- **Insurance**: Health insurance documents
- **Other**: Miscellaneous health-related documents

### Health Features
- **Chat Assistant**: Ask health-related questions for instant guidance
- **Diet Plans**: Access weekly meal plans with nutritional information
- **Document Security**: All files are encrypted and securely stored

## Technical Architecture

### Frontend
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Interactive functionality and API integration
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **SQLite**: Lightweight database for user and document data
- **Multer**: File upload handling
- **JWT**: Secure authentication tokens
- **bcrypt**: Password hashing and security

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    name TEXT NOT NULL,
    google_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Documents Table
```sql
CREATE TABLE documents (
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
);
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/google-login` - Google OAuth login

### Documents
- `GET /api/documents` - Get user documents
- `POST /api/documents` - Upload new document
- `GET /api/documents/:id/download` - Download document
- `DELETE /api/documents/:id` - Delete document

### Chat
- `POST /api/chat` - Send chat message
- `GET /api/chat/history` - Get chat history

## Security Features

### Data Protection
- **Encryption**: All uploaded files are securely stored
- **Authentication**: JWT-based secure sessions
- **Password Security**: bcrypt hashing for passwords
- **File Validation**: Strict file type and size validation
- **CORS Protection**: Cross-origin request security

### Privacy
- **User Isolation**: Each user can only access their own documents
- **Secure File Storage**: Files stored outside web-accessible directory
- **Session Management**: Automatic token expiration
- **Input Validation**: Comprehensive input sanitization

## File Upload Specifications

### Supported Formats
- **Images**: JPG, JPEG, PNG, GIF
- **Documents**: PDF, DOC, DOCX
- **Maximum Size**: 10MB per file
- **Security**: Automatic file type validation

### Storage Structure
```
uploads/
├── document-1234567890-123.pdf
├── document-1234567891-456.jpg
└── ...
```

## Health Chatbot Features

### Supported Topics
- General health questions
- Symptom guidance (not medical diagnosis)
- Nutrition and diet advice
- Exercise recommendations
- Sleep and wellness tips
- Stress management
- Preventive care information

### Important Note
The chatbot provides general health information only and should not replace professional medical advice. Always consult healthcare professionals for medical concerns.

## Diet Plan Features

### Weekly Meal Planning
- **7-Day Rotation**: Complete weekly meal plans
- **Balanced Nutrition**: Protein, carbs, healthy fats
- **Calorie Guidance**: 1800-2000 calorie recommendations
- **Meal Categories**: Breakfast, lunch, dinner, snacks
- **Variety**: Different meals each day of the week

## Browser Compatibility

### Supported Browsers
- **Chrome**: Version 90+
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Edge**: Version 90+
- **Mobile Browsers**: iOS Safari, Chrome Mobile

## Development

### Project Structure
```
SMART HEALTH CARE/
├── index.html          # Main application page
├── styles.css          # Application styling
├── app.js             # Frontend JavaScript
├── server.js          # Backend server
├── package.json       # Dependencies and scripts
├── README.md          # Documentation
├── uploads/           # File storage directory
└── health_care.db     # SQLite database
```

### Environment Variables
Create a `.env` file for production:
```
PORT=3000
JWT_SECRET=your-secure-secret-key
NODE_ENV=production
```

## Deployment

### Local Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Production Deployment
1. Set environment variables
2. Configure HTTPS
3. Set up proper file permissions
4. Configure reverse proxy (nginx/Apache)
5. Set up SSL certificates

## Troubleshooting

### Common Issues

1. **File Upload Errors**
   - Check file size (max 10MB)
   - Verify file format is supported
   - Ensure uploads directory exists

2. **Login Issues**
   - Verify email/password combination
   - Check JWT token expiration
   - Clear browser cache/cookies

3. **Database Errors**
   - Ensure SQLite file permissions
   - Check disk space availability
   - Verify database file integrity

### Support
For technical support or questions, please check the troubleshooting section or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Changelog

### Version 1.0.0
- Initial release
- User authentication system
- Document upload and management
- Health chatbot integration
- 7-day diet plan feature
- Responsive web design
- SQLite database implementation

---

**Smart Health Care** - Keeping your medical documents safe and accessible, while promoting healthy living through AI-powered assistance and nutrition guidance.
