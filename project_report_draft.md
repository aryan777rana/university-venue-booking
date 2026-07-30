# JUIT VenueHub: A Smart Campus Space Reservation & Availability Tracker
**Project Report Draft (Work Completed to Date)**

* **Course**: B.Tech Project (Draft Report)
* **Student Name**: Aryan Rana
* **Affiliation**: Jaypee University of Information Technology (JUIT)

---

## Abstract
Modern educational campuses manage a large inventory of shared infrastructural resources, including auditoriums, seminar halls, meeting rooms, and departmental classrooms. Coordinating reservations across multiple roles (Students, Faculty, and Administrators) while avoiding overlaps with pre-scheduled academic timetables is a complex scheduling challenge. 

This report presents **JUIT VenueHub**, a lightweight, robust web-based resource reservation system. It integrates a Zero-Dependency Python backend, a PostgreSQL/SQLite database layer, a dynamic five-day Week Calendar grid, and a real-time scheduling conflict visualizer. The system has been successfully containerized and deployed publicly on Railway. It demonstrates a scalable, secure, and user-friendly architecture for campus space allocation.

---

## 1. Introduction and Objectives

### 1.1 Background
Jaypee University of Information Technology (JUIT) schedules classes, club workshops, guest lectures, and cultural fests across dozens of campus spaces daily. Traditionally, the reservation process involves manual paperwork, verbal permissions, or simple spreadsheets maintained independently by the Estate Office and various Academic Departments. This fragmented approach leads to double-bookings, conflicts with standard class schedules, and zero real-time visibility for students and faculty.

### 1.2 Problem Statement
A lack of centralization in university venue scheduling results in:
1. **Academic Disruptions**: Standard academic classes get locked out of scheduled rooms due to ad-hoc club events.
2. **Double-Bookings**: Multiple clubs or faculty members reserve the same hall for the same slot due to lack of coordination.
3. **No Notice Enforcement**: Bookings are cancelled last-minute, causing wastage of empty venues that could have been utilized by other applicants.
4. **Poor Attendance Verification**: Booking entities fail to report, leaving booked venues locked and unused.

### 1.3 Project Objectives
The core objectives of the JUIT VenueHub system are:
* **Real-time Status Visualization**: Display space utilization on a clean, interactive calendar grid with Day/Week view toggles.
* **Proactive Conflict Prevention**: Prevent bookings that overlap with standard academic timetables or approved guest events.
* **Multi-Role Authorization**: Provide tailored interfaces for Guests (view-only), Students/Faculty (request & check-in), Department heads/Estate Office (approve/reject/modify), and Admins (add/delete venues and customize rules).
* **Isolated Booking Histories**: Filter dashboard lists so users can manage their own reservations securely based on their email.
* **Simulated Clock Expirations & Attendance**: Implement a check-in feature using simulated QR codes that records event attendance and auto-cancels expired bookings.

---

## 2. Literature Review

### 2.1 Campus Resource Reservation Systems
Studies show that automated booking software increases venue utilization rates by up to 35% compared to paper-based logs. Many researchers advocate for serverless architectures or light web interfaces. However, campus scheduling requires coupling ad-hoc reservations with **rigid recurring schedules** (weekly lecture timetables). Integrating these two disparate forms of time-allocation requires specialized conflict-resolution rules.

### 2.2 Conflict Resolution Algorithms
In space reservation systems, conflict checking can be modeled as the **Interval Intersection Problem**:
* Given a new time interval $I_{new} = [t_{start}, t_{end}]$ on date $D$ for venue $V$, we must verify:
  $$\forall I_{existing} \in \text{Bookings}(V, D), \quad I_{new} \cap I_{existing} = \emptyset$$
* Similarly, for academic timetables, rooms are locked recurringly on specific weekdays.
Our implementation utilizes an efficient linear search filter over active daily slots, which is highly performant for typical university scale data ($<100$ venues, $<10,000$ bookings).

### 2.3 Database Layer Strategies
Modern microservices leverage cloud database backends. For rapid development, local file-based engines like **SQLite** are ideal. In production, SQLite has concurrency limitations when writing to the database file. Hence, a dual-layer strategy—using local SQLite for development and **PostgreSQL** in cloud production—ensures robust transactions, thread safety, and permanent storage.

---

## 3. System Design and Architecture

### 3.1 Overall Architecture
JUIT VenueHub is built using a **Client-Server Architecture** operating over HTTP REST endpoints.

```
       +--------------------------------------------+
       |             Client Interface               |
       |  (HTML5, CSS3, Vanilla JS, UI Components)  |
       +---------------------+----------------------+
                             |
                   HTTP GET / POST / PUT
                             |
       +---------------------v----------------------+
       |               Python Web Server            |
       |   (BaseHTTPRequestHandler, JSON Router)    |
       +---------------------+----------------------+
                             |
             SQL Queries (Dual-Engine Wrapper)
                             |
       +---------------------v----------------------+
       |   Production PostgreSQL  /  Local SQLite   |
       +--------------------------------------------+
```

### 3.2 Database Schema
The database contains two core tables: `venues` (space metadata) and `bookings` (reservation records).

#### Table 1: Venues Schema
| Column Name | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Unique string ID (e.g. `auditorium`) |
| `name` | TEXT | NOT NULL | Friendly venue title |
| `capacity` | INTEGER | NOT NULL | Seating capability limit |
| `type` | TEXT | NOT NULL | Category (e.g., Small, Medium, Large) |
| `approver` | TEXT | NOT NULL | Routing authority (`dept` or `estate`) |
| `description` | TEXT | NOT NULL | Description details |
| `facilities` | TEXT | NOT NULL | Comma-separated technical codes |
| `facilitiesLabels` | TEXT | NOT NULL | Comma-separated readable badges |
| `icon` | TEXT | NOT NULL | Embedded SVG markup for card graphics |

#### Table 2: Bookings Schema
| Column Name | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Unique ID (e.g., `B-102` or `B-REC-102-1`) |
| `venueId` | TEXT | NOT NULL, FK | Links to `venues.id` |
| `date` | TEXT | NOT NULL | Target Date (YYYY-MM-DD) |
| `startTime` | TEXT | NOT NULL | Time start string (HH:MM) |
| `endTime` | TEXT | NOT NULL | Time end string (HH:MM) |
| `requesterName` | TEXT | NOT NULL | User email address or name |
| `requesterRole` | TEXT | NOT NULL | Display role string |
| `purpose` | TEXT | NOT NULL | Description of the reservation |
| `expectedAttendees` | INTEGER | NOT NULL | Size of event crowd |
| `status` | TEXT | NOT NULL | `pending`, `approved`, `rejected`, `checkin` |
| `approverComments` | TEXT | | Comments left by HOD or Estate Office |
| `isRecurring` | INTEGER | NOT NULL | `1` (true) or `0` (false) |
| `recurrenceParent` | TEXT | | Link code to parent series |
| `checkedIn` | INTEGER | NOT NULL | `1` (true) or `0` (false) |

---

## 4. Implementation Methodology

### 4.1 Frontend Component Design
* **Availability Grid (Week View)**: A tabular grid displaying days (Mon-Fri) against hourly segments (09:00 - 18:00). It highlights statuses visually: Green (Available), Yellow (Pending), Red (Timetable Lock), and Blue (Approved).
* **Real-time Conflict Visualizer**: An event-driven form listener. As the user inputs booking details, it runs a client-side comparison against `state.bookings` and `state.timetable`. If an overlap exists, it displays an error banner and blocks submission.
* **Isolated Logins**: Restricts dashboard queries to the logged-in email, showing demo seed records only to `rajesh@juit.ac.in` and `amit@juit.ac.in`.

### 4.2 Backend Implementation
Written in standard Python using `http.server.BaseHTTPRequestHandler`. It contains:
1. **Dynamic Port Binding**: Reads `PORT` dynamically to allow local runs on port `8000` and automatic routing on cloud platforms.
2. **Unified Database Adapter**: Implements a connector wrapper:
   ```python
   def run_query(query, params=None, fetch=False, fetch_one=False):
       conn = get_connection()
       cursor = conn.cursor()
       if DATABASE_URL:
           query = query.replace('?', '%s') # Translate placeholder for PostgreSQL
       # Execution, commit, and connection close logic...
   ```

### 4.3 Cloud Deployment Strategy
1. **Git & GitHub Integration**: Track source files via a `.gitignore` configured to keep SQLite `database.db` files private.
2. **Railway Containerization**: Linked the GitHub repository to Railway, deploying the python web service and provisioning a PostgreSQL service.
3. **Public Networking**: Assigned a public domain name (`.up.railway.app`) to route HTTP traffic.

---

## 5. Current Progress and Results

### 5.1 Completed Features
All essential features of the JUIT VenueHub system have been successfully developed, integrated, and verified:
* **Interactive Day / Week Calendar Toggle**: Live grid updates.
* **Conflict Checking**: Fully operational on client forms and backend verification checks.
* **HOD & Estate Approvals Dashboard**: Supporting modifications, comments, approvals, and rejections.
* **Simulated QR Check-in**: Updates live statistic graphs on the Admin Dashboard showing space utilization rates.
* **Personalized history logs**: Separation of booking history based on sign-in email.

### 5.2 Deployment Status
The project is fully live and accessible at a public Railway domain. All database queries automatically read and write to the cloud PostgreSQL database permanently.

---

## 6. Future Scope and Conclusion

### 6.1 Future Work
In future iterations of the JUIT VenueHub, we plan to implement:
1. **Physical RFID / QR Scanner Integration**: Placing hardware scanners outside halls that interact with our check-in API to confirm attendance automatically.
2. **Timetable API integration**: Connecting JUIT's central ERP database to fetch live academic schedules directly.
3. **Predictive Utilization Analytics**: Using simple regression models to recommend timeslots with the lowest likelihood of conflict.

### 6.2 Conclusion
JUIT VenueHub successfully resolves a major campus administration bottleneck. By introducing real-time calendar grids, strict notice period controls, multi-role dashboard panels, and automated conflict checkers, JUIT can maximize venue utilization, prevent academic schedule disruptions, and automate coordination between students, faculty, and estate offices.
