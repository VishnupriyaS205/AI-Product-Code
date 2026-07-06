# Listing Manager with Database

Day 27 focus: connect project data to PostgreSQL.

This project stores data in a PostgreSQL database instead of backend memory.

## Files

- `backend/schema.sql` creates the table structure.
- `backend/seed.sql` adds starter data into the table.
- `backend/server.js` connects Express to PostgreSQL and reads student rows.
- `backend/.env.example` shows the database settings needed by the backend.
- `client/` contains the React form.

## Database Name

Use this database name:

```sql
listing_manager_db
```

## Commands

Run these commands from the `listing-manager-db/backend` folder.

Create the database:

```powershell
createdb -U postgres listing_manager_db
```

Create the table:

```powershell
psql -U postgres -d listing_manager_db -f schema.sql
```

Add seed data:

```powershell
psql -U postgres -d listing_manager_db -f seed.sql
```

Check the saved rows:

```powershell
psql -U postgres -d listing_manager_db -c "SELECT * FROM student;"
```

## Important Idea

Backend memory is temporary. Data can disappear when the server restarts.

PostgreSQL is persistent storage. Data stays saved inside tables.

## Run The Backend

Create a `.env` file using `.env.example` as the guide.

Then start the server:

```powershell
cd backend
npm start
```

Open this URL in the browser:

```text
http://localhost:3000/students
```

Expected result: you should see the student rows as JSON.

## Run The React Form

Open another terminal and go into the client folder:

```powershell
cd client
npm run dev
```

Open the Vite URL shown in the terminal.

The form sends data to:

```text
POST http://localhost:3000/students
```

After saving, the app fetches the list again from:

```text
GET http://localhost:3000/students
```

## Day 29 Edit And Delete

The backend now supports:

```text
PUT http://localhost:3000/students/:id
DELETE http://localhost:3000/students/:id
```

`PUT` updates an existing row with SQL `UPDATE`.

`DELETE` removes an existing row with SQL `DELETE`.

After editing or deleting, the React app fetches the student list again so the UI shows the latest database data.

## Day 30 Admin CRUD Screen

The React app now has an admin-style CRUD screen:

- table view for saved records
- add form
- edit mode using the same form
- delete confirmation
- empty state when no records exist
- frontend validation messages
- shared request helper for repeated `fetch` logic

CRUD flow:

```text
Create -> POST -> SQL INSERT
Read -> GET -> SQL SELECT
Update -> PUT -> SQL UPDATE
Delete -> DELETE -> SQL DELETE
```

## Day 31 Authentication Basics

The backend now has basic auth routes:

```text
POST http://localhost:3000/auth/signup
POST http://localhost:3000/auth/login
GET  http://localhost:3000/auth/me
```

Day 31 concepts:

- `users` table stores user accounts.
- passwords are hashed before saving.
- signup creates a user.
- login checks email and password.
- login returns a token.
- `/auth/me` uses the token to understand the current user.

Create the `users` table:

```powershell
cd backend
psql -U postgres -d listing_manager_db -f schema.sql
```

You can test auth routes with:

```text
backend/auth.http
```

## Day 32 Login, Logout, And Protected Screen

The React app now shows the auth screen first.

Day 32 concepts:

- signup creates an account
- login saves the token in `localStorage`
- logout removes the token
- the student admin screen only shows after login
- `/students` routes now require the token in the `Authorization` header

Protected request shape:

```text
Authorization: Bearer your_token_here
```
