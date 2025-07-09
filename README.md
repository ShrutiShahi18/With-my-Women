# With my Women Blog Application

## Overview
A fully functional blog application built with a clean, respectful UI. Users can sign up, log in, create, edit, and delete blog posts, comment, like/unlike posts, and more. The app is responsive, minimal, and user-friendly for all age groups.

---

## Tech Stack Choices
- **Frontend:** React + Shadcn/ui (with Tailwind CSS)
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT-based authentication (secure, protected routes)
- **State Management:** React Context (can be swapped for Redux)
- **Optional:** AI integration (OpenAI or mock for blog idea suggestions)

---

## Features Completed
- User Sign Up & Login (JWT, passwords securely hashed)
- Blog Posts
  - Authenticated users can create, edit, and delete their own posts (title, content, optional image)
  - Anyone can view the list of blog posts and detailed blog post pages
- Comments
  - Authenticated users can comment on any blog post and delete their own comments
- Likes
  - Authenticated users can like/unlike posts
  - Like count visible on each post
- Responsive, minimal, and polished UI (Shadcn/ui + Tailwind)
- Proper error handling throughout
- Environment variables for sensitive configs
- Backend API documentation in this README

---

## Bonus Features Implemented
- JWT-based authentication with protected routes
- (Optional) AI integration for blog idea suggestions (OpenAI or mock)

---

## Areas for Improvement
- Add unit tests for backend routes and critical frontend logic
- Add Swagger/OpenAPI documentation for backend
- Enhance accessibility and add more UI polish
- Add pagination or infinite scroll for blog list
- Support image uploads (currently uses image URLs)
- Add user profile editing

---

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Backend
1. `cd server`
2. `cp env.example .env` and fill in your environment variables (MongoDB URI, JWT secret, etc.)
3. `npm install`
4. `npm start` (or `node server.js`)

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev` (for local development)

### Environment Variables
- See `server/env.example` for backend
- For AI integration, add your OpenAI API key if using real AI

### Deployment
- Deploy backend and frontend to Render, Vercel, Netlify, or your preferred platform
- Set environment variables in your deployment dashboard

---

## Live Demo
- **Frontend:** [https://with-my-women-frontend.onrender.com](https://with-my-women-frontend.onrender.com)
- **Backend:** [https://with-my-women-api.onrender.com](https://with-my-women-api.onrender.com)

---

## API Documentation (Summary)
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login
- `GET /api/blogs` — List all blogs
- `POST /api/blogs` — Create a blog (auth)
- `GET /api/blogs/:id` — Get a blog
- `PUT /api/blogs/:id` — Edit a blog (auth, owner)
- `DELETE /api/blogs/:id` — Delete a blog (auth, owner)
- `POST /api/blogs/:id/comments` — Add comment (auth)
- `DELETE /api/comments/:id` — Delete comment (auth, owner)
- `PUT /api/blogs/:id/like` — Like/unlike a blog (auth)
- `POST /api/chat` — Chatbot (AI, optional)

---

## Write-up
- **Tech stack:** See above
- **Features completed:** All core features, plus optional AI integration
- **Bonus features:** JWT auth, AI blog idea suggestion
- **Areas for improvement:** See above

---

## License
MIT 