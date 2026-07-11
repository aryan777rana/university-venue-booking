import http.server
import socketserver
import json
import os
import urllib.parse
import sys

PORT = 8000
DB_FILE = 'database.db'
DATABASE_URL = os.environ.get('DATABASE_URL')

def get_connection():
    if DATABASE_URL:
        import psycopg2
        return psycopg2.connect(DATABASE_URL)
    else:
        import sqlite3
        return sqlite3.connect(DB_FILE)

def run_query(query, params=None, fetch=False, fetch_one=False):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Translate SQLite ? placeholders to PostgreSQL %s placeholders if using PostgreSQL
    if DATABASE_URL:
        query = query.replace('?', '%s')
        
    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
            
        if fetch:
            res = cursor.fetchall()
        elif fetch_one:
            res = cursor.fetchone()
        else:
            conn.commit()
            res = True
        return res
    except Exception as e:
        print(f"Database Query Error on [{query}]: {e}")
        raise e
    finally:
        conn.close()

def init_db():
    # Create venues table
    run_query('''
        CREATE TABLE IF NOT EXISTS venues (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            capacity INTEGER NOT NULL,
            type TEXT NOT NULL,
            approver TEXT NOT NULL,
            description TEXT NOT NULL,
            facilities TEXT NOT NULL,
            facilitiesLabels TEXT NOT NULL,
            icon TEXT NOT NULL
        )
    ''')
    
    # Create bookings table
    run_query('''
        CREATE TABLE IF NOT EXISTS bookings (
            id TEXT PRIMARY KEY,
            venueId TEXT NOT NULL,
            date TEXT NOT NULL,
            startTime TEXT NOT NULL,
            endTime TEXT NOT NULL,
            requesterName TEXT NOT NULL,
            requesterRole TEXT NOT NULL,
            purpose TEXT NOT NULL,
            expectedAttendees INTEGER NOT NULL,
            status TEXT NOT NULL,
            approverComments TEXT,
            isRecurring INTEGER NOT NULL,
            recurrenceParent TEXT,
            checkedIn INTEGER NOT NULL
        )
    ''')

    # Seed default venues if empty
    count_venues = run_query("SELECT COUNT(*) FROM venues", fetch_one=True)[0]
    if count_venues == 0:
        default_venues = [
            ("auditorium", "Main Auditorium", 500, "Large", "estate", "The primary venue for major cultural events, guest lectures, and university assemblies.", "projector,ac,mic", "Stage Projector,Central AC,Professional Audio System,Tiered Theater Seating", '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19h16v2H4zm16-4V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0-2-.9-2-2zM9 9l6 3-6 3V9z"/></svg>'),
            ("seminar-1", "Seminar Hall - 1", 120, "Medium", "dept", "Modern lecture and presentations hall, ideal for academic symposiums and club workshops.", "projector,ac,mic", "4K Projector,Split AC,Podium Microphone,Dual Smart-Boards", '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>'),
            ("seminar-2", "Seminar Hall - 2", 120, "Medium", "dept", "Academic presentation hall equipped with standard presentation technology.", "projector,ac,mic", "Full HD Projector,Split AC,Handheld Mics,Fixed Desk Seating", '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>'),
            ("conference", "Executive Conference Room", 30, "Small", "estate", "Premium conference space for administrative, departmental, and visiting faculty board meetings.", "projector,ac", "LED TV Output,Central AC,Boardroom Seating,Video Conferencing Setup", '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2"/></svg>'),
            ("amphitheatre", "Open-Air Amphitheatre", 1000, "Large", "estate", "Open environment venue designed for massive audience attendance, street plays, and fest activities.", "mic", "Outdoor Sound System,Spacious Steps Seating,Ambient Lighting", '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10A10 10 0 0 0 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-1.12.23-2.18.64-3.15L13 14.88v5.05zM17.36 17c-.6.6-1.3 1.07-2.1 1.39l-4.14-4.14 6.24-6.24v9z"/></svg>'),
            ("sports", "Sports Complex Court", 150, "Medium", "estate", "Indoor sports complex court accommodating sports activities and large student physical gatherings.", "", "Indoor Sports Floor,High Ceiling,Floodlights", '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM6.7 6.7l10.6 10.6"/></svg>'),
            ("cr-101", "Departmental Classroom 101", 60, "Medium", "dept", "Equipped lecture room primarily used for non-teaching club actions outside regular class schedules.", "projector,ac", "Projector Screen,High wall ACs,Standard Seating", '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 17v-2a3 3 0 0 1 6 0v2"/></svg>'),
            ("cr-102", "Departmental Classroom 102", 60, "Medium", "dept", "Equipped lecture room primarily used for non-teaching departmental workshops or tutorials.", "projector,ac", "Projector Screen,High wall ACs,Standard Seating", '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 17v-2a3 3 0 0 1 6 0v2"/></svg>')
        ]
        for v in default_venues:
            run_query("INSERT INTO venues VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", v)

    # Seed default bookings if empty
    count_bookings = run_query("SELECT COUNT(*) FROM bookings", fetch_one=True)[0]
    if count_bookings == 0:
        import datetime
        today_str = datetime.date.today().isoformat()
        tomorrow_str = (datetime.date.today() + datetime.timedelta(days=1)).isoformat()
        yesterday_str = (datetime.date.today() - datetime.timedelta(days=1)).isoformat()

        default_bookings = [
            ("B-101", "auditorium", today_str, "14:00", "17:00", "Dr. Rajesh Sharma", "Faculty Member", "Annual Science Fest Inauguration", 400, "approved", "Approved. Please ensure clean up post event.", 0, None, 0),
            ("B-102", "seminar-1", tomorrow_str, "10:00", "12:00", "Amit Patel (Club Rep)", "Student Representative", "Coding Club Hackathon Orientation", 90, "pending", "", 0, None, 0),
            ("B-103", "conference", yesterday_str, "09:00", "11:00", "Dr. Rajesh Sharma", "Faculty Member", "Academic Council Board Review", 20, "rejected", "Room booked for external NAAC delegation team inspections.", 0, None, 0)
        ]
        for b in default_bookings:
            run_query("INSERT INTO bookings VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", b)

class VenueHubHTTPHandler(http.server.BaseHTTPRequestHandler):

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        url_parsed = urllib.parse.urlparse(self.path)
        path = url_parsed.path

        if path == '/api/venues':
            try:
                rows = run_query("SELECT * FROM venues", fetch=True)
                venues = []
                for r in rows:
                    venues.append({
                        "id": r[0],
                        "name": r[1],
                        "capacity": r[2],
                        "type": r[3],
                        "approver": r[4],
                        "description": r[5],
                        "facilities": [f.strip() for f in r[6].split(',')] if r[6] else [],
                        "facilitiesLabels": [f.strip() for f in r[7].split(',')] if r[7] else [],
                        "icon": r[8]
                    })
                self.send_json(venues)
            except Exception as e:
                self.send_json({"error": str(e)}, 500)
            return

        elif path == '/api/bookings':
            try:
                rows = run_query("SELECT * FROM bookings", fetch=True)
                bookings = []
                for r in rows:
                    bookings.append({
                        "id": r[0],
                        "venueId": r[1],
                        "date": r[2],
                        "startTime": r[3],
                        "endTime": r[4],
                        "requesterName": r[5],
                        "requesterRole": r[6],
                        "purpose": r[7],
                        "expectedAttendees": r[8],
                        "status": r[9],
                        "approverComments": r[10] or "",
                        "isRecurring": bool(r[11]),
                        "recurrenceParent": r[12],
                        "checkedIn": bool(r[13])
                    })
                self.send_json(bookings)
            except Exception as e:
                self.send_json({"error": str(e)}, 500)
            return

        # Serve static files
        if path == '/' or path == '':
            path = '/index.html'

        filename = path.lstrip('/')
        filepath = os.path.join(os.getcwd(), filename)

        if os.path.exists(filepath) and os.path.isfile(filepath):
            content_type = 'text/plain'
            if filepath.endswith('.html'):
                content_type = 'text/html'
            elif filepath.endswith('.css'):
                content_type = 'text/css'
            elif filepath.endswith('.js'):
                content_type = 'application/javascript'
            elif filepath.endswith('.svg'):
                content_type = 'image/svg+xml'

            self.send_response(200)
            self.send_header('Content-type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            with open(filepath, 'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"404 Not Found")

    def do_POST(self):
        url_parsed = urllib.parse.urlparse(self.path)
        path = url_parsed.path
        
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        try:
            body = json.loads(post_data)
        except Exception:
            self.send_json({"error": "Invalid JSON"}, 400)
            return

        if path == '/api/venues':
            try:
                facilities = ",".join(body.get("facilities", []))
                facilitiesLabels = ",".join(body.get("facilitiesLabels", []))
                run_query(
                    "INSERT INTO venues VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (
                        body["id"],
                        body["name"],
                        body["capacity"],
                        body["type"],
                        body["approver"],
                        body["description"],
                        facilities,
                        facilitiesLabels,
                        body["icon"]
                    )
                )
                self.send_json({"success": True})
            except Exception as e:
                self.send_json({"error": str(e)}, 500)
            return

        elif path == '/api/bookings':
            try:
                if isinstance(body, list):
                    for b in body:
                        run_query(
                            "INSERT INTO bookings VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            (
                                b["id"],
                                b["venueId"],
                                b["date"],
                                b["startTime"],
                                b["endTime"],
                                b["requesterName"],
                                b["requesterRole"],
                                b["purpose"],
                                b["expectedAttendees"],
                                b["status"],
                                b.get("approverComments", ""),
                                1 if b["isRecurring"] else 0,
                                b.get("recurrenceParent"),
                                1 if b["checkedIn"] else 0
                            )
                        )
                else:
                    b = body
                    run_query(
                        "INSERT INTO bookings VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        (
                            b["id"],
                            b["venueId"],
                            b["date"],
                            b["startTime"],
                            b["endTime"],
                            b["requesterName"],
                            b["requesterRole"],
                            b["purpose"],
                            b["expectedAttendees"],
                            b["status"],
                            b.get("approverComments", ""),
                            1 if b["isRecurring"] else 0,
                            b.get("recurrenceParent"),
                            1 if b["checkedIn"] else 0
                        )
                    )
                self.send_json({"success": True})
            except Exception as e:
                self.send_json({"error": str(e)}, 500)
            return

        self.send_response(404)
        self.end_headers()

    def do_PUT(self):
        url_parsed = urllib.parse.urlparse(self.path)
        path = url_parsed.path
        
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        try:
            body = json.loads(post_data)
        except Exception:
            self.send_json({"error": "Invalid JSON"}, 400)
            return

        if path.startswith('/api/bookings'):
            try:
                parts = path.rstrip('/').split('/')
                if len(parts) > 3:
                    booking_id = parts[3]
                    run_query(
                        "UPDATE bookings SET venueId=?, date=?, startTime=?, endTime=?, requesterName=?, requesterRole=?, purpose=?, expectedAttendees=?, status=?, approverComments=?, isRecurring=?, recurrenceParent=?, checkedIn=? WHERE id=?",
                        (
                            body["venueId"],
                            body["date"],
                            body["startTime"],
                            body["endTime"],
                            body["requesterName"],
                            body["requesterRole"],
                            body["purpose"],
                            body["expectedAttendees"],
                            body["status"],
                            body.get("approverComments", ""),
                            1 if body["isRecurring"] else 0,
                            body.get("recurrenceParent"),
                            1 if body["checkedIn"] else 0,
                            booking_id
                        )
                    )
                else:
                    run_query("DELETE FROM bookings")
                    for b in body:
                        run_query(
                            "INSERT INTO bookings VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            (
                                b["id"],
                                b["venueId"],
                                b["date"],
                                b["startTime"],
                                b["endTime"],
                                b["requesterName"],
                                b["requesterRole"],
                                b["purpose"],
                                b["expectedAttendees"],
                                b["status"],
                                b.get("approverComments", ""),
                                1 if b["isRecurring"] else 0,
                                b.get("recurrenceParent"),
                                1 if b["checkedIn"] else 0
                            )
                        )
                self.send_json({"success": True})
            except Exception as e:
                self.send_json({"error": str(e)}, 500)
            return
            
        self.send_response(404)
        self.end_headers()

    def do_DELETE(self):
        url_parsed = urllib.parse.urlparse(self.path)
        path = url_parsed.path

        if path.startswith('/api/venues/'):
            venue_id = path.split('/')[-1]
            try:
                run_query("DELETE FROM venues WHERE id=?", (venue_id,))
                run_query(
                    "UPDATE bookings SET status='cancelled', approverComments='Cancelled because the venue was deleted by the administrator.' WHERE venueId=? AND status != 'cancelled' AND status != 'rejected'", 
                    (venue_id,)
                )
                self.send_json({"success": True})
            except Exception as e:
                self.send_json({"error": str(e)}, 500)
            return

        self.send_response(404)
        self.end_headers()

if __name__ == '__main__':
    # Initialize the database on startup (either SQLite locally or PostgreSQL in production)
    try:
        init_db()
    except Exception as e:
        print(f"Failed to initialize database: {e}")
        
    handler = VenueHubHTTPHandler
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"JUIT VenueHub server running on port {PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            sys.exit(0)
