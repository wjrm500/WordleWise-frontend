# WordleWise (frontend)

This is the frontend for WordleWise, an app used by myself and my wife to keep track of our Wordle scores. It's built with React and communicates with a Flask backend.

## Pages
- **Daily**: see scores from the current week and add new scores
- **Weekly**: see scores aggregated by week
- **Records**: browse *consecutive days X* and *lowest score in* records
- **Chart**: visualise performance over a customisable time period with a simple bar chart

## Running the app locally
1. Ensure you have Node.js (v16 or higher), npm and git installed
2. The backend server needs to be running for this app to work. Clone [WordleWise-backend](https://github.com/wjrm500/WordleWise-backend)
3. Navigate to the backend repo in your terminal and run `docker compose up -d` to start the server on port 5000
4. Clone *this* repository
5. Install dependencies:

    ```bash
    npm install
    ```
6.
## Development Workflows

This project supports two development workflows: **Frontend Development** (using a mock API) and **Full Stack Development** (using a real backend).

### 1. Frontend Development (Recommended for UI work)

This workflow allows you to work on the frontend in isolation using a local mock API server. This is useful for UI testing and development without needing the full backend infrastructure.

**Prerequisites**:
- Node.js version 16 or higher (run `nvm use` to switch).

**Steps**:
1.  Start the Mock API server:
    ```bash
    npm run mock-api
    ```
    This runs a local Express server on port 3001 serving mock data.

2.  Start the React application:
    ```bash
    npm run start:mock
    ```
    This starts the frontend on port 3000, configured to talk to the mock API.

### 2. Full Stack Development

This workflow connects the frontend to a real backend server. You must have the backend server running separately.

**Steps**:
1.  Ensure your backend server is running.
2.  Start the React application:
    ```bash
    npm start
    ```
    By default, this will attempt to connect to the backend URL configured in your environment (or default to localhost).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.ocal development.

## Deploying the app
This app is currently deployed as a Docker container on a DigitalOcean Droplet, alongside various other containerised apps. These containerised apps are managed through the [ServerConfig](https://github.com/wjrm500/ServerConfig) repository, which includes a variety of Docker Compose configurations that reference Docker images stored on Docker Hub. Thus, to deploy any new code changes, we need to (A) build the image locally, (B) push the image up to Docker Hub, (C) SSH into the Droplet, (D) pull the image, and (E) restart the container.

Locally...

(A) Build the image:
```bash
docker build -t wjrm500/wordlewise-frontend:latest .
```

(B) Push the image:
```bash
docker login
docker push wjrm500/wordlewise-frontend:latest
```

On the remote server...

(D) Pull the image:
```bash
docker compose -p wordlewise -f /home/ServerConfig/wordlewise-docker-compose.yml pull
```

(E) Restart the container:
```bash
docker compose -p wordlewise -f /home/ServerConfig/wordlewise-docker-compose.yml up -d
```