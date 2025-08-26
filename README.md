## Term Project
The Term Project SE331 Component-Based Software Development <br>
**project-01-the-anti-fake-news-system-check-it-off** <br>
**Deployment :** [View on Vercel](https://project-01-the-anti-fake-news-syste-eight.vercel.app/)

<br>

## Group Member : Check It Off
- **Name:** Nawapon Somruang  
- **Student ID:** 662115027  

Welcome to the **Check it off Anti-Fake News System** project.  
This project is designed to help identify and manage fake news using modern web technologies.  

<br>

## About the Project  
This web application allows users to:  

- Fetch news data from a database using both **Google Sheets API** and **`db.json`**.  
  > I experimented with using Google Sheets API in addition to `db.json` to ensure that the data can be updated dynamically while keeping a local backup.  

- The **Home Page** collects news data and connects to the API or local JSON to fetch the latest information.  

- The **Detail Page** allows users to read the full details of each news article.  
  - This page provides **Two Functions**:  
    - **Go to Vote Page** → where users can submit their feedback.  
    - **View Comments** → where users can read opinions and comments shared by others.  

- The **Vote Page** is designed to collect user feedback by allowing them to submit their name, vote choice, comments, and an image link.  

- User **comments** are displayed on the website so visitors can see shared opinions and reasoning.  

- News articles are classified as **real or fake** based on user votes:  
  - If **upvotes > downvotes →** the news is considered **real**  
  - If **downvotes > upvotes →** the news is considered **fake**  

- Both **upvote and downvote counts are visible on every page**, ensuring users always see the current credibility of each news item.  

- Results are updated **in real-time** on the website, showing the latest classifications, vote counts, and comments instantly — without needing to refresh the page.

<br>

## Justification: Why use Next.js

- I chose to use **Next.js** for this project because I initially misunderstood the requirement and thought that the assignment needed to be developed as a web-based application.  
   Based on that understanding, I decided to use Next.js, since it is a powerful framework for building modern web applications.

- Next.js provides features such as **server-side rendering**, **dynamic routing**, and **easy API integration**, which made it a strong choice for implementing the functions I planned for this project.  
   Although my initial decision was based on a misunderstanding, I later found that using Next.js actually helped me learn many useful concepts and allowed me to complete the project in a structured way.

- I sincerely ask for your kind understanding, as I have worked on this project entirely by myself and take full responsibility for it.  
   Even though there were many challenges along the way, I put in my best effort to make it work as effectively as possible.


🙏 I humbly hope for the professor's consideration and support as I present my work.

<br>

## Technologies Used  

The project is built with **Next.js** and uses the following tools:  

- **Next.js** – for server-side rendered and static web applications  
- **React** – for component-based UI development  
- **Node.js & npm** – for running the server and managing packages  
- **Vercel** – for deployment  
- **db.json** – (JSON-based database for storing sample data, optional)

<br>

## Links

- **Vercel Deployment:** [View on Vercel](https://project-01-the-anti-fake-news-system-check-it-pnhyptmjn.vercel.app/)  
- **Local Project (GitHub):** [Repository](https://github.com/chartchai-class/project-01-the-anti-fake-news-system-check-it-off.git)  
- **YouTube Demo:** [Video Link](https://www.youtube.com/watch?v=9BmjJhth1Tk)  
- **Google Sheets Data:** [Spreadsheet](https://docs.google.com/spreadsheets/d/1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA/edit?usp=sharing)

<br>

## Getting Started (Local)  

1. Clone this project  

```bash
git clone https://github.com/your-username/check-it-off.git
cd check-it-off
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

<br>

## System Features

### 1. News Management System
- **Complete News Display**: View all news articles added to the system.  
- **Detailed Information**: Each article includes:
  - **Title**
  - **Description**
  - **Author**
  - **Publication Date**
  - **Status**: Verified, Fake News, Under Review
  - **Associated Images**

### 2. News Filtering System
- **Category-based Filtering**:  
  - All News – Display all articles  
  - Verified – Confirmed authentic news  
  - Fake News – Confirmed false information  
  - Under Review – Pending verification
- **Display Options**: Choose the number of articles per page (6, 12, 24)

### 3. Dashboard & Statistics
- **Real-time Statistics**: Summary of news by category  
- **Quick Overview**: Instant visibility of authentic vs. fake news ratios  
- **Administrative Tools**: Easy monitoring for system administrators

### 4. Voting & Comment System
- **Community Voting**: Users can agree/disagree with news status  
- **Comment System**: Provide reasoning and source citations  
- **Community Engagement**: Crowdsourced news verification

### 5. Analytics & Reporting (Planned)
- **Historical Statistics**: Track verified vs. fake news over time  
- **User Engagement Metrics**: Monitor community participation  
- **Data Quality Assessment**: Evaluate system reliability

<br>

## Technical Architecture

- Frontend
  - Framework: React with Next.js
  - Styling: Modern CSS/Component styling
  - State Management: React hooks and context

- Backend
  - API Routes: Next.js API endpoints
  - Data Storage: JSON files (db.json) with Google Sheets integration
  - Real-time Updates: Live data synchronization
 
- Deployment
  - Platform: Vercel
  - CI/CD: Automated deployment pipeline

 <br>

## Usage Example

1. **Access Website** → View dashboard with news category summary  
2. **Select Category** → Choose specific news type (e.g., Fake News)  
3. **Read Articles** → Click on news items for detailed information  
4. **Read Comments** → View comments provided by other users for each article  
5. **Participate** → Vote and comment on news authenticity  
6. **Contribute** → Add new articles for community verification

<br>

## System Highlights
- **User-Friendly Interface**: Intuitive design for all user levels
- **Crowdsourced Verification**: Community-driven fact-checking
- **Scalable Architecture**: Ready for future enhancements
- **Future-Ready**: Extensible for AI integration and external APIs
- **Real-time Performance**: Live updates without page refresh

<br>

## Future Enhancements
- **AI Integration**: Automated preliminary fact-checking to assist community verification  
- **External APIs**: Integration with third-party news verification services  
- **Database Migration**: Implement SQL or NoSQL database for better data management  
- **Mobile App**: Develop native mobile applications for iOS and Android  
- **Notification System**: Real-time alerts for news updates and status changes

<br>

## Contributing
This project is currently maintained as a solo effort.  
If you notice any mistakes or have suggestions, I take full responsibility and welcome all feedback to improve the system further.

<br>

## License
This project is developed for educational purposes as part of **Term Project 1** in the course **SE331 - Component-Based Software Development**.

<br>

## Acknowledgments
Thank you for taking the time to review this project. Your feedback and guidance are greatly appreciated as I continue to learn and improve my software development skills.
