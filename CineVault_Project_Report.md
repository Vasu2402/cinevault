# CineVault — Online Movie Ticket Booking System
## Project Report

---

# Chapter 1: Abstract / Keywords

## 1.1 Abstract

CineVault is a full-stack online movie ticket booking web application that enables users to browse currently playing and upcoming movies, select showtimes across multiple theatres, choose seats via an interactive real-time seat map, order food and beverages, apply promotional discount codes, and receive booking confirmation emails. The system is built using a modern JavaScript technology stack comprising Node.js with Express.js on the backend, MySQL as the relational database managed through Sequelize ORM, Apollo Server for GraphQL API, Socket.io for real-time seat locking, and Nodemailer for transactional email delivery via Gmail SMTP. The frontend is a responsive multi-page application built with HTML5, CSS3, JavaScript, and Bootstrap 5. A key highlight is the integration with The Movie Database (TMDb) API, which automatically syncs live, up-to-date movie listings into the local database and auto-generates shows, seats, and schedules for each new movie — ensuring the platform always displays fresh cinema data without manual intervention. The application follows a client-server architecture with JWT-based authentication, database transactions for booking integrity, and WebSocket-based real-time seat availability updates across concurrent users.

## 1.2 Keywords

Online Movie Booking, Full-Stack Web Application, Node.js, Express.js, GraphQL, Apollo Server, MySQL, Sequelize ORM, Socket.io, Real-Time Seat Selection, JWT Authentication, TMDb API Integration, Nodemailer, SMTP Email, Bootstrap 5, Responsive Design, REST API, WebSocket, Promo Code System, Food Ordering

---

# Chapter 2: Introduction to the Project

## 2.1 Background

The entertainment industry, particularly the cinema sector, has undergone a significant digital transformation over the past decade. Traditional methods of purchasing movie tickets — standing in long queues at theatre box offices — have been largely replaced by online booking platforms. Services such as BookMyShow, Fandango, and PVR Cinemas have demonstrated that audiences prefer the convenience of browsing movies, selecting seats, and completing payments from their devices.

However, most existing platforms are proprietary, closed-source, and tightly coupled with specific theatre chains. For educational purposes and to understand the full engineering complexity behind such systems, CineVault was developed as a complete, end-to-end movie ticket booking system that replicates the core functionalities of commercial platforms while incorporating modern web development practices.

The project addresses several technical challenges:

1. **Real-time concurrency** — Multiple users may attempt to book the same seat simultaneously. CineVault uses Socket.io WebSockets to lock seats in real-time and broadcast availability changes to all connected users.

2. **Live data integration** — Rather than relying on static, manually entered movie data, CineVault integrates with The Movie Database (TMDb) API to automatically fetch currently playing and upcoming movies, complete with posters, ratings, genres, and descriptions.

3. **Transactional integrity** — Booking operations involve multiple database writes (creating bookings, marking seats as booked, processing food orders, applying discounts). CineVault uses MySQL transactions to ensure atomicity — either all operations succeed, or none do.

4. **Automated communication** — Upon successful booking, a confirmation email with complete booking details is sent to the user's registered email address via Gmail SMTP using Nodemailer.

5. **Modern API design** — The application uses GraphQL (via Apollo Server) as its primary API layer, allowing the frontend to request exactly the data it needs in a single query, reducing over-fetching and under-fetching common with traditional REST APIs.

## 2.2 Problem Statement

The conventional movie ticket booking process suffers from several inefficiencies:

- **Queue-based booking** at physical counters leads to long waiting times, especially during peak hours and blockbuster releases.
- **No real-time seat visibility** — customers cannot see which seats are available, locked by others, or already booked until they reach the counter.
- **Manual show scheduling** — theatre administrators must manually update movie listings, showtimes, and seat inventories.
- **No integrated food ordering** — snacks and beverages are purchased separately, leading to additional queues.
- **Lack of instant confirmation** — physical tickets can be lost, and there is no automated email/digital record of the booking.
- **Stale movie data** — platforms that rely on manually entered movie information often show outdated listings.

CineVault addresses all of these problems by providing:

| Problem | CineVault Solution |
|---|---|
| Long queues | Online booking from any device |
| No seat visibility | Real-time interactive seat map with WebSocket updates |
| Manual show scheduling | Auto-sync from TMDb API with auto-generated shows and seats |
| Separate food purchase | Integrated food & beverage ordering during checkout |
| No digital confirmation | Automated email confirmation via Gmail SMTP |
| Stale movie data | Live TMDb API integration with automatic database sync |

---

# Chapter 3: Software and Hardware Requirement Specification

## 3.1 Methods

The project follows a **client-server architecture** with clear separation of concerns:

### Architecture Pattern
- **Frontend**: Multi-page application (MPA) served as static HTML files
- **Backend**: Node.js/Express.js server with GraphQL API layer
- **Database**: MySQL relational database with Sequelize ORM
- **Real-time**: Socket.io for WebSocket-based seat locking
- **External API**: TMDb (The Movie Database) for live movie data
- **Email**: Nodemailer with Gmail SMTP for transactional emails

### Development Methodology
The project was developed using an **iterative development** approach:
1. Database schema design and model creation
2. Backend API development (GraphQL resolvers)
3. Frontend page development and integration
4. Real-time features (Socket.io seat locking)
5. External API integration (TMDb)
6. Email notification system
7. Testing and refinement

## 3.2 Programming / Working Environment

### Backend Technologies

| Technology | Version | Purpose |
|---|---|---|
| Node.js | v18+ | JavaScript runtime for server-side code |
| Express.js | v4.18 | HTTP web server framework |
| Apollo Server | v4.10 | GraphQL server implementation |
| Sequelize | v6.37 | ORM for MySQL database operations |
| MySQL2 | v3.9 | MySQL database driver |
| Socket.io | v4.7 | Real-time WebSocket communication |
| Nodemailer | v8.0 | Email sending library |
| JSON Web Token | v9.0 | JWT-based user authentication |
| bcryptjs | v2.4 | Password hashing |
| dotenv | v16.4 | Environment variable management |
| Nodemon | v3.1 | Development auto-restart tool |

### Frontend Technologies

| Technology | Version | Purpose |
|---|---|---|
| HTML5 | — | Page structure and semantics |
| CSS3 | — | Styling, animations, responsive design |
| JavaScript (ES6+) | — | Client-side logic and API calls |
| Bootstrap | v5.3.3 | Responsive CSS framework |
| Bootstrap Icons | v1.11.3 | Icon library |
| Socket.io Client | v4.7.4 | Client-side WebSocket library |
| GraphQL | — | API query language |

### External Services

| Service | Purpose |
|---|---|
| TMDb API | Live movie data (now playing, upcoming, posters, ratings) |
| Gmail SMTP | Email delivery for booking confirmations |

### Development Tools

| Tool | Purpose |
|---|---|
| VS Code | Code editor |
| MySQL Workbench | Database management |
| Postman / GraphQL Playground | API testing |
| Chrome DevTools | Frontend debugging |
| Git | Version control |
| npm | Package management |

## 3.3 Requirements to Run the Application

### Hardware Requirements

| Component | Minimum | Recommended |
|---|---|---|
| Processor | Intel i3 / Apple M1 | Intel i5+ / Apple M1+ |
| RAM | 4 GB | 8 GB |
| Storage | 500 MB free | 1 GB free |
| Network | Internet connection | Broadband connection |

### Software Requirements

| Software | Requirement |
|---|---|
| Operating System | Windows 10+, macOS 11+, or Linux |
| Node.js | v18.0 or higher |
| MySQL Server | v8.0 or higher |
| Web Browser | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| npm | v9.0 or higher (comes with Node.js) |

### Installation Steps

```bash
# 1. Clone the project
cd /path/to/fse_movie/cinevault/server

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Edit .env file with your MySQL credentials and Gmail App Password

# 4. Create the database
mysql -u root -p -e "CREATE DATABASE cinevault;"

# 5. Seed the database
npm run seed

# 6. Start the server
npm run dev

# 7. Open in browser
# Navigate to http://localhost:5001
```
# Chapter 4: Database Analyzing, Design and Implementation

## 4.1 Database Overview

CineVault uses **MySQL** as its relational database management system, accessed through **Sequelize ORM** (Object-Relational Mapping). Sequelize allows defining database tables as JavaScript model classes, and automatically handles SQL query generation, associations, migrations, and data validation.

The database name is `cinevault` and contains **9 tables** with well-defined relationships.

## 4.2 Entity-Relationship Diagram

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│  users   │       │  movies  │       │ theatres │
├──────────┤       ├──────────┤       ├──────────┤
│ id (PK)  │       │ id (PK)  │       │ id (PK)  │
│ name     │       │ title    │       │ name     │
│ email    │       │ genre    │       │ location │
│ password │       │ rating   │       │totalSeats│
│createdAt │       │ duration │       └────┬─────┘
└────┬─────┘       │description│           │
     │             │ poster   │           │
     │             │ language │      ┌────┴─────┐
     │             │releaseDate│     │  shows   │
     │             │ cast     │     ├──────────┤
     │             │ director │     │ id (PK)  │
     │             │ trailer  │◄────┤movieId(FK)│
     │             │ tmdbId   │     │theatreId(FK)├──►┐
     │             │ status   │     │ time     │     │
     │             └──────────┘     │ date     │     │
     │                              │ price    │     │
     │                              │premPrice │     │
     │                              └────┬─────┘     │
     │                                   │           │
     │             ┌──────────┐     ┌────┴─────┐     │
     │             │ bookings │     │  seats   │     │
     │             ├──────────┤     ├──────────┤     │
     └────────────►│ id (PK)  │     │ id (PK)  │     │
                   │userId(FK)│     │showId(FK)│     │
                   │showId(FK)├────►│seatNumber│     │
                   │ seats[]  │     │ type     │     │
                   │totalAmount│    │ isBooked │     │
                   │ promoCode│     │ lockedBy │     │
                   │ discount │     │lockExpiry│     │
                   │ status   │     └──────────┘     │
                   │bookingRef│                      │
                   └────┬─────┘    ┌────────────┐    │
                        │          │ food_items │    │
                   ┌────┴──────┐   ├────────────┤    │
                   │food_orders│   │ id (PK)    │    │
                   ├───────────┤   │theatreId(FK)├───┘
                   │ id (PK)   │   │ name       │
                   │bookingId  │   │ description│
                   │ userId    │   │ price      │
                   │ theatreId │   │ availableQty│
                   │totalAmount│   │ isActive   │
                   │ status    │   └─────┬──────┘
                   └────┬──────┘         │
                        │     ┌──────────┴───────┐
                        │     │food_order_items   │
                        │     ├──────────────────┤
                        └────►│ id (PK)          │
                              │ foodOrderId (FK) │
                              │ foodItemId (FK)  │
                              │ quantity         │
                              │ unitPrice        │
                              │ lineTotal        │
                              └──────────────────┘
```

## 4.3 Table Descriptions

### Table 1: users
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER | PK, Auto Increment | Unique user identifier |
| name | VARCHAR(100) | NOT NULL | Full name |
| email | VARCHAR(150) | NOT NULL, UNIQUE | Email address (validated) |
| password | VARCHAR(255) | NOT NULL | bcrypt hashed password |
| createdAt | DATETIME | Auto | Account creation timestamp |
| updatedAt | DATETIME | Auto | Last update timestamp |

### Table 2: movies
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER | PK, Auto Increment | Unique movie identifier |
| title | VARCHAR(200) | NOT NULL | Movie title |
| genre | VARCHAR(100) | NOT NULL | Primary genre |
| rating | FLOAT | 0-10, Default 0 | TMDb rating |
| duration | INTEGER | NOT NULL | Duration in minutes |
| description | TEXT | — | Plot synopsis |
| poster | VARCHAR(500) | — | Poster image URL |
| language | VARCHAR(50) | Default 'English' | Language |
| releaseDate | DATEONLY | — | Release date |
| cast | TEXT | — | Comma-separated cast names |
| director | VARCHAR(150) | — | Director name |
| trailer | VARCHAR(500) | — | Backdrop/trailer URL |
| tmdbId | VARCHAR(20) | UNIQUE | TMDb movie ID for sync |
| status | ENUM | 'now','upcoming' | Now showing or coming soon |

### Table 3: theatres
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER | PK, Auto Increment | Unique theatre identifier |
| name | VARCHAR(150) | NOT NULL | Theatre name |
| location | VARCHAR(250) | NOT NULL | Address/location |
| totalSeats | INTEGER | Default 100 | Total seat capacity |

### Table 4: shows
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER | PK, Auto Increment | Unique show identifier |
| movieId | INTEGER | FK → movies.id | Associated movie |
| theatreId | INTEGER | FK → theatres.id | Associated theatre |
| time | VARCHAR(20) | NOT NULL | Show time (e.g., "7:30 PM") |
| date | DATEONLY | NOT NULL | Show date |
| price | DECIMAL(10,2) | Default 250 | Standard ticket price |
| premiumPrice | DECIMAL(10,2) | Default 450 | Premium seat price |

### Table 5: seats
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER | PK, Auto Increment | Unique seat identifier |
| showId | INTEGER | FK → shows.id | Associated show |
| seatNumber | VARCHAR(10) | NOT NULL | Seat label (e.g., "C4") |
| type | ENUM | 'standard','premium' | Seat category |
| isBooked | BOOLEAN | Default false | Booking status |
| lockedBy | VARCHAR(100) | Nullable | User ID who locked this seat |
| lockExpiry | DATETIME | Nullable | Lock auto-release time |

### Table 6: bookings
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER | PK, Auto Increment | Unique booking identifier |
| userId | INTEGER | FK → users.id | User who booked |
| showId | INTEGER | FK → shows.id | Associated show |
| seats | JSON | NOT NULL | Array of seat numbers |
| totalAmount | DECIMAL(10,2) | NOT NULL | Final amount paid |
| promoCode | VARCHAR(50) | Nullable | Applied promo code |
| discount | DECIMAL(10,2) | Default 0 | Discount amount |
| status | ENUM | 'pending','confirmed','cancelled' | Booking status |
| bookingRef | VARCHAR(20) | UNIQUE | Reference code (e.g., "AB12XY34") |

### Table 7: food_items
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER | PK, Auto Increment | Unique item identifier |
| theatreId | INTEGER | FK → theatres.id | Theatre offering this item |
| name | VARCHAR(120) | NOT NULL | Item name |
| description | VARCHAR(255) | Nullable | Item description |
| price | DECIMAL(10,2) | NOT NULL | Unit price |
| availableQuantity | INTEGER | Default 0, Min 0 | Stock count |
| isActive | BOOLEAN | Default true | Whether item is available |

### Table 8: food_orders
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER | PK, Auto Increment | Order identifier |
| bookingId | INTEGER | FK → bookings.id, UNIQUE | One order per booking |
| userId | INTEGER | FK → users.id | User who ordered |
| theatreId | INTEGER | FK → theatres.id | Theatre |
| totalAmount | DECIMAL(10,2) | Default 0 | Food total |
| status | ENUM | 'confirmed','cancelled' | Order status |

### Table 9: food_order_items
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| id | INTEGER | PK, Auto Increment | Line item identifier |
| foodOrderId | INTEGER | FK → food_orders.id | Parent order |
| foodItemId | INTEGER | FK → food_items.id | Food item ordered |
| quantity | INTEGER | NOT NULL, Min 1 | Quantity |
| unitPrice | DECIMAL(10,2) | NOT NULL | Price at time of order |
| lineTotal | DECIMAL(10,2) | NOT NULL | quantity × unitPrice |

## 4.4 Relationships Summary

| Relationship | Type | Description |
|---|---|---|
| User → Bookings | One-to-Many | One user can have many bookings |
| Movie → Shows | One-to-Many | One movie screens in many shows |
| Theatre → Shows | One-to-Many | One theatre hosts many shows |
| Show → Seats | One-to-Many | Each show has 100 seats (10 rows × 10) |
| Show → Bookings | One-to-Many | One show can have many bookings |
| Booking → FoodOrder | One-to-One | Each booking has at most one food order |
| Theatre → FoodItems | One-to-Many | Each theatre has its own food menu |
| FoodOrder → FoodOrderItems | One-to-Many | One order contains multiple food items |

## 4.5 Database Connection Configuration

The database connection is configured via environment variables in the `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=240224
DB_NAME=cinevault
```

Sequelize connects using these values:

```javascript
const sequelize = new Sequelize(
  process.env.DB_NAME,    // 'cinevault'
  process.env.DB_USER,    // 'root'
  process.env.DB_PASS,    // password
  {
    host: process.env.DB_HOST,   // 'localhost'
    port: process.env.DB_PORT,   // 3306
    dialect: 'mysql',
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  }
);
```

On server startup, `sequelize.sync({ alter: true })` automatically creates or updates tables to match model definitions without losing existing data.
# Chapter 5: Program Structure Analyzing and GUI Constructing

## 5.1 Project Directory Structure

```
fse_movie/
└── cinevault/
    ├── client/                          # Frontend (served as static files)
    │   ├── index.html                   # Root redirect → /pages/index.html
    │   ├── assets/
    │   │   ├── css/
    │   │   │   ├── main.css             # Global styles, variables, layout (14 KB)
    │   │   │   ├── components.css       # Card, button, form, seat styles (25 KB)
    │   │   │   └── animations.css       # Fade-in, slide, shimmer effects (7 KB)
    │   │   └── js/
    │   │       ├── api.js               # GraphQL client (queries & mutations)
    │   │       ├── auth.js              # Login/signup, JWT token management
    │   │       ├── movies.js            # Movie grid, hero slider, genre filter
    │   │       ├── seat-selection.js    # Interactive seat map logic
    │   │       ├── booking.js           # Checkout, food ordering, promo codes
    │   │       ├── socket.js            # Socket.io client for real-time seats
    │   │       └── utils.js             # Formatters, toast notifications, helpers
    │   └── pages/
    │       ├── index.html               # Home page (hero slider, featured movies)
    │       ├── movies.html              # All movies grid with genre filters
    │       ├── movie-detail.html        # Movie details + show time selection
    │       ├── seat-selection.html       # Interactive seat map
    │       ├── checkout.html            # Booking summary, food, promo, payment
    │       ├── my-bookings.html         # User's booking history
    │       └── auth.html                # Login / Sign Up page
    │
    └── server/                          # Backend
        ├── server.js                    # Main entry point (Express + Socket.io)
        ├── .env                         # Environment variables (secrets)
        ├── package.json                 # Dependencies and scripts
        ├── seed.js                      # Database seeder (users, movies, shows, seats)
        ├── config/
        │   ├── db.js                    # MySQL/Sequelize connection
        │   └── jwt.js                   # JWT sign & verify helpers
        ├── models/
        │   ├── index.js                 # Model associations (relationships)
        │   ├── User.js                  # User model
        │   ├── Movie.js                 # Movie model (with tmdbId, status)
        │   ├── Theatre.js               # Theatre model
        │   ├── Show.js                  # Show model (movie + theatre + time)
        │   ├── Seat.js                  # Seat model (with lock fields)
        │   ├── Booking.js               # Booking model
        │   ├── FoodItem.js              # Food menu item model
        │   ├── FoodOrder.js             # Food order per booking
        │   └── FoodOrderItem.js         # Individual food line items
        ├── graphql/
        │   ├── index.js                 # Apollo Server setup + auth context
        │   ├── typeDefs.js              # GraphQL schema (types, queries, mutations)
        │   └── resolvers.js             # Query/mutation implementations + TMDb sync
        ├── routes/
        │   ├── auth.js                  # REST auth routes
        │   ├── movies.js                # REST movie routes
        │   └── bookings.js              # REST booking routes
        ├── middleware/
        │   └── authMiddleware.js        # JWT verification middleware
        ├── sockets/
        │   └── seatSocket.js            # Real-time seat lock/unlock via Socket.io
        └── utils/
            ├── mailer.js                # Nodemailer SMTP email sender
            └── bookingEmailTemplate.js  # HTML/text email template builder

Total: 7 HTML pages, 7 JS client files, 3 CSS files, 10 models, 3 GraphQL files
```

## 5.2 Application Flow / User Journey

```
┌─────────────┐    ┌─────────────┐    ┌──────────────┐    ┌───────────────┐
│  Home Page   │───►│ Movies Page │───►│ Movie Detail │───►│Seat Selection │
│ (Hero Slider)│    │(Genre Filter)│   │(Show Times)  │    │(Interactive)  │
└─────────────┘    └─────────────┘    └──────────────┘    └───────┬───────┘
                                                                  │
┌─────────────┐    ┌─────────────┐    ┌──────────────┐           │
│  Auth Page  │◄───│  My Bookings│◄───│  Checkout    │◄──────────┘
│(Login/Signup)│   │  (History)  │    │(Food + Pay)  │
└─────────────┘    └─────────────┘    └──────────────┘
```

## 5.3 GUI Screenshots (Page Descriptions)

### Screenshot 1: Home Page (index.html)
The home page features a full-width hero slider that cycles through featured movies with backdrop images, movie titles, ratings, duration, genre, and "Book Tickets" call-to-action buttons. Below the hero section is a "Now Showing" horizontal scroll row displaying movie cards with poster images, titles, genres, and ratings. A "Browse by Genre" section shows genre category cards (Action, Sci-Fi, Drama, Thriller) with emoji icons. The page ends with a CTA section and a dark-themed footer with quick links.

### Screenshot 2: All Movies Page (movies.html)
Displays a responsive 4-column grid of all movies. Each card shows the poster image, a "NOW SHOWING" (green) or "COMING SOON" (purple) badge, a star rating badge, the movie title, genre tag, and duration. The page includes a search bar for searching movies by title, actor, or director, and genre filter pills (All, Action, Adventure, Comedy, Drama, etc.) that filter the grid in real-time. Skeleton loading placeholders are shown while data loads from the API.

### Screenshot 3: Movie Detail Page (movie-detail.html)
A cinematic detail page with the movie poster as a blurred backdrop. The left section shows the poster image, while the right shows the title, genre badge, language badge, star rating, duration, release date, description, director, and cast. Below is the "Select Show" section with date tabs (next 5 days) and theatre cards showing the theatre name, location, standard/premium prices, and clickable time-slot buttons (10:00 AM, 1:30 PM, etc.).

### Screenshot 4: Seat Selection Page (seat-selection.html)
Features a movie info bar at the top showing the poster thumbnail, title, genre, duration, and selected show details. Below is a curved "Screen this way" indicator. The seat grid shows 10 rows (A-J) × 10 seats with color coding: green for available, blue for selected, red for booked, orange for locked by another user, and gold border for premium seats (rows A-B). A legend explains the colors. A sticky summary bar at the bottom shows the count of selected seats, total price, and a "Proceed" button.

### Screenshot 5: Checkout Page (checkout.html)
A two-column layout. The left column shows the booking summary (movie poster, title, theatre, date, time, selected seats, price breakdown), a food & beverages section (popcorn, nachos, drinks with quantity selectors), and a promo code input field. The right column shows payment method options (UPI, Card, Net Banking, Wallet) and a "Confirm Booking" button with a secure payment notice.

### Screenshot 6: Booking Confirmation Modal
A centered modal overlay with a celebration emoji, "Booking Confirmed!" heading, booking reference code, seats, and amount paid. Two buttons: "View My Bookings" and "Browse More."

### Screenshot 7: My Bookings Page (my-bookings.html)
Lists all user bookings as horizontal cards with the movie poster, title, booking reference, theatre name, date, time, seats, total amount, and status badge (Confirmed/Cancelled). Each card has a "Cancel Booking" button for confirmed bookings.

### Screenshot 8: Authentication Page (auth.html)
A centered card with the CineVault logo, tabbed interface (Login / Sign Up), email and password input fields with validation, a "Sign In" button, and demo credentials displayed for testing. The Sign Up tab adds name and confirm password fields.

## 5.4 Key UI/UX Design Features

| Feature | Implementation |
|---|---|
| Dark Theme | CSS custom properties with dark backgrounds (#0a0e17, #111827) |
| Glassmorphism | Backdrop-blur and semi-transparent backgrounds on cards |
| Skeleton Loading | Shimmer animation placeholders while data fetches |
| Responsive Grid | Bootstrap 5 grid (col-xl-3, col-lg-3, col-md-4, col-sm-6) |
| Micro-animations | CSS fade-in-up, scale-in, slide transitions on page load |
| Toast Notifications | Non-blocking success/error messages with auto-dismiss |
| Ripple Effect | Material-design ripple animation on button clicks |
| Scroll Reveal | Elements animate into view as user scrolls |
| Real-time Seat Colors | Socket.io updates seat colors without page refresh |

---

# Chapter 6: Code Implementation and Database Connections

## 6.1 Server Setup (server.js)

The main server file initializes Express, HTTP server, Socket.io, middleware, routes, database, and GraphQL:

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB, sequelize } = require('./config/db');
const createApolloServer = require('./graphql');
const initSeatSocket = require('./sockets/seatSocket');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'client'))); // Serve frontend

// REST routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);

// Start
const start = async () => {
  await connectDB();                    // Connect to MySQL
  await sequelize.sync({ alter: true });  // Sync models → tables
  await createApolloServer(app);         // Mount GraphQL at /graphql
  initSeatSocket(io);                    // Initialize WebSocket handlers
  server.listen(5001);                   // Start listening
};
```

## 6.2 GraphQL API Layer

### Schema Definition (typeDefs.js)

Defines the data types and available operations:

```graphql
type Movie {
  id: ID!, title: String!, genre: String, rating: String,
  duration: Int, description: String, poster: String,
  language: String, releaseDate: String, cast: String,
  director: String, trailer: String, status: String, shows: [Show]
}

type Query {
  getMovies(genre: String): [Movie]
  getMovieById(id: ID!): Movie
  getShows(movieId: ID!): [Show]
  getSeats(showId: ID!): [Seat]
  getMyBookings: [Booking]
  getFoodItems(theatreId: ID!): [FoodItem]
}

type Mutation {
  login(email: String!, password: String!): AuthPayload
  signup(name: String!, email: String!, password: String!): AuthPayload
  bookTicket(showId: ID!, seats: [String!]!, promoCode: String,
             food: [FoodSelectionInput!]): Booking
  applyPromo(code: String!, amount: Float!): PromoResult
  cancelBooking(bookingId: ID!): Boolean
}
```

### TMDb API Integration (resolvers.js)

The `getMovies` resolver automatically syncs live movie data:

```javascript
const TMDB_KEY = '8265bd1679663a7ea12ac168da84d2e8';

async function syncTmdbMovies() {
  // 1. Fetch now_playing and upcoming from TMDb API
  const [nowData, upData] = await Promise.all([
    tmdbGet('/movie/now_playing?language=en-US&page=1'),
    tmdbGet('/movie/upcoming?language=en-US&page=1'),
  ]);

  // 2. For each movie: upsert into MySQL
  for (const m of movies) {
    const [movieRow] = await Movie.upsert({
      tmdbId: String(m.id), title: m.title,
      genre, rating, poster, description, status
    });

    // 3. If new movie (no shows yet), auto-create shows + seats
    if (await Show.count({ where: { movieId: movieRow.id } }) === 0) {
      // Create shows across 3 theatres × 5 days × 5 time slots
      const createdShows = await Show.bulkCreate(showsToCreate);
      // Create 100 seats per show (10 rows × 10 seats)
      await Seat.bulkCreate(seatRows);
    }
  }
}
```

## 6.3 JWT Authentication Flow

```javascript
// Signup: Hash password → Save user → Generate token
const hashedPassword = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, password: hashedPassword });
const token = signToken({ id: user.id });  // JWT valid for 7 days

// Login: Find user → Compare hash → Generate token
const user = await User.findOne({ where: { email } });
const isValid = await bcrypt.compare(password, user.password);
const token = signToken({ id: user.id });

// Client stores token in localStorage and sends in headers:
// Authorization: Bearer <token>
```

## 6.4 Real-Time Seat Locking (Socket.io)

```javascript
// When user selects a seat:
socket.on('seat:lock', async ({ showId, seatNumber }) => {
  // Check seat is available and not locked by someone else
  const seat = await Seat.findOne({ where: { showId, seatNumber } });
  if (seat.isBooked) return emit('seat:error', 'Already booked');
  if (seat.lockedBy && seat.lockedBy !== userId) return emit('error');

  // Lock seat for 5 minutes
  await seat.update({ lockedBy: userId, lockExpiry: now + 5min });

  // Broadcast to ALL users viewing this show
  io.to(`show:${showId}`).emit('seat:locked', { seatNumber, lockedBy });

  // Auto-release after 5 minutes if not booked
  setTimeout(() => seat.update({ lockedBy: null }), 5 * 60 * 1000);
});

// When user disconnects: release all their locked seats
socket.on('disconnect', async () => {
  const lockedSeats = await Seat.findAll({ where: { lockedBy: userId } });
  for (const seat of lockedSeats) {
    await seat.update({ lockedBy: null });
    io.to(`show:${seat.showId}`).emit('seat:released', { seatNumber });
  }
});
```

## 6.5 Booking with Database Transaction

```javascript
const booking = await sequelize.transaction(async (t) => {
  // 1. Find the show with lock (prevents race conditions)
  const show = await Show.findByPk(showId, { transaction: t, lock: t.LOCK.UPDATE });

  // 2. Verify seats are available (with row-level locking)
  const seatRecords = await Seat.findAll({
    where: { showId, seatNumber: seats },
    transaction: t, lock: t.LOCK.UPDATE
  });

  // 3. Calculate price (standard vs premium seats)
  let ticketAmount = 0;
  for (const seat of seatRecords) {
    if (seat.isBooked) throw new Error(`Seat ${seat.seatNumber} is unavailable`);
    ticketAmount += seat.type === 'premium' ? show.premiumPrice : show.price;
  }

  // 4. Apply promo code discount
  if (promoCode === 'CINE10') discount = ticketAmount * 0.1;

  // 5. Process food order (decrement stock)
  // 6. Create booking record
  // 7. Mark seats as booked
  // 8. COMMIT — all changes saved atomically
});

// 9. Send confirmation email (fire-and-forget)
const { subject, html, text } = buildBookingEmail({ userName, booking });
await sendBookingConfirmationEmail({ to: user.email, subject, html, text });
```

## 6.6 Email System (Nodemailer + Gmail SMTP)

```javascript
// Configuration from .env
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',    // Gmail's SMTP server
  port: 587,                  // STARTTLS port
  secure: false,              // Upgrade to TLS after connecting
  auth: {
    user: 'sukwarsumitvashu24@gmail.com',  // Sender email
    pass: 'xdygddujmlibvzko',              // Gmail App Password
  },
});

// Send email
await transporter.sendMail({
  from: 'CineVault <sukwarsumitvashu24@gmail.com>',
  to: user.email,
  subject: 'CineVault Booking Confirmed — AB12XY34 Mortal Kombat II',
  html: '<div>...styled HTML with booking details...</div>',
  text: 'Plain text fallback for older email clients',
});
```

## 6.7 GraphQL Client (Frontend api.js)

```javascript
const API_URL = window.location.origin + '/graphql';

async function graphqlRequest(query, variables = {}) {
  const token = localStorage.getItem('cv_token');
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  return json.data;
}

// Example: Fetch all movies
async function fetchMovies(genre) {
  const query = `
    query GetMovies($genre: String) {
      getMovies(genre: $genre) {
        id title genre rating duration description poster status
      }
    }
  `;
  const data = await graphqlRequest(query, { genre });
  return data.getMovies;
}
```
# Chapter 7: System Testing

## 7.1 Testing Approach

The CineVault application was tested using a combination of **manual functional testing**, **API testing** via GraphQL Playground, and **real-time concurrency testing** for the Socket.io seat locking system.

## 7.2 Test Cases and Results

### Module 1: User Authentication

| Test # | Test Case | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-01 | Signup with valid data | name: "Test User", email: "test@test.com", password: "password123" | Account created, JWT token returned | Account created successfully | ✅ Pass |
| TC-02 | Signup with duplicate email | Same email as existing user | Error: "Email already registered" | Error displayed correctly | ✅ Pass |
| TC-03 | Login with valid credentials | email: "demo@cinevault.com", password: "password123" | JWT token returned, redirect to home | Login successful | ✅ Pass |
| TC-04 | Login with wrong password | Correct email, wrong password | Error: "Invalid credentials" | Error displayed correctly | ✅ Pass |
| TC-05 | Access protected route without token | No Authorization header | Error: "Not authenticated" | Error returned correctly | ✅ Pass |
| TC-06 | Token expiry after 7 days | Expired JWT token | Error: "Invalid or expired token" | Correctly rejected | ✅ Pass |

### Module 2: Movie Browsing and TMDb Integration

| Test # | Test Case | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-07 | Load movies from TMDb | Open movies page | Fresh movies from TMDb displayed | Real movies (Mortal Kombat II, etc.) shown | ✅ Pass |
| TC-08 | Genre filtering | Click "Action" genre pill | Only action movies shown | Grid filtered correctly | ✅ Pass |
| TC-09 | Search by movie title | Type "Mortal" in search | Matching movies shown | Search works correctly | ✅ Pass |
| TC-10 | Movie detail page | Click on a movie card | Movie details, shows, theatres displayed | All details rendered | ✅ Pass |
| TC-11 | Show times for TMDb movies | Open detail of newly synced movie | Shows auto-generated (3 theatres × 5 days) | Shows displayed correctly | ✅ Pass |
| TC-12 | TMDb API failure fallback | API unreachable / key invalid | Existing DB movies shown (graceful fallback) | Fallback works | ✅ Pass |

### Module 3: Seat Selection and Real-Time Locking

| Test # | Test Case | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-13 | View seat map | Select a show time | 100 seats displayed (10×10 grid) | Seat grid rendered correctly | ✅ Pass |
| TC-14 | Select a seat | Click on available seat | Seat turns blue, price updates | Works correctly | ✅ Pass |
| TC-15 | Deselect a seat | Click on selected seat | Seat returns to green, price decreases | Works correctly | ✅ Pass |
| TC-16 | Premium seat pricing | Select seat A1 (premium) | ₹450 price applied | Premium price applied | ✅ Pass |
| TC-17 | Real-time seat lock | User A selects seat C4 | Seat appears orange (locked) for User B | Real-time broadcast works | ✅ Pass |
| TC-18 | Lock auto-release | Wait 5 minutes without booking | Locked seat becomes available again | Auto-released correctly | ✅ Pass |
| TC-19 | Disconnect cleanup | User closes browser tab | All their locked seats released | Cleanup works | ✅ Pass |

### Module 4: Booking and Payment

| Test # | Test Case | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-20 | Complete booking | Select seats + confirm | Booking created, seats marked booked | Booking confirmed (ref code generated) | ✅ Pass |
| TC-21 | Apply valid promo code | Code: "CINE10" | 10% discount applied | Discount calculated correctly | ✅ Pass |
| TC-22 | Apply invalid promo code | Code: "FAKE123" | Error: "Invalid promo code" | Error displayed | ✅ Pass |
| TC-23 | Order food with booking | Add popcorn × 2 | Food total added to booking amount | Food order created in DB | ✅ Pass |
| TC-24 | Double-booking prevention | Two users book same seat simultaneously | One succeeds, other gets error | Transaction prevents double-book | ✅ Pass |
| TC-25 | Cancel booking | Click "Cancel" on confirmed booking | Status changed, seats freed, food stock restored | Cancellation works | ✅ Pass |

### Module 5: Email Notifications

| Test # | Test Case | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-26 | Booking confirmation email | Complete a booking | Email sent with booking details | Email received in inbox | ✅ Pass |
| TC-27 | Email with food order | Book with food items | Email includes food details | Food listed in email | ✅ Pass |
| TC-28 | SMTP not configured | Remove SMTP vars from .env | Email skipped gracefully, booking still succeeds | Skipped without error | ✅ Pass |

## 7.3 GraphQL API Testing (via GraphQL Playground)

The GraphQL Playground at `http://localhost:5001/graphql` was used to test individual queries and mutations:

```graphql
# Test: Fetch all movies
query {
  getMovies {
    id, title, genre, rating, poster, status
  }
}
# Result: Returns 16+ movies with TMDb data

# Test: Book a ticket (authenticated)
mutation {
  bookTicket(showId: "1", seats: ["C4", "C5"], promoCode: "CINE10") {
    bookingRef, seats, totalAmount, discount, status
  }
}
# Result: { bookingRef: "AB12XY34", totalAmount: 450, discount: 50, status: "confirmed" }
```

---

# Chapter 8: Limitations

1. **No real payment gateway integration** — The payment methods (UPI, Card, Net Banking, Wallet) are UI-only. No actual payment processing is performed. In a production system, integration with Razorpay, Stripe, or PayTM would be required.

2. **Single API key for TMDb** — The application uses a public demo TMDb API key. For production use, a dedicated API key should be obtained from TMDb.

3. **No admin panel** — There is no administrative interface for theatre managers to add/edit movies, showtimes, or manage bookings. All data is either seeded or auto-synced from TMDb.

4. **Basic promo code system** — Only one promo code (CINE10) is functional with a hardcoded 10% discount. A production system would need a dynamic, database-driven promo code engine with expiry dates and usage limits.

5. **No password reset functionality** — Users cannot recover their password if forgotten. No "Forgot Password" email flow is implemented.

6. **Single language support** — The application is English-only. No internationalization (i18n) framework is integrated.

7. **No mobile app** — The system is web-only. No native Android or iOS application exists, though the responsive design works on mobile browsers.

8. **Seat lock duration is fixed** — The 5-minute seat lock timeout is hardcoded. It cannot be configured by theatre administrators.

9. **No ticket PDF generation** — Booking confirmations are sent via email but no downloadable PDF ticket or QR code is generated.

10. **Limited error handling on frontend** — While the backend has comprehensive error handling with transactions, the frontend error handling could be more granular for specific edge cases.

---

# Chapter 9: Conclusion

CineVault successfully demonstrates the design and implementation of a full-stack, real-time movie ticket booking system using modern web technologies. The project achieves all its primary objectives:

1. **Live movie data** — By integrating with the TMDb API, the platform always displays current, real-world movies with accurate posters, ratings, and descriptions, eliminating the need for manual data entry.

2. **Real-time seat booking** — The Socket.io-based seat locking system prevents double bookings and provides a collaborative, real-time experience where multiple users can see seat availability change instantly.

3. **End-to-end booking flow** — From browsing movies to selecting showtimes, choosing seats, ordering food, applying discounts, and receiving email confirmations, the entire workflow is seamless and automated.

4. **Data integrity** — MySQL transactions with row-level locking ensure that concurrent bookings cannot corrupt data, even under simultaneous access.

5. **Modern architecture** — The GraphQL API layer, JWT authentication, ORM-based database management, and event-driven WebSocket communication represent current industry best practices.

6. **User experience** — The dark-themed, responsive UI with animations, skeleton loaders, and toast notifications provides a premium, cinema-grade interface.

The project serves as a comprehensive case study in full-stack web development, covering frontend design, backend API development, database design, real-time communication, external API integration, and email automation.

---

# Chapter 10: Future Scope

1. **Payment gateway integration** — Integrate Razorpay or Stripe for real payment processing with UPI, credit card, and net banking support.

2. **Admin dashboard** — Build a dedicated admin panel for theatre managers to manage movies, showtimes, food menus, promo codes, and view analytics.

3. **QR code tickets** — Generate unique QR codes for each booking that can be scanned at the theatre entrance.

4. **PDF ticket download** — Generate downloadable PDF tickets with booking details, QR code, and theatre branding.

5. **Push notifications** — Implement browser push notifications for booking reminders, new movie releases, and offers.

6. **Movie reviews and ratings** — Allow users to rate and review movies after watching them.

7. **Recommendation engine** — Use machine learning to suggest movies based on user's booking history and preferences.

8. **Multi-language support** — Add i18n framework for Hindi, Tamil, Telugu, and other regional languages.

9. **Progressive Web App (PWA)** — Convert the application into a PWA with offline support, installability, and push notifications.

10. **Mobile applications** — Develop native Android and iOS apps using React Native or Flutter for a native mobile experience.

11. **Waitlist system** — Allow users to join a waitlist for sold-out shows and get notified when seats become available via cancellations.

12. **Loyalty points program** — Implement a reward system where users earn points per booking that can be redeemed for discounts.

13. **Analytics dashboard** — Track booking trends, revenue, popular movies, peak hours, and theatre occupancy rates.

14. **Multiple cities support** — Expand from single-city to multi-city with location-based theatre search.

---

# Chapter 11: Bibliography / References

1. **Node.js Documentation** — https://nodejs.org/en/docs — Server-side JavaScript runtime documentation.

2. **Express.js Documentation** — https://expressjs.com/ — Web framework for Node.js.

3. **GraphQL Specification** — https://graphql.org/ — Query language for APIs.

4. **Apollo Server Documentation** — https://www.apollographql.com/docs/apollo-server/ — GraphQL server implementation.

5. **Sequelize ORM Documentation** — https://sequelize.org/docs/v6/ — Promise-based ORM for MySQL.

6. **MySQL Documentation** — https://dev.mysql.com/doc/ — Relational database management system.

7. **Socket.io Documentation** — https://socket.io/docs/v4/ — Real-time bidirectional event-based communication.

8. **Nodemailer Documentation** — https://nodemailer.com/ — Email sending module for Node.js.

9. **The Movie Database (TMDb) API** — https://developers.themoviedb.org/3 — Movie metadata and images API.

10. **Bootstrap 5 Documentation** — https://getbootstrap.com/docs/5.3/ — Frontend CSS framework.

11. **JSON Web Token (JWT)** — https://jwt.io/ — Standard for secure token-based authentication.

12. **bcrypt.js** — https://www.npmjs.com/package/bcryptjs — Password hashing library.

13. **MDN Web Docs** — https://developer.mozilla.org/ — Web technologies reference (HTML, CSS, JavaScript).

14. **Gmail SMTP Settings** — https://support.google.com/mail/answer/7126229 — Gmail SMTP configuration for third-party apps.

15. **OWASP Security Guidelines** — https://owasp.org/ — Web application security best practices (XSS prevention via escapeHtml).
