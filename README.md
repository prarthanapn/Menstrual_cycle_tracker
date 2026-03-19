# HarmonyCycle

<div align="center">
  <img src="./frontend/public/logo.png" alt="HarmonyCycle Logo" width="140" />
  <h3>AI-assisted menstrual health tracking with cycle analytics, symptom logging, reports, and a guided health companion.</h3>
  <p>
    <a href="https://menstrual-cycle-tracker.onrender.com">Live API</a>
    |
    <a href="#features">Features</a>
    |
    <a href="#tech-stack">Tech Stack</a>
    |
    <a href="#database-design">Database Design</a>
  </p>
</div>

---

## Overview

HarmonyCycle is a full-stack menstrual health tracking platform designed to help users record cycle activity, monitor symptoms, understand recurring patterns, and generate meaningful health summaries. The product combines a modern React-based frontend with a modular Express API, a structured MySQL database, and an AI-powered chatbot layer to support both day-to-day tracking and broader health awareness.

The project is built to balance usability, reliability, and extensibility. Users can create an account, log cycle events, add symptom details, review charts and predictive insights, access educational content, generate reports, and interact with an assistant that provides menstrual-health guidance. The backend is structured around feature-based routes, while the database is normalized to keep health records organized, queryable, and scalable.

## Why HarmonyCycle

HarmonyCycle was built to solve a practical problem: menstrual health data is often recorded inconsistently, spread across notes, memory, and generic calendar apps. This platform provides a single experience where users can:

- track cycle start and end dates with structured records
- log recurring symptoms, mood, flow, pain, discharge, and notes
- visualize trends through charts and cycle statistics
- estimate future cycle timing from recorded history
- generate reports that are easier to review and share
- ask an AI assistant for contextual guidance and triage-style support
- access educational content in the same product flow

## Features

### User Experience

- Secure registration and login flow with JWT-based authentication
- Guided onboarding and branded public-facing landing experience
- Mobile-friendly interface with dedicated pages for tracking, reporting, education, and profile management

### Cycle Tracking

- Start and manage menstrual cycles with start date, end date, pain level, flow intensity, discharge, and notes
- View recent cycles and understand whether the cycle pattern is trending regular or irregular
- Predict the next expected period using historical cycle intervals

### Symptom Tracking

- Log daily symptoms against a selected cycle
- Record mood and common symptoms such as cramps, headache, bloating, nausea, and discharge
- Build a long-term symptom history that supports pattern recognition

### Analytics and Insights

- Dashboard charts for cycle frequency, cycle length trend, mood distribution, common symptoms, and PMS pattern analysis
- Summary cards for average cycle length, cycle status, recent activity, and predicted next period
- Report views that help users review cycle history in a structured format

### AI Support

- AI-powered chatbot endpoint for menstrual-health questions
- Rule-based fallback logic to keep responses available even when the AI provider is unavailable
- Triage-style response classification for normal, see-doctor, and urgent categories

### Reports and Education

- Report generation support using PDF tooling on the backend
- Educational pages that explain cycle basics, nutrition, mental health, and tracking practices
- Better preparation for conversations with healthcare professionals through organized data summaries

## Tech Stack

<table>
  <thead>
    <tr>
      <th align="left">Icon</th>
      <th align="left">Technology</th>
      <th align="left">Version</th>
      <th align="left">Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://skillicons.dev/icons?i=react" alt="React" width="28" /></td>
      <td>React</td>
      <td>19.2.0</td>
      <td>Builds the interactive user interface and application screens.</td>
    </tr>
    <tr>
      <td><img src="https://skillicons.dev/icons?i=vite" alt="Vite" width="28" /></td>
      <td>Vite</td>
      <td>7.2.2</td>
      <td>Frontend build tool and development server for fast iteration.</td>
    </tr>
    <tr>
      <td><img src="https://skillicons.dev/icons?i=materialui" alt="Material UI" width="28" /></td>
      <td>Material UI</td>
      <td>7.3.5</td>
      <td>Provides polished UI components and consistent design foundations.</td>
    </tr>
    <tr>
      <td><img src="https://skillicons.dev/icons?i=react" alt="React Router" width="28" /></td>
      <td>React Router DOM</td>
      <td>7.9.6</td>
      <td>Handles page navigation and protected route flows.</td>
    </tr>
    <tr>
      <td><img src="https://skillicons.dev/icons?i=axios" alt="Axios" width="28" /></td>
      <td>Axios</td>
      <td>1.13.2</td>
      <td>Manages API communication between frontend and backend.</td>
    </tr>
    <tr>
      <td><img src="https://cdn.simpleicons.org/chartdotjs/FF6384" alt="Chart.js" width="28" /></td>
      <td>Chart.js</td>
      <td>4.5.1</td>
      <td>Renders dashboard visualizations such as trends, distributions, and comparisons.</td>
    </tr>
    <tr>
      <td><img src="https://cdn.simpleicons.org/recharts/22B5BF" alt="Recharts" width="28" /></td>
      <td>Recharts</td>
      <td>2.4.0</td>
      <td>Supports additional charting and data visualization needs.</td>
    </tr>
    <tr>
      <td><img src="https://cdn.simpleicons.org/reactcalendar/0F172A" alt="React Calendar" width="28" /></td>
      <td>React Calendar</td>
      <td>6.0.0</td>
      <td>Drives date-oriented interactions for cycle and symptom logging.</td>
    </tr>
    <tr>
      <td><img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js" width="28" /></td>
      <td>Node.js</td>
      <td>Runtime</td>
      <td>Executes the backend API and server-side utilities.</td>
    </tr>
    <tr>
      <td><img src="https://skillicons.dev/icons?i=express" alt="Express" width="28" /></td>
      <td>Express</td>
      <td>4.19.2</td>
      <td>Implements the REST API, middleware, and route organization.</td>
    </tr>
    <tr>
      <td><img src="https://cdn.simpleicons.org/jsonwebtokens/000000" alt="JWT" width="28" /></td>
      <td>jsonwebtoken</td>
      <td>9.0.2</td>
      <td>Provides stateless authentication for protected user actions.</td>
    </tr>
    <tr>
      <td><img src="https://cdn.simpleicons.org/mysql/4479A1" alt="MySQL" width="28" /></td>
      <td>MySQL</td>
      <td>8.0</td>
      <td>Stores users, cycles, symptoms, reports, and chatbot logs in a relational schema.</td>
    </tr>
    <tr>
      <td><img src="https://cdn.simpleicons.org/mysql/4479A1" alt="mysql2" width="28" /></td>
      <td>mysql2</td>
      <td>3.9.7</td>
      <td>Connects the Node.js backend to MySQL using pooled connections.</td>
    </tr>
    <tr>
      <td><img src="https://skillicons.dev/icons?i=openai" alt="OpenAI" width="28" /></td>
      <td>OpenAI SDK</td>
      <td>4.23.0</td>
      <td>Powers the health-support chatbot with AI-generated responses.</td>
    </tr>
    <tr>
      <td><img src="https://cdn.simpleicons.org/adobeacrobatreader/DC2626" alt="PDFKit" width="28" /></td>
      <td>PDFKit</td>
      <td>0.13.0</td>
      <td>Generates downloadable reports from tracked health data.</td>
    </tr>
    <tr>
      <td><img src="https://skillicons.dev/icons?i=css" alt="CSS" width="28" /></td>
      <td>CSS</td>
      <td>Custom styling</td>
      <td>Controls layout, page styling, theming, and responsive presentation.</td>
    </tr>
  </tbody>
</table>

## Project Architecture

```text
HarmonyCycle
|-- frontend
|   |-- src/components
|   |-- src/pages
|   |-- src/services
|   `-- src/api.js
|-- backend
|   |-- routes
|   |-- middleware
|   |-- utils
|   |-- db.js
|   |-- server.js
|   `-- schema.sql
`-- README.md
```

### Frontend

The frontend is a Vite + React application that provides the complete user-facing experience for HarmonyCycle. It contains public marketing pages, authentication views, cycle tracking screens, symptom logging flows, analytics dashboards, educational content, reporting interfaces, and chatbot interaction pages. Routing is managed client-side, and API requests are centralized through an Axios configuration layer.

### Backend

The backend is built with Express and organized by feature-specific route modules:

- `auth.js` for registration and login
- `users.js` for profile-related operations
- `cycles.js` for cycle creation, retrieval, update, and deletion
- `symptoms.js` for symptom logging and retrieval
- `reports.js` for report-related functionality
- `chatbot.js` for AI-assisted health guidance

Middleware handles authentication, while utility modules support AI integration and PDF generation.

## Database Design

HarmonyCycle uses **MySQL 8.0** as its primary database.

### Why MySQL was used

- It is reliable for structured health records with clear relationships.
- It supports relational integrity through foreign keys.
- It is well suited for transactional operations such as creating cycles, logging symptoms, and generating reports.
- It performs well for dashboard queries that group data by user, cycle, and date.
- It is familiar, production-proven, and easy to extend as the data model evolves.

### Why a relational database fits this project

The application works with highly structured entities that depend on one another. A user can have many cycle records, each cycle can have many symptom logs, and the same user can also own reports and chatbot history. A relational design makes these connections explicit and enforces consistency.

### Core tables

- `users`: stores account and profile information
- `cycle_records`: stores cycle start date, end date, flow, pain, discharge, notes, and duration-related fields
- `symptoms`: stores daily symptom logs linked to a cycle
- `reports`: stores generated report metadata and summaries
- `chatbot_logs`: stores user questions, assistant responses, and triage level

### Database decisions and benefits

- **Normalization:** reduces duplication and keeps health records clean
- **Foreign keys with cascade rules:** preserves referential integrity and simplifies cleanup
- **Indexes on user/date relationships:** improves dashboard and history query performance
- **Connection pooling through `mysql2`:** supports efficient backend access under repeated requests
- **Prepared statements:** protects against SQL injection and improves query safety

## API and Integrations

The backend exposes REST endpoints under `/api` for authentication, cycles, symptoms, reports, users, and chatbot interactions. The frontend consumes these endpoints through a centralized Axios client configured with:

- `VITE_BASE_URL` on the frontend
- `BASE_URL` on the backend

The deployed API base URL currently points to:

```text
https://menstrual-cycle-tracker.onrender.com
```

## Environment Variables

### Frontend

Create `frontend/.env`:

```env
VITE_BASE_URL=https://menstrual-cycle-tracker.onrender.com
```

### Backend

Create `backend/.env`:

```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_NAME=menstrual_tracker
JWT_SECRET=your_jwt_secret
PORT=5000
BASE_URL=https://menstrual-cycle-tracker.onrender.com
OPENAI_API_KEY=your_openai_api_key
```

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd "Menstrual Health Tracker"
```

### 2. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 3. Configure the database

- create the `menstrual_tracker` database in MySQL
- run the SQL in `backend/schema.sql`
- optionally seed sample data if needed

### 4. Add environment variables

- configure `backend/.env`
- configure `frontend/.env`

### 5. Run the backend

```bash
cd backend
npm run dev
```

### 6. Run the frontend

```bash
cd frontend
npm run dev
```

## Key Project Strengths

- Professional full-stack structure with clear separation between UI, API, and persistence layers
- Real-world health use case with practical tracking and reporting workflows
- Data visualization for trend analysis and user engagement
- AI support with graceful fallback behavior for reliability
- Extensible schema and modular route design for future features
- Strong foundation for deployment, scaling, and portfolio presentation

## Suggested Future Enhancements

- notifications and reminders for upcoming periods or symptom check-ins
- doctor-sharing workflows with export and secure links
- richer AI personalization using anonymized historical trends
- role-based admin or care-provider views
- image upload support for profile and report attachments
- automated testing coverage for API routes and frontend flows

## Disclaimer

HarmonyCycle is a menstrual health tracking and awareness platform. It is intended to support personal monitoring and education, not to replace professional medical diagnosis or treatment.

---

<div align="center">
  <strong>HarmonyCycle</strong><br />
  Your cycle, your patterns, your insights.
</div>
