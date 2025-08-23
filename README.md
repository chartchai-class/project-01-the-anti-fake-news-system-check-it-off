# Hello! I'm Nawapon Somruang 662115027 👋

Welcome to the **Check it off Anti-Fake News System** project. This project is designed to help identify and manage fake news using modern web technologies.

---

## About the Project

This web application allows users to:

- Fetch news data from a database using the Google Sheets API. I wanted to experiment with using the Google Sheets API instead of `db.json` because, at the moment, I am not sure if `db.json` can be updated dynamically, so I chose to use the API instead.
- The Home Page collects news data and connects to the API to fetch the latest information.
- The Vote Page collects user feedback, storing their name, vote choice, comments, and image link.
- Classify news as real or fake based on user votes. If upvotes exceed downvotes, the news is considered real. If downvotes exceed upvotes, the news is likely fake.
- Display results in real-time on the website, showing updated news classifications, vote counts, and user comments instantly as they are submitted, allowing visitors to see the latest trends and feedback without needing to refresh the page.

---

## Motivation

I chose to use **Next.js** for this project because I was initially confused between Nuxt.js and Next.js. As a result, I decided to build this project with Next.js. I sincerely ask for your understanding and kindness, as I have worked on this project entirely by myself and take full responsibility for it. I have put in my best effort and tried very hard to complete it to the best of my ability. I humbly hope for your consideration and support. Thank you very much for your time and guidance.

---

## Technologies Used

The project is built with **Next.js** and uses the following tools:

- **Next.js** - for server-side rendered and static web applications  
- **React** - for component-based UI development  
- **Node.js & npm** - for running the server and managing packages  
- **Vercel** - for deployment  

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
