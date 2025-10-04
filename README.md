# Project Structure

EdTech/
│
├── client/               # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
├── ├── vite.config.js
│   └── index.html
│
└── server/               # Backend (Node.js + Express + PostgreSQL)
    ├── seeds/
    │   ├── seed.js       # Adds initial data into PostgreSQL database
    │   └── check.js      # Checks if seed data is present (can also use pgAdmin)
    ├── server.js         # Main server entry point
    ├── package.json
    └── ecosystem.config.js


  # Requirements
  
Make sure you have the following installed:

* Node.js
* npm
* PostgreSQL
* pgAdmin 4 (optional — for database management)

# Setup Instructions
* Clone the Repository

  git clone https://github.com/mkr-sof/EdTech.git
  cd EdTech
  
* Setup the Server (Backend)

  cd server
  npm install
  
  * Configure Database Connection
    Create a .env file inside the server/ folder:
    
    PGHOST=localhost
    PGUSER=your_postgres_username
    PGPASSWORD=your_postgres_password
    PGDATABASE=edtech_db
    PGPORT=5432
    PORT=4000

  * Seed the Database
    To populate initial data:
    node seeds/seed.js

    You can verify the data with:
    node seeds/check.js

    or check directly via pgAdmin.
    
  * Run the Server
    node server.js
    
* Setup the Client (Frontend)
  cd ../client
  npm install
  * Run React App Locally
  npm run dev
The app will open at http://localhost:3000

The live version will be available at
https://mkr-sof.github.io/EdTech/

# Notes

Ensure your PostgreSQL service is running before seeding or starting the server.



