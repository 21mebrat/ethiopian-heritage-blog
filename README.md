# 🇪🇹 Ethiopian Heritage Blog

A high-performance, modern blogging platform dedicated to preserving and celebrating Ethiopian culture, history, and heritage. Built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**, featuring a professional magazine-style design and robust containerized deployment.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-Standalone-2496ED?style=flat-square&logo=docker)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)

---

## ✨ Features

- **🏛️ Heritage-Centric Design**: A premium UI inspired by historical aesthetics combined with modern UX principles.
- **🖋️ Rich Text Editor**: Powered by **TipTap**, supporting YouTube embeds, images, custom styling, and media alignment.
- **🚀 Optimized Performance**: Implements Next.js **Output Standalone** mode for lightning-fast cold starts and minimal Docker image size (~120MB).
- **🌓 Responsive Layout**: Seamless experience across mobile, tablet, and desktop with parallel & intercepting routing.
- **🛡️ Secure API**: Built-in authentication using JWT and secure database interactions with Mongoose.
- **☁️ Media Management**: Fully integrated with **Cloudinary** for optimized image delivery.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **Database**: MongoDB (via Mongoose)
- **Components**: Radix UI (Base UI), Lucide Icons
- **Editor**: TipTap (Rich Text Ecosystem)
- **Deployment**: Docker (Multi-stage builds)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/21mebrat/ethiopian-heritage-blog.git
cd ethiopian-heritage-blog
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🐳 Docker Deployment

This project is optimized for production using Docker standalone mode.

### Local Build
```bash
docker build -t ethiopian-heritage-blog .
```

### Production Run (with Docker Compose)
The project includes a production-ready `docker-compose.prod.yml` that handles both the application and the MongoDB database.

```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## 📂 Project Structure

```text
├── app/               # Next.js App Router (Pages, Layouts, API)
├── components/        # Reusable UI components
├── lib/               # Utility functions and DB configurations
├── public/            # Static assets
├── Dockerfile         # Multi-stage standalone build
├── next.config.ts     # Standalone output configuration
└── DESIGN.md          # Architectural and Design Philosophy
```

---

## 📜 License

This project is private and intended for the preservation of Ethiopian Heritage.

---

**Built with ❤️ for Ethiopia.**
