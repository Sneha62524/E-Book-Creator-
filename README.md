# 📚AI BookStudio – AI-Powered eBook Creation Platform

<p align="center">
  <strong>Create, edit, and manage professional eBooks with the power of AI.</strong>
</p>

<p align="center">
  A full-stack MERN application that helps users generate eBook outlines and chapter content using Google Gemini AI, then refine their work in an integrated Markdown editor.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini" />
</p>

---

## 📖 Overview

**AI BookStudio** is an AI-powered eBook creation platform built using the MERN stack. It combines generative AI with a structured writing workflow, allowing users to create books, generate chapter content, edit their drafts, and organize their writing in one place.

This project demonstrates full-stack development skills, REST API integration, authentication, database operations, and integration with a generative AI service.

> **Project status:** Local development. Public deployment is not available yet.

## ✨ Features

- 🤖 **AI-Powered Content Generation** — Generate eBook outlines and chapter content with Google Gemini AI.
- 📚 **Book Management** — Create, view, update, and manage eBooks.
- ✍️ **Markdown Editor** — Write and edit chapter content using an integrated Markdown editor with preview.
- 🔐 **User Authentication** — Sign-up, login, and protected application routes.
- 🗂️ **Chapter Organization** — Manage and navigate chapters through a dedicated sidebar.
- 🖼️ **Cover Image Support** — Support for eBook cover images.
- 📤 **Export Functionality** — Export-related functionality for eBook content.
- ⚛️ **Responsive React Interface** — A component-based frontend with dedicated pages for the dashboard, editor, profile, and book viewing.

## 🖥️ Screenshots

Screenshots will be added here as the project UI is documented.

<!-- Add screenshots to a folder such as docs/screenshots/ and replace the examples below. -->

<!--
### Landing Page
![Imprintly Landing Page](docs/screenshots/landing-page.png)

### Dashboard
![Imprintly Dashboard](docs/screenshots/dashboard.png)

### eBook Editor
![Imprintly eBook Editor](docs/screenshots/ebook-editor.png)
-->

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI Integration | Google Gemini API |
| Authentication | Application authentication and protected routes |
| HTTP Client | Axios |
| Content Editing | Markdown editor |
| Development Tools | Git, GitHub, npm, Postman |

## 🏗️ Project Structure

```text
E-Book-Project/
├── Backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── upload/
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   └── E-Book Creater/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── landing/
│       │   ├── layout/
│       │   ├── pages/
│       │   └── utils/
│       ├── package.json
│       └── vite.config.js
│
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

Follow these steps to run the project locally.

### Prerequisites

Install the following before getting started:

- [Node.js and npm](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) database access
- [Google AI Studio](https://aistudio.google.com/) API key for Gemini integration
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/Sneha62524/E-Book-Creator-.git
cd E-Book-Creator-
```

### 2. Set up the backend

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder and add the environment variables required by your backend configuration.

Example template — use the **exact variable names expected by your code**:

```env
PORT=8000
# Add your MongoDB connection variable
# Add your Gemini API key variable
# Add any authentication secret required by your backend
```

Never commit real API keys, database credentials, or other secrets.

Start the backend using the development script configured in `Backend/package.json`:

```bash
npm run dev
```

If your project does not define a `dev` script, use the appropriate script listed in that file.

### 3. Set up the frontend

Open a second terminal from the project root:

```bash
cd "Frontend/E-Book Creater"
npm install
```

Configure the frontend API base URL in the appropriate configuration file under `src/utils/` so that it points to your running backend.

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## 🔑 Environment Configuration

Keep all sensitive configuration in local environment files that are excluded from Git.

Before running the application, verify the required settings in the backend database configuration, server, AI controller, and authentication code.

- MongoDB connection string
- Google Gemini API key
- Authentication secret, if required
- Backend port and any other required settings
- Frontend API base URL

Do not use real credentials in this README.

## 🧠 What I Learned

Working on Imprintly provided practical experience with:

- Building a full-stack application using the MERN stack.
- Designing and integrating REST APIs.
- Implementing authentication and protected routes.
- Performing database-backed CRUD operations.
- Integrating a generative AI API into a web application.
- Building reusable React components and managing application state.
- Using Git and GitHub for version control.

## 🚀 Future Improvements

- Deploy the frontend and backend for public access.
- Improve automated testing and error handling.
- Add richer eBook formatting and export options.
- Improve accessibility and mobile responsiveness.
- Add automated checks to the development workflow.

## 👩‍💻 Author

**Sneha Verma**

B.Tech in Computer Science and Engineering | Aspiring Software Developer

- GitHub: [@Sneha62524](https://github.com/Sneha62524)

## 📄 License

No license has been added to this repository yet. Licensing can be added when the project’s distribution and reuse terms are decided.

---

<p align="center">
  <i>Built with React, Node.js, MongoDB, Express, and Google Gemini AI.</i>
</p>