# Menstrual Health Tracker - Code Explanation for Interviews

## Project Overview

**Purpose:** A full-stack web application for tracking menstrual cycles, symptoms, and generating health reports with AI-powered insights.

**Tech Stack:**
- **Frontend:** React 19.2.0, Vite, Chart.js (data visualization)
- **Backend:** Node.js + Express, MySQL 8.0
- **AI:** OpenAI API (gpt-3.5-turbo) with intelligent rule-based fallback
- **Authentication:** JWT tokens for secure session management

---

## Backend Architecture

### 1. **Server Entry Point** (`server.js`)

**Purpose:** Initialize Express server, configure middleware, register routes, and manage startup

**Key Responsibilities:**
```
┌─────────────────────────────────────────┐
│     Express Server Configuration        │
├─────────────────────────────────────────┤
│ 1. Load environment variables (.env)    │
│ 2. Initialize Express app               │
│ 3. Configure CORS (allow frontend)      │
│ 4. Setup body parser (JSON/form data)   │
│ 5. Register feature routes              │
│ 6. Add error handling middleware        │
│ 7. Check AI backend availability        │
│ 8. Start listening on PORT 5000         │
└─────────────────────────────────────────┘
```

**Important Endpoints:**
- `GET /` - API status check
- `GET /api/health` - Health check with AI status
- `GET /api/ai-check` - Diagnostic endpoint for OpenAI configuration

---

### 2. **Database Connection** (`db.js`)

**Architecture:** Connection Pooling

```
Database Request Flow:
┌──────────────────────────────────────────────────┐
│  Route Handler needs database access             │
├──────────────────────────────────────────────────┤
│  const connection = await pool.getConnection()   │ (Get from pool)
│  const [result] = await connection.execute(sql)  │ (Execute query)
│  connection.release()                            │ (Return to pool)
└──────────────────────────────────────────────────┘
```

**Why Connection Pooling?**
- ✅ **Efficiency:** Reuse connections instead of creating new ones
- ✅ **Concurrency:** Handle multiple simultaneous requests
- ✅ **Performance:** Reduced connection overhead
- ✅ **Reliability:** Automatic connection management

**Configuration:**
- **Pool Size:** 10 connections max
- **Queue Mode:** Unlimited queue (requests wait if pool full)
- **Database:** MySQL with prepared statements for SQL injection prevention

---

### 3. **AI Integration Module** (`utils/ai-helper.js`)

**Architecture:** Intelligent Fallback System

```
User Message
    ↓
getAIResponse() [MAIN ENTRY POINT]
    ↓
    ├─ IF OpenAI API Key exists:
    │   ├─ Call getOpenAIResponse()
    │   │   ├─ Send to OpenAI (gpt-3.5-turbo)
    │   │   ├─ 10-second timeout
    │   │   └─ Extract bot_response + triage_level
    │   │
    │   └─ IF fails → FALLBACK
    │
    ├─ getRuleResponse() [FALLBACK ENGINE]
    │   ├─ Pattern match keywords
    │   ├─ 30+ FAQ responses
    │   ├─ Triage categorization
    │   └─ Return structured response
    │
    └─ Return { bot_response, triage_level }
```

**Triage Levels:**
- **"urgent"** - Heavy bleeding → Recommend emergency care
- **"see_doctor"** - Severe pain → Recommend doctor consultation
- **"normal"** - General questions → Provide reassurance/info

**Why This Design?**

| Aspect | Benefit |
|--------|---------|
| **OpenAI Primary** | Natural language understanding, context-aware responses |
| **Rule-Based Fallback** | Works offline, no API costs, instant responses |
| **Triage System** | Helps UI highlight urgent messages, improves UX |
| **Timeout Protection** | Prevents hanging requests (10s max wait) |

**Example Flow:**

User asks: **"I have heavy bleeding, what should I do?"**

1. OpenAI tries: Generates empathetic, detailed response
2. If OpenAI fails:
   - Pattern match: `"heavy" AND "bleeding"` 
   - Triage: `"urgent"`
   - Response: Pre-written urgent response
3. Frontend receives: `{ bot_response, triage_level: "urgent" }` → Shows red alert

---

### 4. **Chatbot Route Handler** (`routes/chatbot.js`)

**Endpoint:** `POST /api/chat`

**Flow:**
```
1. Authentication
   ↓ JWT verification via verifyToken middleware
   ↓ Extract userId from token

2. Validation
   ↓ Check user_message exists
   ↓ If empty → Return 400 error

3. AI Processing
   ↓ Call getAIResponse(user_message)
   ↓ Get { bot_response, triage_level }

4. Database Logging
   ↓ Get connection from pool
   ↓ INSERT into chatbot_logs table
   ↓ (Parameterized query → SQL injection safe)
   ↓ Release connection

5. Return Response
   ↓ { chat_id, bot_response, triage_level, timestamp }
```

**Security Features:**
- ✅ JWT authentication required
- ✅ Parameterized queries (SQL injection proof)
- ✅ Connection pooling prevents resource exhaustion
- ✅ Error logging for debugging

**Database Schema (chatbot_logs):**
```sql
CREATE TABLE chatbot_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT (Foreign Key),
  user_message TEXT,
  bot_response TEXT,
  triage_level ENUM('normal', 'see_doctor', 'urgent'),
  chat_time TIMESTAMP
);
```

---

## Database Schema

### Core Tables

```
┌─────────────────────────────────────────┐
│            USERS TABLE                  │
├─────────────────────────────────────────┤
│ id, email, password_hash, name, age,    │
│ profile_picture, created_at             │
└─────────────────────────────────────────┘
              ↓ ONE-TO-MANY
┌─────────────────────────────────────────┐
│      CYCLE_RECORDS TABLE                │
├─────────────────────────────────────────┤
│ id, user_id, start_date, end_date,      │
│ cycle_length, flow_level, pain_level    │
└─────────────────────────────────────────┘
              ↓ ONE-TO-MANY
┌─────────────────────────────────────────┐
│       SYMPTOMS TABLE                    │
├─────────────────────────────────────────┤
│ id, cycle_id, log_date, mood, cramps,   │
│ headache, bloating, discharge           │
└─────────────────────────────────────────┘

        SUPPORTING TABLES
┌──────────────────┬──────────────────┐
│  REPORTS TABLE   │ CHATBOT_LOGS TBL │
├──────────────────┼──────────────────┤
│ id, user_id,     │ id, user_id,     │
│ generated_at,    │ user_message,    │
│ summary, pdf_url │ bot_response,    │
│                  │ triage_level     │
└──────────────────┴──────────────────┘
```

**Key Design Principles:**
- ✅ **Normalization:** No data duplication
- ✅ **Foreign Keys:** Referential integrity (ON DELETE CASCADE)
- ✅ **Indexing:** (user_id, start_date) for fast lookups
- ✅ **Prepared Statements:** All queries use parameterization

---

## Authentication System (`middleware/auth.js`)

**JWT (JSON Web Token) Flow:**

```
LOGIN
  ↓
1. User sends credentials
2. Backend validates against password_hash
3. Backend generates JWT token: sign({ userId, email }, JWT_SECRET)
4. Token sent to frontend, stored in localStorage

SUBSEQUENT REQUESTS
  ↓
1. Frontend sends Authorization header: "Bearer <token>"
2. verifyToken middleware extracts token
3. Verifies signature matches JWT_SECRET
4. Extracts userId, attaches to req object
5. If invalid → 401 Unauthorized

LOGOUT
  ↓
Frontend deletes token from localStorage
(Stateless - no server-side session storage needed)
```

**Why JWT?**
- ✅ Stateless (no session database needed)
- ✅ Scalable (doesn't require session affinity)
- ✅ Secure (cryptographically signed)
- ✅ Mobile-friendly (works with all HTTP clients)

---

## Request Lifecycle Example

**User sends message to chatbot:**

```
┌────────────────────────────────────────────┐
│ FRONTEND (React)                           │
│ POST /api/chat                             │
│ Body: { user_message: "Why do I have..." } │
│ Header: Authorization: Bearer <JWT>       │
└────────────────────────────────┬───────────┘
                                 ↓
┌────────────────────────────────────────────┐
│ BACKEND - server.js                        │
│ Routes incoming request to /api/chat       │
└────────────────────────────────┬───────────┘
                                 ↓
┌────────────────────────────────────────────┐
│ routes/chatbot.js                          │
│ 1. verifyToken middleware → Extract userId │
│ 2. Validate user_message                   │
│ 3. Call getAIResponse(user_message)        │
└────────────────────────────────┬───────────┘
                                 ↓
┌────────────────────────────────────────────┐
│ utils/ai-helper.js                         │
│ 1. Try OpenAI API                          │
│    ├─ If success: Return { bot_response,  │
│    │                       triage_level }  │
│    └─ If fail: Fallback to rules           │
│ 2. Rule-based pattern matching             │
│    └─ Return { bot_response,               │
│               triage_level }                │
└────────────────────────────────┬───────────┘
                                 ↓
┌────────────────────────────────────────────┐
│ routes/chatbot.js (continued)              │
│ 1. Get database connection from pool       │
│ 2. INSERT into chatbot_logs:               │
│    (user_id, user_message, bot_response,   │
│     triage_level, NOW())                   │
│ 3. Release connection back to pool         │
└────────────────────────────────┬───────────┘
                                 ↓
┌────────────────────────────────────────────┐
│ RESPONSE to Frontend                       │
│ {                                          │
│   chat_id: 123,                            │
│   bot_response: "A normal cycle...",       │
│   triage_level: "normal",                  │
│   timestamp: "2024-12-10T..."              │
│ }                                          │
└────────────────────────────────────────────┘
```

---

## Code Quality Improvements

### Comments & Documentation
✅ **File Headers:** Purpose and architecture overview
✅ **Function JSDoc:** Parameters, returns, error handling
✅ **Step Comments:** Break down complex logic
✅ **Section Headers:** `===== SECTION NAME =====` for clarity

### Error Handling
✅ **Try-Catch:** All async operations wrapped
✅ **Graceful Fallback:** OpenAI → Rule-based responses
✅ **Timeout Protection:** 10-second max wait for API calls
✅ **User Feedback:** Clear error messages to frontend

### Security
✅ **SQL Injection:** Parameterized queries throughout
✅ **Authentication:** JWT required for sensitive endpoints
✅ **Data Validation:** Input validation before processing
✅ **Environment Variables:** Secrets not hardcoded

### Performance
✅ **Connection Pooling:** Reuse database connections
✅ **Prepared Statements:** Faster query execution
✅ **Timeout Mechanisms:** Prevent hanging requests
✅ **Fallback System:** Instant responses without external APIs

---

## How to Explain to Interviewer

### **Opening Statement:**
> "This is a menstrual health tracking application with AI-powered chatbot. The architecture uses OpenAI API as the primary intelligence layer, but includes an intelligent fallback to rule-based responses. The design prioritizes reliability—if OpenAI fails, users still get helpful responses instantly."

### **On Backend:**
> "The backend is built with Express.js and follows a modular route-based architecture. Each feature (authentication, cycle tracking, chatbot) is in its own route handler. We use MySQL with connection pooling to efficiently handle concurrent requests without overwhelming the database."

### **On AI Integration:**
> "The chatbot has a two-tier system: OpenAI for nuanced responses, and 30+ pre-written rules for offline operation. We classify messages by urgency—urgent, see_doctor, normal—so the frontend can highlight critical health concerns. If OpenAI is slow (>10 seconds), we timeout and use rules."

### **On Security:**
> "We use JWT tokens for stateless authentication—no session database needed. All database queries are parameterized to prevent SQL injection. Every endpoint that modifies data requires authentication verification."

### **On Database:**
> "The schema is normalized to avoid duplication. Cycle records contain duration and flow data, symptoms table links specific symptoms to cycle dates. Proper indexing on user_id and start_date for fast lookups. Foreign keys ensure data integrity."

---

## Key Talking Points for Interview

1. **Problem Solving:** "I solved the AI availability problem with intelligent fallback—users never get a 'service unavailable' message"

2. **Scalability:** "Connection pooling prevents database bottlenecks. JWT auth is stateless, so we can add multiple backend instances without session sharing"

3. **Code Quality:** "Every function has clear documentation explaining what it does, why, and how to use it. I use consistent patterns across routes for maintainability"

4. **Error Handling:** "Timeouts prevent hanging requests. Try-catch blocks log errors. Parameterized queries prevent SQL injection. Each layer validates data"

5. **User-Centric Design:** "The triage system helps users understand urgency. Rule-based fallback ensures the app works even when external APIs fail. Health data is categorized by severity"

---

## Files with Enhanced Comments

✅ `server.js` - Server initialization and routing
✅ `db.js` - Connection pool management
✅ `utils/ai-helper.js` - AI response engine with 30+ FAQ responses
✅ `routes/chatbot.js` - Message processing and logging

Each file includes:
- Purpose and architecture
- Step-by-step logic flow
- Security considerations
- Error handling strategy
- Usage examples

