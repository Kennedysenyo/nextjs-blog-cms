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
