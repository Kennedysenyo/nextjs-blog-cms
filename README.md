# Next.js Blog CMS

A full-stack **Markdown-powered Blog CMS** built with Next.js.
The platform allows authors to write posts in Markdown, stores the raw Markdown in the database, and renders it into HTML using a custom rendering pipeline powered by Remark.

The system automatically detects and embeds rich media such as YouTube, Vimeo, and Spotify links, and supports embedded files like PDFs, Word documents, and PowerPoint presentations for viewing or download.

## Features

- Markdown-based blog writing
- Markdown stored directly in the database
- Markdown rendered to HTML using Remark
- Automatic media embed detection (YouTube, Vimeo, Spotify)
- File embedding support (PDF, Word, PowerPoint)
- Admin dashboard for managing blog posts
- Create, edit, and delete blog posts
- Responsive UI built with Tailwind CSS and shadcn/ui

## Tech Stack

Frontend

- Next.js
- React
- Tailwind CSS
- shadcn/ui

Backend

- Next.js Server Components / Server Actions
- Drizzle ORM

Database

- PostgreSQL

Content Processing

- Remark (Markdown → HTML)

--

## How It Works

This project is a Markdown-powered blog CMS.

When creating a post, the author writes content in Markdown. The raw Markdown is stored directly in the database instead of pre-rendered HTML.

When a post is previewed or displayed, the Markdown is processed through a custom rendering pipeline using Remark. During this process, the system detects supported media and file links and renders them appropriately.

Supported embedded content includes:

- YouTube videos
- Vimeo videos
- Spotify links
- PDF files
- Word documents
- PowerPoint files

Depending on the type of link, the system can render embedded previews or provide download/view functionality.

This approach keeps content flexible, preserves the original Markdown source, and allows custom rendering behavior for rich media.

## Why I Built It

I built this project to practice building a real-world full-stack content management system with modern web technologies.

The goal was not just to create a blog, but to build a platform that handles structured content authoring, Markdown processing, rich media embedding, and admin-side content management.

Through this project, I worked on backend logic, database design, authentication, content rendering, and UI architecture in a single application.
