import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// eslint-disable-next-line no-unused-vars
const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${user?.name || 'there'}! I'm your AI Health Assistant. I can help answer general health questions, provide wellness tips, and offer basic medical guidance. How can I help you today?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Health knowledge base with responses
  const healthKnowledge = {
    symptoms: {
      keywords: ['headache', 'fever', 'cough', 'cold', 'pain', 'stomach', 'nausea', 'dizzy', 'tired', 'fatigue'],
      responses: [
        "I understand you're experiencing symptoms. While I can provide general information, it's important to consult with a healthcare professional for proper diagnosis and treatment.",
        "For common symptoms like headaches or mild fever, rest and hydration often help. However, if symptoms persist or worsen, please see a doctor.",
        "If you're experiencing severe symptoms or emergency signs (chest pain, difficulty breathing, severe bleeding), please seek immediate medical attention or call emergency services."
      ]
    },
    nutrition: {
      keywords: ['diet', 'food', 'nutrition', 'vitamins', 'healthy eating', 'weight', 'calories'],
      responses: [
        "A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats. Aim for 5 servings of fruits and vegetables daily.",
        "Stay hydrated by drinking 8-10 glasses of water daily. Limit processed foods, sugar, and excessive salt.",
        "For personalized nutrition advice, consider consulting with a registered dietitian who can create a plan tailored to your needs."
      ]
    },
    exercise: {
      keywords: ['exercise', 'workout', 'fitness', 'activity', 'gym', 'running', 'walking'],
      responses: [
        "Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity weekly, plus muscle-strengthening exercises twice a week.",
        "Start slowly if you're new to exercise. Even a 10-minute walk daily can provide health benefits.",
        "Choose activities you enjoy - dancing, swimming, hiking, or playing sports can all be great forms of exercise!"
      ]
    },
    sleep: {
      keywords: ['sleep', 'insomnia', 'tired', 'rest', 'bedtime', 'sleeping'],
      responses: [
        "Adults need 7-9 hours of quality sleep nightly. Maintain a consistent sleep schedule by going to bed and waking up at the same time daily.",
        "Create a relaxing bedtime routine: limit screen time, keep your bedroom cool and dark, and avoid caffeine late in the day.",
        "If you have persistent sleep problems, consider speaking with a healthcare provider about possible sleep disorders."
      ]
    },
    mental_health: {
      keywords: ['stress', 'anxiety', 'depression', 'mental health', 'mood', 'worried', 'sad'],
      responses: [
        "Mental health is just as important as physical health. Practice stress management through deep breathing, meditation, or yoga.",
        "Stay connected with friends and family, engage in activities you enjoy, and don't hesitate to seek professional help if needed.",
        "If you're experiencing persistent sadness, anxiety, or thoughts of self-harm, please reach out to a mental health professional or crisis helpline immediately."
      ]
    },
    medications: {
      keywords: ['medicine', 'medication', 'pills', 'dosage', 'side effects', 'prescription'],
      responses: [
        "Always take medications as prescribed by your healthcare provider. Don't skip doses or stop taking medication without consulting your doctor.",
        "Keep an updated list of all medications you take, including over-the-counter drugs and supplements.",
        "If you experience side effects, contact your healthcare provider. Never share prescription medications with others."
      ]
    },
    prevention: {
      keywords: ['prevent', 'vaccination', 'checkup', 'screening', 'health check'],
      responses: [
        "Regular health screenings and preventive care are crucial. Follow your doctor's recommendations for checkups, vaccinations, and screenings.",
        "Practice good hygiene: wash hands frequently, cover coughs and sneezes, and avoid close contact with sick individuals.",
        "Maintain a healthy lifestyle with good nutrition, regular exercise, adequate sleep, and stress management."
      ]
    }
  };

  const generateResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Check for greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to help with your health questions. What would you like to know about?";
    }

    // Check for thanks
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! Remember, I provide general health information only. Always consult healthcare professionals for medical advice. Is there anything else I can help you with?";
    }

    // Emergency keywords
    const emergencyKeywords = ['emergency', 'urgent', 'severe pain', 'chest pain', 'can\'t breathe', 'bleeding', 'unconscious'];
    if (emergencyKeywords.some(keyword => message.includes(keyword))) {
      return "🚨 This sounds like a medical emergency. Please call emergency services (911) or go to the nearest emergency room immediately. Don't wait for online advice in emergency situations.";
    }

    // Find matching category
    for (const [, data] of Object.entries(healthKnowledge)) {
      if (data.keywords.some(keyword => message.includes(keyword))) {
        const randomResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
        return randomResponse;
      }
    }

    // Default response for unmatched queries
    return "I can help with general health topics like nutrition, exercise, sleep, stress management, and wellness tips. Could you please be more specific about what health topic you'd like to discuss?";
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How can I improve my sleep?",
    "What's a healthy diet?",
    "How much exercise do I need?",
    "How to manage stress?",
    "What are preventive health measures?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="page">
      <div className="container">
        <h1>🤖 AI Health Assistant</h1>
        <p>Get instant answers to your general health questions</p>

        <div className="chatbot-container">
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="message-avatar">
                  {message.sender === 'user' ? '👤' : '🤖'}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="message-avatar">🤖</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-questions">
            <p>Quick questions:</p>
            <div className="quick-buttons">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="quick-btn"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-input">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about health, nutrition, exercise, sleep, or wellness..."
              className="message-input"
              rows="3"
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="send-button"
            >
              Send
            </button>
          </div>

          <div className="disclaimer">
            <p>
              ⚠️ <strong>Medical Disclaimer:</strong> This AI assistant provides general health information only and should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .chatbot-container {
          max-width: 800px;
          margin: 2rem auto;
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          overflow: hidden;
          background-color: var(--background-color);
          box-shadow: var(--shadow-lg);
        }

        .chat-messages {
          height: 500px;
          overflow-y: auto;
          padding: 1rem;
          background-color: var(--light-bg);
        }

        .message {
          display: flex;
          margin-bottom: 1rem;
          align-items: flex-end;
          gap: 0.75rem;
        }

        .user-message {
          flex-direction: row-reverse;
        }

        .message-content {
          max-width: 70%;
          display: flex;
          flex-direction: column;
        }

        .message-text {
          padding: 1rem;
          border-radius: 1rem;
          word-wrap: break-word;
          line-height: 1.5;
        }

        .user-message .message-text {
          background-color: var(--primary-color);
          color: white;
          border-bottom-right-radius: 0.25rem;
        }

        .bot-message .message-text {
          background-color: var(--background-color);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          border-bottom-left-radius: 0.25rem;
        }

        .message-time {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
          padding: 0 0.5rem;
        }

        .user-message .message-time {
          text-align: right;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .typing-indicator {
          display: flex;
          gap: 0.25rem;
          padding: 1rem;
          align-items: center;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--text-secondary);
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        .quick-questions {
          padding: 1rem;
          border-top: 1px solid var(--border-color);
          background-color: var(--background-color);
        }

        .quick-questions p {
          margin: 0 0 0.75rem 0;
          font-weight: 500;
          color: var(--text-color);
        }

        .quick-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .quick-btn {
          padding: 0.5rem 1rem;
          background-color: var(--light-bg);
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          color: var(--text-color);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
        }

        .quick-btn:hover {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .chat-input {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          background-color: var(--background-color);
          border-top: 1px solid var(--border-color);
        }

        .message-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          background-color: var(--background-color);
          color: var(--text-color);
          resize: none;
          font-family: inherit;
        }

        .message-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .send-button {
          padding: 0.75rem 1.5rem;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }

        .send-button:hover:not(:disabled) {
          background-color: var(--primary-dark);
        }

        .send-button:disabled {
          background-color: var(--text-secondary);
          cursor: not-allowed;
        }

        .disclaimer {
          padding: 1rem;
          background-color: var(--warning-bg, #fef3cd);
          border-top: 1px solid var(--border-color);
          font-size: 0.875rem;
        }

        .disclaimer p {
          margin: 0;
          color: var(--warning-text, #856404);
        }

        @media (max-width: 768px) {
          .message-content {
            max-width: 85%;
          }

          .quick-buttons {
            flex-direction: column;
          }

          .chat-input {
            flex-direction: column;
          }

          .send-button {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;