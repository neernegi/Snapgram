

https://github.com/user-attachments/assets/c1443e44-8bd7-4b5e-9d11-d31ae71cb1d6

📸 Snapgram

Snapgram is a full-stack serverless social media web app where users can post, like, comment, save posts, follow/unfollow others, and manage their profiles — all with real-time updates and a smooth, responsive UI.

It is built with a modern frontend stack and a fully serverless AWS backend for scalability, speed, and security.

🚀 Tech Stack
🖥️ Frontend

React.js (Vite + TypeScript)

React Query (TanStack Query)

Tailwind CSS

ShadCN UI

Zod (for form validation)

☁️ Backend (Serverless on AWS)

AWS Cognito – Secure user authentication

AWS DynamoDB (via Dynamoose) – Scalable NoSQL data storage

AWS S3 – Media file handling (images & videos)

AWS Lambda – Serverless backend logic

AWS CloudFormation – Infrastructure as Code (IaC)

AWS CloudFront – Global CDN for fast content delivery

💡 Key Features

🖋️ Post Creation — Share images, captions, and updates

❤️ Like & Comment System — Engage with other users in real-time

💾 Save Posts — Bookmark your favorite content

🔄 Follow / Unfollow — Connect and build your network

👤 Profile Management — Update user details and profile media

⚡ Real-time Updates — Powered by TanStack Query for instant UI refresh

🔒 Secure Authentication — Fully managed by AWS Cognito

☁️ Serverless & Scalable — Deployed entirely on AWS Lambda + DynamoDB

🧰 Local Development Setup

Clone the repository

git clone https://github.com/neernegi/snapgram.git
cd snapgram


Install dependencies

npm install


Set up local AWS environment

Start DynamoDB Local and MinIO (S3 alternative) for local testing

Configure AWS credentials for local environment

Run the app locally

npm run dev

🧪 Testing & Deployment

Local Testing: AWS SAM CLI (for Lambda & API Gateway simulation)

CI/CD: Automated with GitHub Actions

Docker Support: Containerized environment for consistent builds

🌐 Deployment Architecture
Frontend (React + Vite)  →  CloudFront (CDN)
                             ↓
                        AWS S3 (Static Hosting)
                             ↓
                        AWS API Gateway
                             ↓
                        AWS Lambda (Business Logic)
                             ↓
                        AWS DynamoDB (Database)
                             ↓
                        AWS Cognito (Auth)
