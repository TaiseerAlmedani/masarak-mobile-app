# Masarak Mobile App

This is the mobile application for the Masarak public transportation guidance system, built with React and optimized for mobile devices.

## Project Structure

- `src/App.jsx`: Main application component.
- `src/components/`: Contains reusable UI components, including `MapComponent.jsx`.
- `src/services/`: Contains API service calls (`api.js`), location services (`location.js`), and map services (`maps.js`).
- `src/hooks/`: Contains custom React hooks (`useAppState.js`).
- `public/`: Static assets.

## Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/TaiseerAlmedani/masarak-mobile-app.git
    cd masarak-mobile-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following:
    ```env
    VITE_API_BASE_URL="http://localhost:5000/api"
    ```
    *Replace `http://localhost:5000/api` with the URL of your deployed backend API when deploying.*

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5174`.

## Deployment to Vercel

Vercel is recommended for deploying the React mobile app due to its excellent support for frontend frameworks and continuous deployment features.

### 1. Prepare for Deployment

1.  Ensure your project is pushed to a GitHub repository (e.g., `TaiseerAlmedani/masarak-mobile-app`).
2.  Make sure your `VITE_API_BASE_URL` in `.env` (or Vercel environment variables) points to your deployed backend URL (e.g., `https://masarak-backend.onrender.com/api`).

### 2. Deploy on Vercel

1.  Go to [Vercel.com](https://vercel.com/) and log in with your GitHub account.
2.  From the Dashboard, click **Add New... > Project**.
3.  Select your `TaiseerAlmedani/masarak-mobile-app` GitHub repository.
4.  Vercel will automatically detect that it's a React project (Vite).
5.  **Project Name:** `masarak-mobile-app` (or your preferred name).
6.  **Root Directory:** `/` (if your `package.json` is in the root).
7.  **Build and Output Settings:** Vercel usually detects these automatically (e.g., `npm run build` for build command, `dist` for output directory).
8.  **Environment Variables:**
    *   Add `VITE_API_BASE_URL` and set its value to your deployed backend API URL (e.g., `https://masarak-backend.onrender.com/api`).
9.  Click **Deploy**.

Vercel will build and deploy your mobile application. Once deployed, you will get a public URL for your application.

## Contributing

Feel free to fork the repository and submit pull requests.
