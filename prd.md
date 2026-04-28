# 📱 Product Requirements Document (PRD)
## ChatGo – Chat & Social Discovery App

---

## 1. 📌 Product Overview

**Product Name:** ChatGo  
**Platform:** Android (Phase 1), iOS & Web (Phase 2)  
**Category:** Social Networking / Messaging / Location-based Discovery  

### 🎯 Objective
Membangun aplikasi sosial berbasis lokasi yang menggabungkan:
- Chat real-time
- Discover user sekitar
- Social feed (posting & interaksi)

---

## 2. 🎯 Goals

### Business Goals
- 100K users dalam 6 bulan
- Retention D7 ≥ 30%
- Avg session > 5 menit
- Monetisasi: premium + ads

### User Goals
- Temukan orang sekitar dengan mudah
- Chat cepat & real-time
- Berinteraksi lewat postingan
- Aman & privat

---

## 3. 👤 Target Users

### Persona 1 – Social Explorer
- Usia 20–30
- Aktif sosial & mobile-first

### Persona 2 – Casual User
- Usia 25–40
- Cari teman ngobrol santai

---

## 4. 🧩 Core Features

### 4.1 Authentication
- Register (email / phone)
- Login
- OTP (optional)
- Session management (Better Auth)

---

### 4.2 User Profile
- Avatar
- Username
- Bio
- Gender & age
- Online status

---

### 4.3 Nearby Discovery
- List user berdasarkan lokasi
- Filter: gender, radius
- Map view (optional)

---

### 4.4 Chat System
- 1-on-1 chat
- Text & image
- Typing indicator
- Read receipt

---

### 4.5 Friend System
- Add friend
- Accept/reject
- Block user

---

### 4.6 Broadcast Message
- Kirim pesan ke user sekitar

---

### 4.7 Notification
- Push notification
- Message alert

---

### 4.8 Moderation
- Report user
- Block
- Content filtering

---

### 4.9 Premium
- Boost profile
- Unlimited chat
- Advanced filter
- Profile viewer insight

---

### 4.10 📝 Social Feed (NEW)

#### Create Post
- Text + image
- Optional location

#### Feed Timeline
- Nearby feed
- Global feed
- Sorting: terbaru / populer

#### Interaction
- Like / Unlike
- Comment
- Delete post
- Report post

#### Optional
- Save/Bookmark

---

## 5. 🏗️ System Architecture

### Frontend
- React Native / Flutter

### Backend
- Node.js + Express

### ORM
- Drizzle ORM

### Database
- PostgreSQL + PostGIS

### Auth
- Better Auth

### Realtime
- Socket.IO

### Storage
- S3 / MinIO

### Cache
- Redis (optional)

---

## 6. 📂 Backend Structure
src/
├── modules/
│ ├── auth/
│ ├── users/
│ ├── chat/
│ ├── location/
│ ├── friends/
│ ├── posts/
│ ├── moderation/
│
├── db/
│ ├── schema/
│ ├── migrations/
│
├── sockets/
├── middlewares/
├── services/
├── utils/
└── app.ts


---

## 7. 🗄️ Database Design

### users
- id (uuid)
- username
- email
- password_hash
- gender
- age
- bio
- is_online
- last_seen
- created_at

---

### user_locations
- user_id
- location (GEOGRAPHY POINT)
- updated_at

---

### messages
- id
- sender_id
- receiver_id
- message
- type
- is_read
- created_at

---

### friends
- id
- user_id
- friend_id
- status

---

### posts
- id
- user_id
- caption
- media_url
- location (optional)
- like_count
- comment_count
- created_at

---

### post_likes
- id
- user_id
- post_id
- created_at

---

### post_comments
- id
- user_id
- post_id
- comment
- parent_id (optional)
- created_at

---

### reports
- id
- reporter_id
- reported_id / post_id
- reason
- created_at

---

## 8. 📡 API Design

### Auth
- POST /auth/register
- POST /auth/login
- GET /auth/me
- POST /auth/logout

---

### Users
- GET /users/me
- PUT /users/update
- GET /users/:id

---

### Nearby
- GET /users/nearby

---

### Chat
- GET /chats/:userId
- POST /chats/send

---

### Location
- POST /location/update

---

### Friends
- POST /friends/request
- POST /friends/accept
- POST /friends/block

---

### Posts
- POST /posts
- GET /posts/feed
- GET /posts/:id
- DELETE /posts/:id

---

### Likes
- POST /posts/:id/like
- DELETE /posts/:id/like

---

### Comments
- POST /posts/:id/comment
- GET /posts/:id/comments
- DELETE /comments/:id

---

### Report
- POST /report

---

## 9. ⚡ Realtime System

### Events
- connection
- send_message
- receive_message
- typing
- read_receipt

---

### Flow
1. Socket connect + auth
2. Mapping userId → socketId
3. Kirim message → save DB → emit

---

## 10. 🎨 Frontend Structure

### Screens

#### Auth
- Login
- Register

#### Main
- Nearby
- Chat list
- Chat room
- Feed
- Create Post
- Profile

---

### Components

- UserCard
- ChatBubble
- PostCard
- CommentList
- LikeButton
- MessageInput

---

## 11. 🔄 User Flow

1. Login
2. Enable location
3. Browse nearby / feed
4. Like / comment / chat
5. Create post
6. Build connection

---

## 12. 📍 Location System

- Update tiap 5–10 detik
- Query menggunakan PostGIS (ST_DWithin)

---

## 13. 🚀 Performance

### Optimization
- Pagination (feed & chat)
- Indexing
- Lazy loading

---

### Cache
- Redis untuk:
  - online users
  - session

---

## 14. 🔐 Security

- JWT/session (Better Auth)
- Hash password
- Rate limit
- Input validation

---

## 15. ⚠️ Risks

### Privacy
- Lokasi sensitif
→ hide location

---

### Abuse
- Spam chat / posting
→ rate limit + moderation

---

### Content Risk
- NSFW / toxic
→ report + filtering

---

## 16. 📈 Metrics

- DAU / MAU
- Messages per user
- Feed engagement (like/comment)
- Retention

---

## 17. 🛣️ Roadmap

### Phase 1 (MVP)
- Auth
- Nearby
- Chat
- Feed basic

---

### Phase 2
- Notification
- Broadcast
- Premium

---

### Phase 3
- AI matching
- Video call
- Community

---

## 18. 💡 Future

- AI recommendation
- Voice/video
- Event meetup
- Social timeline

---

## 19. ✅ Definition of Done

- API stabil
- Chat realtime jalan
- Feed smooth
- Tidak ada bug critical

---

## 20. 📦 Deployment

- Docker
- VPS
- CI/CD (GitHub Actions)

---

## 21. 🔥 Tech Stack Summary

| Layer       | Tech            |
|------------|-----------------|
| Frontend   | React Native    |
| Backend    | Express.js      |
| ORM        | Drizzle         |
| DB         | PostgreSQL      |
| Auth       | Better Auth     |
| Realtime   | Socket.IO       |
| Cache      | Redis           |
| Storage    | S3              |

---

## 🚀 Final Insight

App ini punya 3 engine utama:
1. Discover (Nearby)
2. Chat (Realtime)
3. Feed (Engagement)

➡️ Kombinasi ini bikin user:
- Datang (discover)
- Interaksi (chat)
- Bertahan (feed)

---

## 🚀 READY FOR BUILD

PRD ini siap untuk:
- Sprint planning
- UI/UX design
- Backend implementation
- Mobile development
