# Masarak Mobile App

This is the mobile application for the Masarak public transportation guidance system, built with React and optimized for mobile devices. It is also configured as a Progressive Web App (PWA).

## Project Structure

- `src/App.jsx`: Main application component.
- `src/components/`: Contains reusable UI components, including `MapComponent.jsx`.
- `src/services/`: Contains API service calls (`api.js`), location services (`location.js`), and map services (`maps.js`).
- `src/hooks/`: Contains custom React hooks (`useAppState.js`).
- `src/utils/pwa.js`: PWA utility functions for installation, updates, and notifications.
- `public/`: Static assets, including `manifest.json`, `sw.js` (Service Worker), and PWA icons.

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
    The application will be available at `http://localhost:5174` (or another available port).

## Progressive Web App (PWA)

This application is configured as a Progressive Web App (PWA), offering an enhanced user experience with features like:

*   **Installability:** Users can install the app directly to their device's home screen, bypassing app stores.
*   **Offline Access:** The app can work offline or on unreliable networks thanks to the Service Worker.
*   **Push Notifications:** Supports push notifications to engage users.
*   **Fast Loading:** Leverages caching strategies for quicker load times.

### How to Install the PWA

Once the application is deployed and accessed via a web browser (e.g., Chrome, Edge, Safari on mobile), you will typically see an 

install prompt or an option to "Add to Home Screen" in the browser's menu. Click this option to install the PWA.

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
