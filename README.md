# Sanity Blog with React

A responsive blog application built with React, TypeScript, and Tailwind CSS, powered by Sanity CMS.

## Features

- ✨ Blog post listing page with grid layout
- 📖 Individual blog post pages with rich text content
- 📱 Fully responsive design
- 🔍 SEO optimized with React Helmet
- 🎨 Styled with Tailwind CSS
- 🚀 Built with Vite for fast development

## Prerequisites

- Node.js 16+ installed
- A Sanity project with blog schema set up

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Sanity project details:
   ```
   VITE_SANITY_PROJECT_ID=your-sanity-project-id
   VITE_SANITY_DATASET=production
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Sanity Schema

Make sure your Sanity project has a `post` schema with the following fields:

- `title` (string)
- `slug` (slug)
- `author` (reference to author document)
- `mainImage` (image)
- `categories` (array of references to category documents)
- `publishedAt` (datetime)
- `body` (array of blocks for rich text)
- `excerpt` (text, optional)

### Author Schema
- `name` (string)
- `image` (image)
- `bio` (text)

### Category Schema
- `title` (string)
- `slug` (slug)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Sanity Client
- React Router DOM
- React Helmet Async
- Portable Text React
