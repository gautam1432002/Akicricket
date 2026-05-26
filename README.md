# Aki-Cricket

An AI-powered IPL Akinator guessing game built with Next.js 14, Tailwind CSS, Framer Motion, Zustand, Firebase, and Gemini 2.5 Flash.

## Setup Instructions

### 1. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root of the project and add the following keys:

```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Client config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin config (Base64 encoded service account JSON)
# To generate this, download your service account JSON from Firebase console, 
# then base64 encode it. (e.g. `base64 -i service-account.json`)
FIREBASE_SERVICE_ACCOUNT_KEY=your_base64_encoded_service_account_json
```

### 3. Firebase Firestore Setup
Make sure you have initialized Cloud Firestore in your Firebase project.
The app expects two collections to exist (they will be created automatically when documents are written, but you must ensure your database is active):
- `sessions`
- `leaderboard`

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
