Build a complete, professional, production-quality full-stack web application called CoServe for Smart India Hackathon 2026.

PROBLEM STATEMENT:
SIH26089 — Cooperative Gig Services Platform for Household & Community Services

PROJECT NAME:
CoServe

TAGLINE:
Cooperative Services. Stronger Communities.

SECONDARY TAGLINE:
Empowering Workers. Connecting Communities.

CORE CONCEPT:
CoServe is a cooperative-powered digital service ecosystem that connects households and communities with verified skilled service workers while improving worker opportunities, transparency, trust, welfare, fair earnings and cooperative participation.

IMPORTANT:
This must NOT look like a generic freelancer marketplace, Urban Company clone, basic CRUD project, government portal, or generic AI-generated website. It must clearly demonstrate the cooperative model and should look like a serious startup product suitable for an SIH judging demo.

TECHNOLOGY STACK:

Frontend:
React.js
JavaScript
HTML5
CSS3
Tailwind CSS where useful
React Router
Axios or Fetch API
Recharts
Lucide React icons

Do NOT use TypeScript.

Backend:
Node.js
Express.js
JavaScript
REST APIs
mysql2
JWT
bcrypt or bcryptjs
dotenv
CORS

Database:
MySQL ONLY.

Do NOT use MongoDB, Mongoose, Firebase or Supabase as the primary database.

Use MySQL with:
- Primary keys
- Foreign keys
- Unique constraints
- Indexes
- Normalized relational tables
- JOIN queries
- Transactions for important booking/payment operations
- Parameterized queries to prevent SQL injection
- mysql2 connection pooling

AUTHENTICATION:
Use JWT authentication and bcrypt password hashing.
Never store plain-text passwords.
Use role-based authorization.

USER ROLES:
1. Customer
2. Worker
3. Cooperative Manager
4. Admin

The Cooperative Manager must be a separate role from Admin because cooperative management is a core part of the solution.

CUSTOMER FEATURES:

Customers must be able to:
- Register
- Login
- Logout
- Manage profile
- Browse services
- Search workers
- Search by skill
- Search by service
- Search by location
- Filter verified workers
- Filter by rating
- Filter by experience
- Filter by availability
- Filter by cooperative
- Sort by best match, rating, experience, distance and reliability
- View worker profiles
- View certifications
- View verification status
- View Trust Score
- View cooperative affiliation
- View completed jobs
- View reviews
- Book workers
- Select service date and time
- Enter service address
- Add service description
- Request urgent service
- Track booking status
- Cancel eligible bookings
- View booking history
- View digital service receipts
- Rate completed services
- Review workers
- Favorite workers
- Favorite services
- Raise disputes
- Receive notifications

WORKER FEATURES:

Workers must be able to:
- Register
- Login
- Logout
- Create and edit profile
- Add skills
- Add service categories
- Add experience
- Add certifications
- Add location
- Set service radius
- Set availability
- View verification status
- Join a cooperative
- View cooperative information
- View incoming bookings
- Accept bookings
- Reject bookings
- Mark services as completed
- View booking history
- View ratings and reviews
- View Trust Score
- View completed jobs
- View earnings
- View transparent earnings breakdown
- View worker welfare indicators
- Receive notifications

COOPERATIVE FEATURES:

Create a dedicated Cooperative Management system.

Cooperative Managers can:
- Create cooperative
- Edit cooperative profile
- View cooperative profile
- Add or approve workers
- View cooperative members
- View member skills
- View verification status
- View cooperative services
- View active jobs
- View completed jobs
- View cooperative earnings
- View member earnings
- View service demand
- View performance analytics
- View worker availability
- Monitor service quality
- View cooperative rating
- Manage disputes related to cooperative workers

Example:
Anna Nagar Electrical Workers Cooperative

Show on worker profiles:
Member of: Anna Nagar Electrical Workers Cooperative

COOPERATIVE MATCHING:

Do not simply match customers with random individual freelancers.

The platform should visually demonstrate:

Customer
→ Service Request
→ Smart Matching Engine
→ Suitable Verified Workers
→ Cooperative
→ Best Available Worker
→ Service

If the preferred worker is unavailable, automatically recommend suitable verified cooperative workers.

SMART MATCHING ENGINE:

Implement an explainable rule-based Smart Matching Engine.

Do not require machine learning for the MVP.

Calculate Match Score using:
- Skill Match: 35%
- Availability: 25%
- Distance: 15%
- Rating: 10%
- Experience: 10%
- Reliability: 5%

Total = 100%.

Only verified workers should be recommended.

Example:

Customer searches:
"I need an electrician to repair a ceiling fan tomorrow morning."

Show:

BEST MATCH
Ravi Kumar
Verified
4.9 rating
5 years experience
2.4 km away
Available tomorrow morning
Match Score: 94%

Why recommended:
- Skill match
- Available
- Nearby
- Verified
- Highly reliable

Clearly label this as a Smart Matching algorithm, not artificial intelligence or machine learning if it is only rule-based.

WORKER TRUST SCORE:

Create a Trust Score separate from star ratings.

Calculate Trust Score from:
- Verification
- Certifications
- Completed jobs
- Rating
- Reliability
- Cancellation rate
- On-time completion
- Service history

Example:
Trust Score: 92/100

Show:
Identity Verified
Skills Verified
Certification Verified
124 Jobs Completed
98% Reliability

SKILL AND CERTIFICATION PASSPORT:

Every worker should have a professional digital Skill Passport.

Show:
- Skills
- Certifications
- Experience
- Verification
- Completed services
- Service quality

Example:
Ravi Kumar
Electrician

Skills:
House Wiring
Fan Installation
Switch Repair
Electrical Maintenance

Certifications:
ITI Electrical
Safety Training

Experience:
5 Years

Verification:
Verified by Cooperative

FAIR AND TRANSPARENT EARNINGS:

Create a transparent earnings breakdown.

Example:
Customer Paid: ₹500
Worker Earnings: ₹400
Cooperative Contribution: ₹50
Platform Sustainability Fee: ₹50

Do not hardcode these percentages permanently. Make them configurable.

Worker earnings dashboard should show:
- Today's earnings
- Weekly earnings
- Monthly earnings
- Completed jobs
- Average earnings per job
- Cooperative contribution
- Earnings history

WORKER WELFARE:

Create a Worker Welfare section showing:
- Jobs completed
- Working hours
- Weekly workload
- Average income
- Availability
- Cancellation rate
- Customer satisfaction

Example:
"Your workload this week is high. Consider marking some hours unavailable."

This is a workload-management feature and not medical advice.

SERVICE QUALITY SCORE:

Create a Service Quality Score based on:
- Customer rating
- On-time completion
- Repeat bookings
- Cancellation rate
- Complaint/dispute rate

Display:
Service Quality: Excellent

COMMUNITY DEMAND ANALYTICS:

Create analytics for Cooperative Managers showing:
- Most requested services
- Service demand by category
- Service demand by location
- Weekly trends
- Monthly trends

Example:
Electrical: 42 requests
Plumbing: 31 requests
Cleaning: 28 requests
Gardening: 19 requests

Do not expose private customer information.

URGENT SERVICE:

Allow customers to choose:
Normal Service
Urgent Service

Urgent service should prioritize available verified workers.

Examples:
- Water leakage
- Electrical fault
- Appliance failure
- Lock or maintenance issue

SMART FALLBACK:

If a selected worker rejects, becomes unavailable or does not respond, automatically show alternatives.

Example:
Preferred worker unavailable.

Recommended Alternatives:
Kumar — 94% match
Arun — 91% match
Suresh — 88% match

BOOKING SYSTEM:

Create a complete booking system.

Booking must contain:
- Customer
- Worker
- Cooperative
- Service
- Date
- Time
- Address
- Description
- Urgent flag
- Estimated price
- Final price
- Status
- Created timestamp
- Updated timestamp

Statuses:
PENDING
ACCEPTED
REJECTED
COMPLETED
CANCELLED
DISPUTED

Valid flow:
PENDING → ACCEPTED → COMPLETED → REVIEWED

Alternative:
PENDING → REJECTED

Cancellation:
PENDING → CANCELLED

Dispute:
COMPLETED → DISPUTED

Prevent invalid status transitions.

Use MySQL transactions for important multi-step booking and payment operations.

DIGITAL SERVICE RECEIPT:

After service completion, generate a professional digital receipt showing:
- Service
- Worker
- Cooperative
- Date
- Time
- Amount
- Status
- Rating

Example:
SERVICE COMPLETED
Electrical Repair
Ravi Kumar
Anna Nagar Electrical Workers Cooperative
₹500
Completed: 28 Aug 2026, 5:40 PM
Rating: 5 stars

RATINGS AND REVIEWS:

Only allow reviews after booking status is COMPLETED.

Rating:
1–5 stars

Review:
Text comment

Prevent duplicate reviews for the same booking.

Update:
- Average rating
- Trust Score
- Service Quality Score

DISPUTE SYSTEM:

Allow customers to raise disputes for eligible bookings.

Reasons:
- Service not completed properly
- Worker did not arrive
- Incorrect service
- Payment/service issue

Statuses:
OPEN
UNDER REVIEW
RESOLVED
REJECTED

NOTIFICATION SYSTEM:

Create an in-app notification system.

Examples:
Customer:
"Your booking has been accepted."

Worker:
"New service request received."

Cooperative:
"3 new service requests in your area."

Admin:
"5 workers are awaiting verification."

Store notifications in MySQL.

SEARCH AND DISCOVERY:

Search by:
- Worker name
- Skill
- Service
- Location
- Certification

Filters:
- Verified only
- Rating
- Experience
- Availability
- Distance
- Cooperative

Sort by:
- Best Match
- Highest Rated
- Most Experienced
- Nearest
- Most Reliable

ADMIN FEATURES:

Admin can:
- Login
- View dashboard
- View users
- View customers
- View workers
- View cooperatives
- View pending verification
- Verify workers
- Reject workers
- Manage services
- Activate/deactivate services
- View bookings
- View disputes
- View statistics
- View platform analytics

Admin dashboard should show:
- Total Customers
- Total Workers
- Verified Workers
- Pending Verification
- Total Cooperatives
- Total Bookings
- Completed Bookings
- Active Bookings
- Average Rating
- Open Disputes

WORKER VERIFICATION:

Registration flow:
Register
→ Profile Created
→ Pending Verification
→ Admin/Cooperative Verification
→ Verified

Only verified workers should appear in public worker search.

Clearly display:
Verified Worker

MYSQL DATABASE:

Create these tables at minimum:

users
workers
cooperatives
cooperative_members
services
worker_services
certifications
worker_certifications
availability
bookings
reviews
payments
notifications
disputes
service_demand

users table:
id, name, email, password_hash, phone, role, address, city, state, pincode, latitude, longitude, is_active, created_at, updated_at

workers table:
id, user_id, bio, experience_years, service_radius, verification_status, trust_score, reliability_score, average_rating, total_completed_jobs, profile_completion, created_at, updated_at

cooperatives table:
id, name, description, address, city, state, registration_number, manager_user_id, verification_status, average_rating, created_at, updated_at

cooperative_members table:
id, cooperative_id, worker_id, membership_status, joined_at

services table:
id, name, category, description, base_price, is_active, created_at, updated_at

worker_services:
id, worker_id, service_id

certifications:
id, name, issuing_organization, description, created_at

worker_certifications:
id, worker_id, certification_id, certificate_number, issue_date, expiry_date, verification_status, verified_by, verified_at

availability:
id, worker_id, day_of_week, start_time, end_time, is_available

bookings:
id, customer_id, worker_id, cooperative_id, service_id, booking_date, start_time, end_time, address, description, is_urgent, estimated_price, final_price, status, created_at, updated_at

reviews:
id, booking_id, customer_id, worker_id, rating, comment, created_at

payments:
id, booking_id, customer_amount, worker_amount, cooperative_amount, platform_amount, payment_status, payment_method, transaction_reference, created_at

notifications:
id, user_id, title, message, type, is_read, created_at

disputes:
id, booking_id, raised_by, reason, description, status, resolution, resolved_by, resolved_at, created_at, updated_at

service_demand:
id, service_id, cooperative_id, city, demand_count, period_start, period_end

Use proper foreign keys and indexes.

Use UNIQUE constraints where appropriate, especially for:
- User email
- Worker/service relationship
- Cooperative/worker membership
- Review per booking

Create:
database/schema.sql
database/seed.sql

Use realistic demo data with Indian names and locations, but do not use real people's personal information.

DATABASE CONNECTION:

Use mysql2/promise.

Use a connection pool.

Environment variables:
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET

Never hardcode credentials.

Create .env.example.

AUTHORIZATION:

Customer cannot access admin pages.
Worker cannot verify workers.
Cooperative Manager cannot access platform-wide admin controls.
Only authorized users can verify workers.

FRONTEND PAGES:

Public:
- Home
- Services
- Workers
- Worker Profile
- Cooperatives
- How It Works
- About
- Login
- Register

Customer:
- Dashboard
- Find Services
- Find Workers
- Worker Profile
- Booking
- My Bookings
- Booking Details
- Favorites
- Reviews
- Notifications
- Profile

Worker:
- Dashboard
- My Profile
- Skill Passport
- Certifications
- Availability
- Incoming Requests
- My Bookings
- Earnings
- Trust Score
- Welfare
- Notifications

Cooperative:
- Dashboard
- Members
- Service Requests
- Assignments
- Bookings
- Earnings
- Demand Analytics
- Performance
- Cooperative Profile

Admin:
- Dashboard
- Workers
- Verification
- Customers
- Cooperatives
- Services
- Bookings
- Disputes
- Analytics

DESIGN AND VISUAL IDENTITY:

Make the website premium, modern, trustworthy, human-centered and community-focused.

The design must communicate:
Trust
Community
Cooperation
Technology
Transparency
Reliability

Use a distinctive Deep Teal + Emerald + Warm Amber colour palette.

Primary Deep Teal:
#0F4C5C

Secondary Cooperative Emerald:
#2E8B70

Accent Warm Amber:
#F4B942

Light background:
#F7F9F7

White surface:
#FFFFFF

Dark text:
#172326

Muted text:
#667477

Border:
#DCE5E3

Use amber primarily for ratings, highlights and attention states, not as the main button colour.

Use emerald for verified, successful and available states.

Use a muted red such as #D9534F for errors and rejected states.

Do not rely on colour alone to communicate status; also use icons and text.

TYPOGRAPHY:

Use Inter.

Fallback:
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

Use strong visual hierarchy with bold H1/H2 headings, semibold card headings and comfortable body text.

DESIGN STYLE:

Use:
- Clean layouts
- Generous whitespace
- Modern cards
- Subtle shadows
- Soft borders
- Moderate rounded corners
- Clear visual hierarchy
- Consistent spacing
- Professional icons

Avoid:
- Excessive gradients
- Excessive glassmorphism
- Giant shadows
- Excessive animations
- Childish UI
- Generic AI templates

DARK MODE:

Implement a complete Light/Dark/System theme switcher.

Dark background:
#0B1517

Dark surface:
#122124

Elevated surface:
#172B2E

Dark border:
#284044

Dark primary text:
#F1F7F5

Dark secondary text:
#A8B8B7

Do not simply invert colours. Design a proper dark theme.

Store theme preference in localStorage.

Default to system preference.

NAVBAR:

Create a professional sticky navbar.

Show:
CoServe logo
Home
Services
Find Workers
Cooperatives
How It Works
Notifications
Theme Switcher
Profile

Show appropriate options depending on the user's role.

Use a mobile hamburger menu on small screens.

COSERVE LOGO:

Create a simple abstract logo representing connection, cooperation and service.

Avoid a generic handshake icon.

Create both full logo and compact icon version.

LANDING PAGE:

Hero headline:
Trusted Services. Empowered Workers. Stronger Communities.

Supporting text:
Connect with verified skilled workers from cooperative societies for reliable household and community services.

Primary CTA:
Find a Service

Secondary CTA:
Join as a Worker

Include sections for:
- How It Works
- Why CoServe
- Verified Workers
- Cooperative Model
- Popular Services
- Smart Matching
- Trust and Verification
- Worker Benefits
- Cooperative Benefits
- Fair Earnings
- Community Impact
- Testimonials
- Final CTA

The cooperative nature of CoServe must be obvious within the first few seconds.

HERO VISUAL:

Instead of relying entirely on stock photos, create a product-style UI composition showing a verified worker.

Example:
Ravi Kumar
Electrician
Verified
4.9 rating
Trust Score 92
Match Score 94%
2.4 km away
Available Today
Anna Nagar Electrical Workers Cooperative

Add small floating indicators such as:
2.4 km away
Available Today
124 Jobs Completed

WORKER CARD:

Every worker card should clearly show:
- Name
- Photo/avatar
- Service
- Verified badge
- Rating
- Trust Score
- Experience
- Distance
- Availability
- Cooperative
- Match Score
- Book button

Make the Match Score and Trust Score visually prominent.

TRUST SCORE:

Use a circular progress indicator:
92/100

Show:
Identity Verified
Skills Verified
Certification Verified
124 Jobs
98% Reliability

SMART MATCHING UI:

When searching, show:
"Finding the best verified workers..."

Then display:
Smart Match Results

Each result should show:
Match percentage
Why matched
Verification
Rating
Distance
Experience
Availability

Make this feature visually impressive because it is one of the main hackathon differentiators.

DASHBOARD DESIGN:

Use:
Sidebar
Topbar
Page header
Statistics cards
Main content
Analytics

Desktop should have a collapsible sidebar.

Mobile should use a drawer or bottom navigation.

CUSTOMER DASHBOARD:

Show:
- Welcome message
- Search
- Upcoming booking
- Active bookings
- Completed services
- Recommended workers
- Recent activity

WORKER DASHBOARD:

Show:
- Verification
- Profile completion
- Trust Score
- Today's jobs
- Pending requests
- Completed jobs
- Today's earnings
- Monthly earnings
- Rating

COOPERATIVE DASHBOARD:

Make this visually impressive.

Show:
- Members
- Verified members
- Active jobs
- Completed jobs
- Monthly earnings
- Average rating
- Open disputes
- Service demand

Include charts for:
- Service demand
- Worker performance
- Monthly jobs
- Earnings
- Verification status

ADMIN DASHBOARD:

Show:
- Users
- Workers
- Verified workers
- Pending verification
- Cooperatives
- Bookings
- Completed services
- Disputes
- Ratings
- Platform statistics

MOBILE UX:

The website must be genuinely mobile-first.

Use:
- Large touch targets
- Responsive cards
- Mobile navigation
- Collapsible filters
- Mobile-friendly forms
- Sticky booking CTA
- Responsive tables
- Mobile date/time selection

Minimum touch target should be approximately 44px.

BOOKING EXPERIENCE:

Make booking a multi-step flow:

Service
→ Worker
→ Schedule
→ Details
→ Confirm

Show progress clearly.

Do not use one giant form.

LOADING STATES:

Use skeleton loaders for:
- Worker cards
- Service cards
- Dashboards
- Tables
- Profiles
- Charts

Use button states such as:
Booking...
Saving...
Verifying...

EMPTY STATES:

Every empty list should have a helpful message and CTA.

Example:
No Upcoming Bookings
"You don't have any upcoming services yet."
Find a Service →

ERROR STATES:

Use friendly error messages:
Something went wrong.
We couldn't load your bookings.
Try Again

Never expose raw database or server errors.

SUCCESS FEEDBACK:

Use professional confirmation screens and toast notifications.

Example:
Booking Confirmed
Your service request has been sent to Ravi Kumar.
Booking ID: CS-10284

MICRO-INTERACTIONS:

Add subtle 150–300ms animations for:
- Hover
- Buttons
- Cards
- Modals
- Toasts
- Progress
- Match Score
- Dashboard statistics

Respect prefers-reduced-motion.

SEARCH UX:

Make search fast and intelligent.

Include:
- Search suggestions
- Recent searches
- Popular services
- Result count
- Clear filters

Show active filters as removable chips.

FAVORITES:

Allow customers to favorite workers and services.

Create a My Favorites section.

NOTIFICATIONS:

Create a professional notification center with:
- Unread count
- Grouping by date
- Notification icons
- Mark as read
- Mark all as read

PROFILE COMPLETION:

Show:
Profile 85% Complete

with a progress bar and Complete Profile button.

ACHIEVEMENTS:

Use professional badges:
- Trusted Worker
- Top Rated
- Reliable Service
- Community Contributor
- Verified Skill
- 100+ Jobs

Do not make the interface childish.

COMMUNITY IMPACT:

Create a visual impact section with sample/demo statistics:

1,240 Services Completed
380 Verified Workers
24 Cooperatives
18 Communities Served
₹4.8L Worker Earnings Generated

Clearly mark statistics as demo data if they are not real.

ACCESSIBILITY:

Implement:
- Semantic HTML
- Keyboard navigation
- Good contrast
- Focus states
- Accessible labels
- Screen-reader-friendly controls
- ARIA labels where needed
- Reduced motion support

FORMS:

Use:
- Clear labels
- Required indicators
- Inline validation
- Error messages
- Success states
- Password visibility toggle
- Correct input types

Do not rely only on placeholders.

CONTEXTUAL HELP:

Add tooltips for:
Trust Score
Match Score
Cooperative Contribution
Verification

USER EXPERIENCE:

Every screen must make it obvious:
1. Where the user is
2. What they can do
3. What happened
4. What they should do next

Primary actions should be visually dominant.

CUSTOMER:
Find a Service

WORKER:
View Requests

COOPERATIVE:
Manage Members

ADMIN:
Verify Workers

FIRST-TIME ONBOARDING:

Customer onboarding:
Location
Service interests
Preferences

Worker onboarding:
Skills
Experience
Certifications
Availability
Cooperative

Cooperative Manager onboarding:
Cooperative details
Services
Members

Allow optional steps to be skipped.

PROJECT STRUCTURE:

Use:

frontend/
src/
components/
pages/
layouts/
services/
context/
hooks/
utils/
assets/
App.jsx
main.jsx

backend/
controllers/
routes/
middleware/
services/
config/
utils/
seed/
server.js
package.json
.env.example

database/
schema.sql
seed.sql

README.md
.gitignore

BACKEND ARCHITECTURE:

Routes
→ Middleware
→ Controllers
→ Services
→ Database Queries
→ MySQL

Do not put all business logic inside routes.

Use reusable service functions.

API ENDPOINTS:

Authentication:
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Services:
GET /api/services
GET /api/services/:id

Workers:
GET /api/workers
GET /api/workers/:id
POST /api/workers/profile
PUT /api/workers/profile

Bookings:
POST /api/bookings
GET /api/bookings
GET /api/bookings/:id
PUT /api/bookings/:id/accept
PUT /api/bookings/:id/reject
PUT /api/bookings/:id/complete
PUT /api/bookings/:id/cancel

Reviews:
POST /api/reviews
GET /api/workers/:workerId/reviews

Matching:
POST /api/matching/recommend

Cooperatives:
GET /api/cooperatives
GET /api/cooperatives/:id
POST /api/cooperatives
PUT /api/cooperatives/:id
GET /api/cooperatives/:id/members
POST /api/cooperatives/:id/members

Notifications:
GET /api/notifications
PUT /api/notifications/:id/read

Disputes:
POST /api/disputes
GET /api/disputes
PUT /api/disputes/:id/status

Earnings:
GET /api/earnings
GET /api/earnings/summary

Admin:
GET /api/admin/stats
GET /api/admin/workers/pending
PUT /api/admin/workers/:id/verify
PUT /api/admin/workers/:id/reject
GET /api/admin/users
GET /api/admin/bookings
GET /api/admin/disputes

SECURITY:

Implement:
- JWT
- bcrypt
- Role-based authorization
- Input validation
- Protected routes
- CORS
- Environment variables
- Parameterized SQL queries
- SQL injection protection
- Proper HTTP status codes
- Secure error handling

Never expose:
- Passwords
- JWT secrets
- Database credentials
- API keys

PERFORMANCE:

Implement:
- Lazy loading
- Code splitting where appropriate
- Pagination
- Debounced search
- Efficient queries
- MySQL indexes
- Connection pooling
- Loading states
- Avoid unnecessary API requests

HACKATHON DEMO:

The seeded application should support this complete demonstration:

Customer logs in
→ searches "Electrician"
→ sees verified workers
→ opens worker profile
→ sees Skill Passport
→ sees Certification
→ sees Trust Score
→ sees Match Score
→ books worker
→ worker receives booking
→ worker accepts
→ customer sees booking confirmation
→ worker completes service
→ customer receives digital receipt
→ customer gives rating
→ Trust Score/Service Quality updates
→ cooperative dashboard updates
→ admin dashboard reflects platform activity

Provide demo accounts for:
Customer
Worker
Cooperative Manager
Admin

Create realistic seeded demo data.

COMMUNITY IMPACT:

The application should clearly demonstrate that CoServe creates value for three sides:

CUSTOMERS:
Reliable and verified services.

WORKERS:
More opportunities, fairer earnings, visibility and welfare support.

COOPERATIVES:
Digital management, workforce coordination, demand analytics and community growth.

FINAL DESIGN MESSAGE:

The website should make a judge immediately understand:

"CoServe is not just another service-booking platform. It is a cooperative digital service ecosystem."

The central journey should visually and functionally be:

Customer
→ Smart Match
→ Verified Worker
→ Cooperative
→ Booking
→ Service
→ Transparent Earnings
→ Review
→ Community Impact

IMPORTANT DEVELOPMENT RULE:

Build the application in phases.

Do NOT generate the entire project at once.

PHASE 1 ONLY:
Create:
- Complete folder structure
- React setup
- Express setup
- MySQL connection
- MySQL connection pool
- Environment configuration
- Database health-check API
- React Router
- Professional base layout
- Navbar
- Sidebar structure
- Design system
- Light/dark/system theme
- Base reusable UI components
- Database configuration
- Installation instructions

Then STOP.

Do not build authentication, booking, dashboards or advanced features yet.

Wait for my confirmation before proceeding to Phase 2.

IMPORTANT FINAL REQUIREMENT:

The final application must be a real working full-stack MVP, not a static prototype.

Do not use MongoDB.
Do not use Mongoose.
Do not use TypeScript.
Do not create fake APIs.
Do not hardcode all application data inside React.
Do not use raw SQL string concatenation with user input.
Do not leave major functionality as TODOs.

Use clean, modular, maintainable JavaScript code.

Prioritize the working MVP over unnecessary complexity.

START WITH PHASE 1 ONLY.