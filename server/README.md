# With my Women! Backend API

A MERN stack backend for a feminist blog platform with premium features.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/withmywomen
JWT_SECRET=your-super-secret-jwt-key
```

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user profile (requires auth token)

#### PUT /api/auth/upgrade-premium
Upgrade user to premium (requires auth token)

### Blogs

#### GET /api/blogs
Get all blogs (public)

#### GET /api/blogs/:id
Get single blog by ID (public)

#### POST /api/blogs
Create a new blog (requires auth token)
```json
{
  "title": "My Feminist Journey",
  "content": "This is my story..."
}
```

#### PUT /api/blogs/:id
Update a blog (requires auth token, owner only)
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### DELETE /api/blogs/:id
Delete a blog (requires auth token, owner only)

#### PUT /api/blogs/:id/like
Like/unlike a blog (requires auth token)

## Authentication

Include the JWT token in the request header:
```
x-auth-token: your-jwt-token-here
```

## Models

### User
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- isPremium (Boolean, default: false)
- createdAt (Date, auto-generated)

### Blog
- title (String, required)
- content (String, required)
- author (ObjectId, ref: User, required)
- likes (Array of ObjectId, ref: User)
- createdAt (Date, auto-generated)

## Next Steps

1. Add payment integration (Stripe) for premium features
2. Implement real-time chat room with Socket.io
3. Add image upload functionality
4. Add search and filtering for blogs
5. Add comments system 