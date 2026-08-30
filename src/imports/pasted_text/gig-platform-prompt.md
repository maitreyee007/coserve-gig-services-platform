## FULL DEVELOPMENT PROMPT — WORKER / CUSTOMER / ADMIN PLATFORM

Build a complete, modern, responsive web application for a **Cooperative Gig Services Platform for Household & Community Services**.

The platform connects customers who need household services with verified workers such as electricians, plumbers, carpenters, cleaners, painters, appliance repair workers, etc.

The application must have **three separate user roles: Customer, Worker, and Admin**, with role-based authentication and dashboards.

### 1. LANDING / LOGIN PAGE

Create a professional landing page with a strong hero section explaining the platform.

Primary CTA:

**"Find a Trusted Worker"**

The login/signup section must clearly provide three options:

* 👤 Customer
* 🛠️ Worker
* 🛡️ Admin

Use attractive cards/buttons for the three roles.

When a user selects a role, take them to the appropriate login/register flow.

Do NOT make the three roles look like completely separate applications. They should feel like different user experiences within the same platform.

---

# 2. CUSTOMER FLOW

The customer should be able to:

* Register/login
* Enter their location
* Browse available workers
* Search workers
* Filter workers
* View worker profiles
* Book a worker
* Make emergency service requests
* Track bookings
* Cancel bookings
* Verify worker arrival using OTP
* Rate workers
* Submit complaints

### Customer Worker Listing

Display workers as professional cards containing:

* Profile photo
* Worker name
* Service/category
* Years of experience
* Rating ⭐
* Number of completed jobs
* Current availability
* Starting/base rate
* Location
* Verification badge
* "View Profile"
* "Book Now"

Add filters:

* Service
* Location
* Price range
* Experience
* Rating
* Availability

Add a price preference:

**Affordable → Standard → Premium**

The customer should be able to choose workers based on their preferred price range.

---

# 3. WORKER REGISTRATION

When the user clicks **Worker**, provide:

**"Register as a Worker"**

Create a detailed but clean registration form.

Required fields:

* Full Name
* Phone Number
* Email
* Aadhaar Number
* Address
* Location
* Service Category
* Skills
* Years of Experience
* Base Rate
* Profile Photo
* Availability
* Short Bio

Example service categories:

* Electrician
* Plumber
* Carpenter
* Painter
* Cleaner
* AC Technician
* Appliance Repair
* Mason
* Gardener
* Other

### Aadhaar Security

NEVER display the complete Aadhaar number publicly.

After registration, mask it:

`XXXX XXXX 4821`

Only authorized admins should be able to access verification information.

Add:

**Verification Status**

* Pending
* Verified
* Rejected

A worker should NOT appear publicly on the customer page until their profile is approved/verified by Admin.

---

# 4. WORKER PROFILE

After registration, create a professional worker profile.

Worker profile should contain:

* Profile photo
* Name
* Service
* Experience
* Skills
* Location
* Rating
* Completed jobs
* Base rate
* Availability
* Verification status
* About/Bio

Buttons:

**Edit Profile**

**Look for Jobs**

**Manage Availability**

**View Earnings**

**View Reviews**

**View Complaints**

---

# 5. IMPORTANT: SHARED WORKER DATA

THIS IS CRITICAL.

Do NOT create separate hardcoded worker lists for the Customer page and Worker page.

Create ONE centralized Worker data model/database.

The same worker records must be used throughout the application.

For example:

```text
Worker Database
      ↓
 ┌────┼───────────────┐
 ↓    ↓               ↓
Customer Page     Worker Dashboard     Admin Dashboard
(View)            (Edit own profile)   (Manage)
```

If a worker edits their:

* Name
* Rate
* Experience
* Skills
* Availability
* Profile photo
* Bio
* Service

the updated information must automatically appear on the Customer worker listing and Admin worker management page.

Example:

If Ravi changes:

`Rate: ₹500 → ₹400`

the customer page must immediately show:

`Starting from ₹400`

Do NOT duplicate worker data.

Use a unique `workerId` for every worker.

---

# 6. WORKER DASHBOARD

Create a dashboard specifically for workers.

Dashboard sections:

### Overview

Display:

* Total jobs
* Pending requests
* Completed jobs
* Current earnings
* Rating
* Active complaints
* Availability status

### Look for Jobs

Show available customer requests.

Each job card should display:

* Service required
* Customer location
* Date/time
* Estimated payment
* Distance
* Job description
* Emergency badge if applicable

Buttons:

**Accept Job**

**Reject**

**View Details**

### My Jobs

Tabs:

* Pending
* Accepted
* In Progress
* Completed
* Cancelled

### Earnings

Display:

* Today's earnings
* Weekly earnings
* Monthly earnings
* Total earnings

### Ratings

Show customer reviews and average rating.

### Complaints

Workers can view complaints associated with their jobs.

### Profile

Allow worker to edit their profile.

---

# 7. DYNAMIC WORKER RATE SYSTEM

Implement a worker rating/rate mechanism.

Each worker has a base rate.

Example:

```text
Worker A
Base Rate: ₹300
Rating: 4.8 ⭐

Worker B
Base Rate: ₹450
Rating: 4.6 ⭐

Worker C
Base Rate: ₹650
Rating: 4.9 ⭐
```

If a worker receives a valid customer complaint or repeated poor ratings, their platform trust/rate score can be adjusted.

Display this transparently.

Do not automatically punish workers solely because of one complaint.

Admin should be able to review complaints before applying penalties.

---

# 8. CANCELLATION / EXTRA CHARGE LOGIC

Implement the platform's cancellation policy.

If a customer cancels a booking midway/after the worker has started travelling or working:

* Calculate a cancellation charge
* Record the cancellation
* Compensate the worker according to the platform policy

If a worker repeatedly causes cancellations or receives validated complaints:

* Flag the worker for Admin review
* Adjust their platform ranking/rate if appropriate

Make all such adjustments visible in Admin analytics.

---

# 9. EMERGENCY SERVICE

Add a highly visible:

**🚨 EMERGENCY SERVICE**

button on the customer dashboard.

Use cases:

* Water leakage
* Electrical short circuit
* Power failure
* Gas/plumbing emergency
* Appliance failure
* Other urgent household problems

When clicked:

1. Ask the customer to select the emergency type.
2. Automatically use their saved/current location.
3. Show nearby available verified workers.
4. Prioritize workers who are currently available.
5. Show estimated arrival time.
6. Allow the customer to request immediate service.

Emergency bookings should be visually distinguished from normal bookings.

---

# 10. ADMIN DASHBOARD

Create a powerful Admin Dashboard.

Admin can administer BOTH customers and workers.

### Admin Overview

Display:

* Total customers
* Total workers
* Verified workers
* Pending workers
* Active bookings
* Completed bookings
* Cancelled bookings
* Emergency requests
* Total complaints
* Revenue/platform earnings

Use clean charts and statistics.

---

# 11. ADMIN — MANAGE WORKERS

Create a complete worker management table.

Columns:

* Profile
* Name
* Service
* Phone
* Experience
* Rate
* Rating
* Jobs completed
* Verification
* Availability
* Status
* Actions

Actions:

**View**

**Edit**

**Verify**

**Reject**

**Suspend**

**Activate**

**View Complaints**

**View Bookings**

Important:

The workers displayed here must be the EXACT SAME workers displayed on the Customer page.

Admin editing a worker's information must update the shared worker record.

---

# 12. ADMIN — MANAGE CUSTOMERS

Create a customer management page.

Display:

* Customer name
* Phone
* Email
* Location
* Number of bookings
* Completed bookings
* Cancelled bookings
* Complaints
* Account status

Actions:

* View
* Edit
* Suspend
* Activate

---

# 13. ADMIN — COMPLAINT MANAGEMENT

Create a complaint management system.

Each complaint should contain:

* Complaint ID
* Customer
* Worker
* Booking ID
* Complaint type
* Description
* Date
* Status

Statuses:

* Pending
* Under Review
* Resolved
* Rejected

Admin should be able to investigate complaints and take appropriate action.

---

# 14. BOOKING SYSTEM

Create a complete booking flow.

Customer:

**Select Worker → Choose Service → Select Date/Time → Confirm Location → View Estimated Cost → Confirm Booking**

Generate a unique Booking ID.

Booking statuses:

```text
Requested
↓
Accepted
↓
Worker On The Way
↓
Arrived
↓
OTP Verification
↓
In Progress
↓
Completed
↓
Rating / Review
```

---

# 15. OTP VERIFICATION

When the worker arrives:

Generate a 4–6 digit OTP.

The customer sees the OTP.

Worker enters the OTP.

Only after successful verification should the booking move to:

**In Progress**

For the MVP, mock OTP generation/verification is acceptable, but structure the code so a real SMS/OTP service can be integrated later.

---

# 16. ROLE-BASED ACCESS

Implement proper role-based routing.

Customer cannot access Worker/Admin dashboard.

Worker cannot access Admin dashboard.

Admin can access worker and customer management.

Example:

```text
Customer
→ /customer/*

Worker
→ /worker/*

Admin
→ /admin/*
```

Protect routes based on authentication and role.

---

# 17. UI / UX DESIGN

Make the application look like a real startup product, NOT a basic college project.

Design style:

* Modern
* Clean
* Professional
* Trustworthy
* Responsive
* Mobile-friendly
* Accessible
* Smooth animations
* Rounded cards
* Clean typography
* Consistent spacing
* Professional dashboard layouts

Use clear visual hierarchy.

Use badges for:

* Verified
* Available
* Busy
* Emergency
* Pending
* Completed
* Suspended

Use icons where appropriate.

Do not overcrowd the interface.

---

# 18. RESPONSIVE DESIGN

The application must work properly on:

* Desktop
* Laptop
* Tablet
* Mobile

Customer booking flow should be especially mobile-friendly because customers may need emergency services from their phones.

---

# 19. DATA MODEL

Create a centralized data structure/database for:

### Users

```text
userId
name
email
phone
password/auth
role
status
createdAt
```

### Workers

```text
workerId
userId
name
phone
email
aadhaarMasked
service
skills
experience
location
baseRate
rating
completedJobs
availability
profilePhoto
bio
verificationStatus
accountStatus
createdAt
updatedAt
```

### Customers

```text
customerId
userId
name
phone
email
location
address
createdAt
```

### Bookings

```text
bookingId
customerId
workerId
service
location
date
time
estimatedCost
status
otp
isEmergency
createdAt
```

### Reviews

```text
reviewId
bookingId
customerId
workerId
rating
comment
createdAt
```

### Complaints

```text
complaintId
bookingId
customerId
workerId
type
description
status
adminAction
createdAt
```

---

# 20. MVP REQUIREMENT

This is a hackathon MVP.

Prioritize functionality and a polished demo over unnecessary complexity.

If a real backend/database is not available, implement a clean mock-data/service layer using localStorage or JSON data so the complete workflow can be demonstrated.

However, structure the application so the mock service can later be replaced with:

* Firebase
* Supabase
* Node.js/Express
* MySQL

without rewriting the entire frontend.

---

# 21. DEMO DATA

Pre-populate the application with realistic demo workers.

Examples:

```text
Ravi Kumar
Electrician
5 years experience
₹400 starting rate
4.8 ⭐
Verified
Available

Arun Raj
Plumber
7 years experience
₹350 starting rate
4.6 ⭐
Verified
Available

Meena Devi
Cleaner
4 years experience
₹250 starting rate
4.9 ⭐
Verified
Available

Suresh Kumar
Carpenter
8 years experience
₹600 starting rate
4.7 ⭐
Verified
Busy
```

These workers must appear on:

**Customer → Find Workers**

**Worker/Admin → Worker Management**

using the SAME underlying data.

---

# 22. DEMO LOGIN

For the hackathon demo, provide clearly marked demo accounts or a demo-role selector.

Example:

```text
Customer Demo
Worker Demo
Admin Demo
```

Do not expose real passwords or sensitive information.

---

# 23. TECH STACK

Use:

* React
* Vite
* JavaScript
* HTML
* CSS
* React Router
* Modern component architecture

Use reusable components.

Suggested components:

```text
Navbar
Sidebar
WorkerCard
WorkerGrid
WorkerProfile
BookingModal
FilterPanel
RatingStars
StatusBadge
EmergencyButton
DashboardCard
WorkerTable
CustomerTable
ComplaintTable
```

Keep the code organized and maintainable.

---

# 24. FINAL QUALITY REQUIREMENT

The final application should feel like a **real service marketplace platform** that could be presented to judges.

The most important functional relationship is:

```text
                    SHARED WORKER DATABASE
                            │
          ┌─────────────────┼─────────────────┐
          ↓                 ↓                 ↓
      CUSTOMER           WORKER             ADMIN
       PAGE             DASHBOARD          DASHBOARD
          │                 │                 │
      View Worker       Edit Profile       Manage Worker
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ↓
                     SAME WORKER RECORD
```

A worker must never have duplicate profiles.

If a worker updates their profile, the change must propagate everywhere.

Build the application completely, connect all navigation and buttons, ensure there are no broken routes, and make the entire customer → worker → booking → OTP → completion → rating → complaint → admin workflow demonstrable from start to finish.

Do not leave major buttons as non-functional placeholders.

Focus on a polished, realistic, hackathon-ready MVP.
