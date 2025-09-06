# HackElite - Analytics & Admin Dashboard

A comprehensive chatbot application with advanced analytics, user management, and admin dashboard capabilities.

## Features

### 🤖 Chatbot System

- Interactive chatbot with file upload support
- Real-time conversation tracking
- Session management and analytics

### 📊 Analytics & Monitoring

- **Real-time Analytics**: Track user queries, response times, and success rates
- **Usage Statistics**: Monitor system performance and user activity
- **Data Visualization**: Interactive charts and dashboards
- **Performance Metrics**: Response time tracking and error monitoring

### 👥 User Management

- User registration and authentication
- Role-based access control (User/Admin)
- User activity tracking
- Profile management

### 🛠️ Admin Dashboard

- **System Overview**: Real-time system health monitoring
- **User Analytics**: Detailed user behavior insights
- **Export Tools**: Generate reports in PDF, Excel, and CSV formats
- **System Monitoring**: CPU, memory, and network usage tracking

### 🔧 Technical Features

- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Iron Session for secure session management
- **UI Framework**: Material-UI (MUI) v7 with modern design
- **Charts**: MUI X-Charts for data visualization
- **Type Safety**: Full TypeScript implementation

## Setup

1. **Environment Configuration**:

   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/hackelite
   MONGODB_DB=hackelite

   # Session Security
   IRON_SESSION_PASSWORD=your_super_secure_password_here_at_least_32_characters_long

   # Optional: AI Integration
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analytics/
│   │   │   └── admin-stats/     # Admin dashboard API
│   │   ├── auth/                # Authentication routes
│   │   └── chatbot/             # Chatbot API with analytics
│   ├── (main)/
│   │   └── admin/               # Admin dashboard pages
│   │       ├── analytics/       # Analytics dashboard
│   │       ├── users/           # User management
│   │       └── system/          # System monitoring
│   └── _components/
│       ├── admin/               # Admin dashboard components
│       └── chatbot/             # Chatbot components
├── lib/
│   ├── analytics.ts             # Analytics service
│   ├── auth.ts                  # Authentication utilities
│   └── db.ts                    # Database connection
└── models/                      # MongoDB models
    ├── Analytics.ts             # Query tracking
    ├── UserActivity.ts          # User behavior
    ├── ChatSession.ts           # Session management
    └── SystemHealth.ts          # System metrics
```

## API Endpoints

### Analytics APIs

- `GET /api/analytics/admin-stats` - Get comprehensive admin statistics
- `POST /api/chatbot` - Chatbot interaction with analytics tracking

### Authentication APIs

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

## Database Models

### Analytics

Tracks all user queries and AI responses:

```typescript
{
  userId: string;
  sessionId: string;
  query: string;
  response?: string;
  responseTime: number;
  success: boolean;
  timestamp: Date;
  // ... additional metadata
}
```

### UserActivity

Logs user behavior patterns:

```typescript
{
  userId: string;
  sessionId: string;
  action: string;
  details: object;
  timestamp: Date;
}
```

### ChatSession

Manages conversation sessions:

```typescript
{
  userId: string;
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  messageCount: number;
  isActive: boolean;
}
```

### SystemHealth

Monitors system performance:

```typescript
{
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  errorRate: number;
  uptime: number;
}
```

## Admin Dashboard Features

### 📈 Analytics Dashboard

- Real-time query statistics
- Success rate monitoring
- Response time analytics
- User activity trends

### 👥 User Management

- View all registered users
- User activity monitoring
- Role management
- User status tracking

### 📊 System Monitoring

- CPU and memory usage
- Network performance
- Error rate tracking
- System health indicators

### 📄 Export Tools

- Generate PDF reports
- Export data to Excel
- CSV data downloads
- Customizable report periods

## Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # Run TypeScript checks
npm run lint         # Run ESLint
```

### Key Technologies

- **Framework**: Next.js 15 with App Router
- **Database**: MongoDB with Mongoose
- **Authentication**: Iron Session
- **UI**: Material-UI v7
- **Charts**: MUI X-Charts
- **Language**: TypeScript
- **Styling**: Emotion (CSS-in-JS)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
