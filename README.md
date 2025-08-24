# Hello! I'm Nawapon Somruang 662115027

Welcome to the **Check it off Anti-Fake News System** project. This project is designed to help identify and manage fake news using modern web technologies.

---

## About the Project

This web application allows users to:

- Fetch news data from both a local db.json file and the Google Sheets API. I combined these two approaches so that static data from db.json can be used for quick access, while dynamic updates can come from Google Sheets.
- The Home Page collects news data and connects to the API to fetch the latest information.
- The Vote Page collects user feedback, storing their name, vote choice, comments, and image link.
- Classify news as real or fake based on user votes. If upvotes exceed downvotes, the news is considered real. If downvotes exceed upvotes, the news is likely fake.
- Display results in real-time on the website, showing updated news classifications, vote counts, and user comments instantly as they are submitted, allowing visitors to see the latest trends and feedback without needing to refresh the page.
- Persistent storage: All votes and comments are stored in the Google Sheets API, so even if the page is refreshed, the latest data is not lost and continues to be visible on the website.

---

## Motivation

I chose to use Next.js for this project because I was initially confused between Nuxt.js and Next.js, so I decided to build it with Next.js. I completed this project entirely on my own and take full responsibility for all aspects. I put in my best effort to finish it to the best of my ability, and I hope to receive your understanding and support. Thank you very much.
---

## Technologies Used

The project is built with **Next.js** and uses the following tools:

- **Next.js** - for server-side rendered and static web applications  
- **React** - for component-based UI development  
- **Node.js & npm** - for running the server and managing packages  
- **Vercel** - for deployment  
- **Google Sheets API** - for fetching and updating news and comments dynamically  
- **Environment Variables** - for securely storing sensitive information such as API keys and credentials

---

## Getting Started (Local)

1. Download or clone this project

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

```bash
Start the development server:
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open http://localhost:3000 in your browser

Links
Localhost: http://localhost:3000

Deployment (Vercel): [(https://project-01-the-anti-fake-news-system-check-it-cx0nj554q.vercel.app/)]
Deployment (Vercel):

YouTube Demo: https://www.youtube.com/ <!-- replace with your actual video link -->
