// Smart Health Care - Main Application JavaScript

class SmartHealthCare {
    constructor() {
        this.currentUser = null;
        this.documents = [];
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.setupDragAndDrop();
        this.loadDietPlan();
    }

    setupEventListeners() {
        // Login/Logout functionality
        document.getElementById('loginBtn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('getStartedBtn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('googleSignIn').addEventListener('click', () => this.handleGoogleLogin());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        // Modal controls
        document.querySelector('.close').addEventListener('click', () => this.hideLoginModal());
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideLoginModal();
            }
        });

        // Dashboard tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // File upload
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelect(e));
        document.getElementById('uploadBtn').addEventListener('click', () => this.uploadDocument());

        // Chat functionality
        document.getElementById('sendChatBtn').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });

        // Search functionality
        document.querySelector('.search-bar input').addEventListener('input', (e) => this.searchDocuments(e.target.value));

        // Email login form
        document.getElementById('emailLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmailLogin();
        });
    }

    showLoginModal() {
        document.getElementById('loginModal').style.display = 'block';
    }

    hideLoginModal() {
        document.getElementById('loginModal').style.display = 'none';
    }

    handleGoogleLogin() {
        // Simulate Google OAuth login
        setTimeout(() => {
            this.currentUser = {
                name: 'John Doe',
                email: 'john.doe@gmail.com',
                id: 'user123'
            };
            this.isLoggedIn = true;
            this.showDashboard();
            this.hideLoginModal();
        }, 1000);
    }

    handleEmailLogin() {
        const email = document.querySelector('#emailLoginForm input[type="email"]').value;
        const password = document.querySelector('#emailLoginForm input[type="password"]').value;
        
        // Simple validation
        if (email && password) {
            this.currentUser = {
                name: email.split('@')[0],
                email: email,
                id: 'user' + Date.now()
            };
            this.isLoggedIn = true;
            this.showDashboard();
            this.hideLoginModal();
        }
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.hideDashboard();
    }

    showDashboard() {
        document.querySelector('.hero').style.display = 'none';
        document.querySelector('.features').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('userName').textContent = `Welcome, ${this.currentUser.name}!`;
        this.loadDocuments();
    }

    hideDashboard() {
        document.querySelector('.hero').style.display = 'flex';
        document.querySelector('.features').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        uploadArea.addEventListener('click', () => fileInput.click());

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });
    }

    handleFileSelect(event) {
        const files = event.target.files;
        this.handleFiles(files);
    }

    handleFiles(files) {
        Array.from(files).forEach(file => {
            console.log('Selected file:', file.name);
            // In a real app, you would upload the file to a server
        });
    }

    uploadDocument() {
        const title = document.getElementById('documentTitle').value;
        const category = document.getElementById('documentCategory').value;
        const notes = document.getElementById('documentNotes').value;
        const fileInput = document.getElementById('fileInput');

        if (!title || !category || fileInput.files.length === 0) {
            alert('Please fill in all required fields and select a file.');
            return;
        }

        const file = fileInput.files[0];
        const document = {
            id: Date.now(),
            title: title,
            category: category,
            notes: notes,
            fileName: file.name,
            fileSize: file.size,
            uploadDate: new Date().toISOString(),
            type: file.type
        };

        this.documents.push(document);
        this.saveDocuments();
        this.loadDocuments();

        // Clear form
        document.getElementById('documentTitle').value = '';
        document.getElementById('documentCategory').value = '';
        document.getElementById('documentNotes').value = '';
        fileInput.value = '';

        alert('Document uploaded successfully!');
        this.switchTab('documents');
    }

    loadDocuments() {
        const grid = document.getElementById('documentsGrid');
        grid.innerHTML = '';

        if (this.documents.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #64748b;">
                    <i class="fas fa-file-medical" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <h3>No documents uploaded yet</h3>
                    <p>Upload your first medical document to get started.</p>
                </div>
            `;
            return;
        }

        this.documents.forEach(doc => {
            const card = this.createDocumentCard(doc);
            grid.appendChild(card);
        });
    }

    createDocumentCard(doc) {
        const card = document.createElement('div');
        card.className = 'document-card';
        
        const icon = this.getDocumentIcon(doc.category);
        const date = new Date(doc.uploadDate).toLocaleDateString();
        
        card.innerHTML = `
            <div class="document-icon">
                <i class="${icon}"></i>
            </div>
            <div class="document-title">${doc.title}</div>
            <div class="document-category">${this.formatCategory(doc.category)}</div>
            <div class="document-date">Uploaded: ${date}</div>
        `;

        card.addEventListener('click', () => this.viewDocument(doc));
        return card;
    }

    getDocumentIcon(category) {
        const icons = {
            'medical-certificate': 'fas fa-file-medical',
            'prescription': 'fas fa-prescription-bottle-alt',
            'lab-report': 'fas fa-flask',
            'vaccination': 'fas fa-syringe',
            'insurance': 'fas fa-shield-alt',
            'other': 'fas fa-file'
        };
        return icons[category] || 'fas fa-file';
    }

    formatCategory(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    viewDocument(doc) {
        alert(`Viewing: ${doc.title}\nCategory: ${this.formatCategory(doc.category)}\nNotes: ${doc.notes || 'No notes'}`);
    }

    searchDocuments(query) {
        const filteredDocs = this.documents.filter(doc =>
            doc.title.toLowerCase().includes(query.toLowerCase()) ||
            doc.category.toLowerCase().includes(query.toLowerCase()) ||
            (doc.notes && doc.notes.toLowerCase().includes(query.toLowerCase()))
        );

        const grid = document.getElementById('documentsGrid');
        grid.innerHTML = '';

        if (filteredDocs.length === 0 && query) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #64748b;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <h3>No documents found</h3>
                    <p>Try adjusting your search terms.</p>
                </div>
            `;
            return;
        }

        filteredDocs.forEach(doc => {
            const card = this.createDocumentCard(doc);
            grid.appendChild(card);
        });
    }

    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        this.addChatMessage(message, 'user');
        input.value = '';

        // Simulate bot response
        setTimeout(() => {
            const response = this.generateHealthResponse(message);
            this.addChatMessage(response, 'bot');
        }, 1000);
    }

    addChatMessage(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <i class="fas fa-robot"></i>
                <div class="message-content">
                    <p>${message}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${message}</p>
                </div>
                <i class="fas fa-user"></i>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateHealthResponse(message) {
        const responses = {
            'headache': 'For headaches, try staying hydrated, getting adequate rest, and managing stress. If headaches persist or are severe, please consult a healthcare professional.',
            'fever': 'For fever, rest and stay hydrated. Monitor your temperature and seek medical attention if fever is high (over 103°F) or persists for more than 3 days.',
            'cold': 'For cold symptoms, get plenty of rest, drink fluids, and consider using a humidifier. Most colds resolve within 7-10 days.',
            'diet': 'A balanced diet should include fruits, vegetables, whole grains, lean proteins, and healthy fats. Stay hydrated and limit processed foods.',
            'exercise': 'Regular exercise is important for health. Aim for at least 150 minutes of moderate aerobic activity per week, plus strength training.',
            'sleep': 'Adults should aim for 7-9 hours of quality sleep per night. Maintain a consistent sleep schedule and create a relaxing bedtime routine.',
            'stress': 'To manage stress, try deep breathing, meditation, regular exercise, and talking to someone you trust. Consider professional help if stress becomes overwhelming.'
        };

        const lowerMessage = message.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        return "I'm here to help with general health information. For specific medical concerns, please consult with a healthcare professional. What would you like to know about health and wellness?";
    }

    loadDietPlan() {
        const dietPlan = document.getElementById('dietPlan');
        const weeklyPlan = this.generateWeeklyDietPlan();

        dietPlan.innerHTML = weeklyPlan.map(day => `
            <div class="day-plan">
                <div class="day-header">
                    <div class="day-title">${day.day}</div>
                    <div class="day-calories">${day.calories} calories</div>
                </div>
                <div class="meals">
                    ${day.meals.map(meal => `
                        <div class="meal">
                            <div class="meal-title">${meal.name}</div>
                            <div class="meal-items">${meal.items.join(', ')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    generateWeeklyDietPlan() {
        return [
            {
                day: 'Monday',
                calories: '1800-2000',
                meals: [
                    { name: 'Breakfast', items: ['Oatmeal with berries', 'Greek yogurt', 'Green tea'] },
                    { name: 'Lunch', items: ['Grilled chicken salad', 'Quinoa', 'Mixed vegetables'] },
                    { name: 'Snack', items: ['Apple with almond butter'] },
                    { name: 'Dinner', items: ['Baked salmon', 'Sweet potato', 'Steamed broccoli'] }
                ]
            },
            {
                day: 'Tuesday',
                calories: '1800-2000',
                meals: [
                    { name: 'Breakfast', items: ['Whole grain toast', 'Avocado', 'Scrambled eggs'] },
                    { name: 'Lunch', items: ['Lentil soup', 'Brown rice', 'Side salad'] },
                    { name: 'Snack', items: ['Mixed nuts and dried fruits'] },
                    { name: 'Dinner', items: ['Grilled turkey', 'Roasted vegetables', 'Quinoa'] }
                ]
            },
            {
                day: 'Wednesday',
                calories: '1800-2000',
                meals: [
                    { name: 'Breakfast', items: ['Smoothie bowl', 'Granola', 'Fresh fruits'] },
                    { name: 'Lunch', items: ['Tuna wrap', 'Whole wheat tortilla', 'Cucumber slices'] },
                    { name: 'Snack', items: ['Carrot sticks with hummus'] },
                    { name: 'Dinner', items: ['Lean beef stir-fry', 'Brown rice', 'Mixed vegetables'] }
                ]
            },
            {
                day: 'Thursday',
                calories: '1800-2000',
                meals: [
                    { name: 'Breakfast', items: ['Greek yogurt parfait', 'Berries', 'Honey'] },
                    { name: 'Lunch', items: ['Vegetable curry', 'Chickpeas', 'Brown rice'] },
                    { name: 'Snack', items: ['Banana with peanut butter'] },
                    { name: 'Dinner', items: ['Grilled fish', 'Asparagus', 'Wild rice'] }
                ]
            },
            {
                day: 'Friday',
                calories: '1800-2000',
                meals: [
                    { name: 'Breakfast', items: ['Whole grain cereal', 'Milk', 'Sliced banana'] },
                    { name: 'Lunch', items: ['Quinoa salad', 'Black beans', 'Corn'] },
                    { name: 'Snack', items: ['Trail mix'] },
                    { name: 'Dinner', items: ['Baked chicken breast', 'Roasted sweet potato', 'Green beans'] }
                ]
            },
            {
                day: 'Saturday',
                calories: '1800-2000',
                meals: [
                    { name: 'Breakfast', items: ['Pancakes (whole wheat)', 'Fresh berries', 'Maple syrup'] },
                    { name: 'Lunch', items: ['Grilled vegetable sandwich', 'Side of fruit'] },
                    { name: 'Snack', items: ['Yogurt with granola'] },
                    { name: 'Dinner', items: ['Pasta with marinara', 'Grilled chicken', 'Caesar salad'] }
                ]
            },
            {
                day: 'Sunday',
                calories: '1800-2000',
                meals: [
                    { name: 'Breakfast', items: ['Eggs Benedict', 'English muffin', 'Orange juice'] },
                    { name: 'Lunch', items: ['Soup and salad combo', 'Whole grain roll'] },
                    { name: 'Snack', items: ['Fresh fruit salad'] },
                    { name: 'Dinner', items: ['Roast beef', 'Mashed potatoes', 'Steamed vegetables'] }
                ]
            }
        ];
    }

    loadSampleData() {
        // Load sample documents if none exist
        const saved = localStorage.getItem('healthDocuments');
        if (saved) {
            this.documents = JSON.parse(saved);
        } else {
            this.documents = [
                {
                    id: 1,
                    title: 'Annual Physical Exam',
                    category: 'medical-certificate',
                    notes: 'Regular checkup - all normal',
                    fileName: 'physical_exam_2024.pdf',
                    fileSize: 245760,
                    uploadDate: '2024-01-15T10:30:00Z',
                    type: 'application/pdf'
                },
                {
                    id: 2,
                    title: 'Blood Test Results',
                    category: 'lab-report',
                    notes: 'Cholesterol and glucose levels',
                    fileName: 'blood_test_jan2024.pdf',
                    fileSize: 156432,
                    uploadDate: '2024-01-20T14:15:00Z',
                    type: 'application/pdf'
                },
                {
                    id: 3,
                    title: 'COVID-19 Vaccination',
                    category: 'vaccination',
                    notes: 'Booster shot',
                    fileName: 'covid_vaccine_card.jpg',
                    fileSize: 89123,
                    uploadDate: '2024-02-01T09:00:00Z',
                    type: 'image/jpeg'
                }
            ];
        }
    }

    saveDocuments() {
        localStorage.setItem('healthDocuments', JSON.stringify(this.documents));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new SmartHealthCare();
});
