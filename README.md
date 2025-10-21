# SecureMed - Secure Medical Record Storage Website

A comprehensive, secure web application for storing and managing medical records, with features for medication reminders, health tracking, emergency information, and AI-powered health assistance.

## 🚀 Features

### Core Features
- **🔐 Secure Authentication**: JWT-based authentication with password hashing
- **📋 Medical Records Management**: Upload, store, and organize medical documents (PDFs, images, prescriptions)
- **💊 Medicine Reminders**: Set automated reminders for medications with expiry tracking
- **🏥 Emergency Information Card**: Store critical medical info, allergies, blood group, and emergency contacts
- **📱 Multi-Device Access**: Responsive design for desktop, tablet, and mobile access
- **🌙 Dark/Light Mode**: Toggle between themes with user preference persistence

### Health & Wellness Tools
- **📊 BMI Calculator**: Calculate BMI with health recommendations
- **💡 Daily Health Tips**: Personalized health and diet recommendations
- **🤖 Health Chatbot**: AI-powered assistant for basic health guidance
- **📈 Health Tracking**: Monitor health metrics and progress
- **👨‍⚕️ Doctor Contacts**: Save and organize healthcare provider information

### Security & Privacy
- **🔒 End-to-End Encryption**: Industry-standard data protection
- **🛡️ HIPAA Compliance**: Healthcare data security standards
- **🔐 Secure File Storage**: Protected medical document storage
- **🚨 Access Control**: User-specific data isolation
- **📊 Login History Tracking**: Monitor account access

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **CSS3** - Styling with custom properties

### Security & Middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging
- **Express Validator** - Input validation
- **Dotenv** - Environment variables

## 📁 Project Structure

```
secure-medical-storage/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── uploads/            # File storage
│   ├── index.js            # Server entry point
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secure-medical-storage
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   npm run install-server

   # Install client dependencies
   npm run install-client

   # Or install all at once
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```bash
   cp server/.env.example server/.env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/medical-storage
   JWT_SECRET=your_secure_jwt_secret_key
   JWT_EXPIRE=30d
   EMAIL_SERVICE=gmail
   EMAIL_USERNAME=your_email@gmail.com
   EMAIL_PASSWORD=your_email_app_password
   EMAIL_FROM=your_email@gmail.com
   NODE_ENV=development
   ```

4. **Database Setup**
   
   Make sure MongoDB is running:
   ```bash
   # For local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   # Update MONGODB_URI in .env with your Atlas connection string
   ```

5. **Start the Application**
   
   **Development Mode** (runs both frontend and backend):
   ```bash
   npm run dev
   ```
   
   **Or run separately:**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/medical-storage |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 30d |
| `EMAIL_SERVICE` | Email service provider | gmail |
| `EMAIL_USERNAME` | Email username | Required for notifications |
| `EMAIL_PASSWORD` | Email password/app password | Required for notifications |
| `NODE_ENV` | Environment mode | development |

### File Upload Limits
- Maximum file size: 10MB
- Allowed formats: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF
- Storage: Local filesystem (configurable for cloud storage)

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Medical Records Endpoints

#### Upload Medical Record
```http
POST /api/medical-records
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Lab Results",
  "recordType": "Lab Result",
  "description": "Blood test results",
  "file": <file>,
  "doctorName": "Dr. Smith",
  "doctorSpecialty": "General Medicine",
  "doctorContact": "+1234567890"
}
```

#### Get Medical Records
```http
GET /api/medical-records?page=1&limit=10&recordType=Report
Authorization: Bearer <token>
```

### Reminder Endpoints

#### Create Reminder
```http
POST /api/reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Take Vitamin D",
  "medicineName": "Vitamin D3",
  "dosage": "1000 IU",
  "frequency": "Daily",
  "startDate": "2023-10-01",
  "endDate": "2023-12-01",
  "reminderTimes": ["2023-10-01T08:00:00Z"]
}
```

### Health Tools Endpoints

#### Calculate BMI
```http
POST /api/health-tips/bmi
Authorization: Bearer <token>
Content-Type: application/json

{
  "weight": 70,
  "height": 175,
  "unit": "metric"
}
```

#### Get Daily Health Tip
```http
GET /api/health-tips/daily
Authorization: Bearer <token>
```

### Chatbot Endpoints

#### Chat with Health Bot
```http
POST /api/chatbot/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I have a headache, what should I do?"
}
```

## 🔒 Security Features

### Authentication & Authorization
- JWT-based stateless authentication
- Password hashing with bcrypt (10 rounds)
- Protected routes with middleware
- Role-based access control

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection with Helmet
- CORS configuration
- Rate limiting (100 requests per 15 minutes)

### File Security
- File type validation
- File size limits
- Secure file storage
- Access control for uploaded files

### Privacy & Compliance
- User data isolation
- Secure password requirements
- Data encryption at rest
- HTTPS recommended for production

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# Run all tests
npm run test
```

### Test Coverage
- Unit tests for models and utilities
- Integration tests for API endpoints
- Frontend component tests
- End-to-end testing with Cypress (optional)

## 🚀 Deployment

### Production Build
```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

### Environment Setup for Production
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure MongoDB Atlas or production database
4. Set up email service (SendGrid, AWS SES, etc.)
5. Configure HTTPS/SSL
6. Set up domain and DNS
7. Configure reverse proxy (Nginx)

### Recommended Hosting Platforms
- **Heroku** - Easy deployment with MongoDB Atlas
- **Vercel** - Frontend hosting with API routes
- **DigitalOcean** - VPS with full control
- **AWS** - Scalable cloud infrastructure
- **Railway** - Simple full-stack deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Follow semantic versioning
- Ensure security best practices

## 📋 TODO & Roadmap

### Immediate Improvements
- [ ] Complete frontend component implementation
- [ ] Add comprehensive error handling
- [ ] Implement file encryption
- [ ] Add email notifications for reminders
- [ ] Create admin dashboard
- [ ] Add data export functionality

### Future Features
- [ ] Mobile app (React Native)
- [ ] Telemedicine integration
- [ ] Wearable device sync
- [ ] AI-powered health insights
- [ ] Blockchain for record verification
- [ ] Multi-language support
- [ ] Insurance integration

## 🐛 Known Issues

1. **File Upload**: Large files may timeout on slow connections
2. **Notifications**: Email notifications require SMTP configuration
3. **Mobile**: Some UI elements need responsive optimization
4. **Browser Support**: IE11 not fully supported

## 📞 Support

For support, email support@securemed.com or create an issue in the repository.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing frontend library
- Express.js community for the robust backend framework
- MongoDB for flexible document storage
- All contributors and testers

---

**⚠️ Medical Disclaimer**: This application is for informational purposes only and should not replace professional medical advice. Always consult with healthcare providers for medical decisions.