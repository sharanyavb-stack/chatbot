It is a [Next.js](https://nextjs.org/) project built on React and TailwindCSS.

## Setup Instructions

Before running the application, you need to configure your API key.

### Steps to Update the API Key:

1. **Locate the `.env` file:**
   In the root of the project, you will find a file named `.env`. This file contains environment variables used by the application.

2. **Edit the `.env` file:**
   Open the `.env` file in a text editor and replace the placeholder for the API key with your actual API key.

   Example:
   ```plaintext
   NEXT_PUBLIC_OPENAI_API_KEY=<your-api-key-here>

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
API Token is saved in .env file.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the code in `src`. The page auto-updates as you edit the file.

Here is screenshots of my Application

![Initial Page](screenshots/image1.png)
![First Message Page](screenshots/image2.png)
![Start New Conversation Page](screenshots/image3.png)