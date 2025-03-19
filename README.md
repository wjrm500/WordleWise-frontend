# WordleWise Frontend

This is the frontend application for WordleWise, a tool for tracking daily Wordle scores between players. It's built with React and communicates with a Flask backend API.

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Setup
1. Clone this repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure the environment:
- For development: Ensure you have a `.env.development` file with:
  ```
  REACT_APP_API_URL=http://localhost:5000
  REACT_APP_ENV=dev
  ```
- For production: Ensure you have a `.env.production` file with:
  ```
  REACT_APP_API_URL=https://api.wordlewise.wjrm500.com
  REACT_APP_ENV=prod
  ```
4. Start the development server:
    ```bash
    npm start
    ```
    The app will run at http://localhost:3000

## Docker Deployment
This application is deployed using Docker. The Dockerfile performs these steps:
1. Builds the React application
2. Creates an Nginx container to serve the static files

### Building the Docker Image
```bash
docker build -t wjrm500/wordlewise-frontend:latest .
```

### Running the Docker Container Locally
```docker run -p 3000:80 wjrm500/wordlewise-frontend:latest```

## Deployment Infrastructure
The application is deployed on a DigitalOcean Droplet with:

- Docker and Docker Compose for containerisation
- Nginx as a reverse proxy
- Let's Encrypt for SSL certificates

Production deployment is managed through the ServerConfig repository, where Docker Compose orchestrates both the frontend and backend services.

## Features
- Daily tracking of Wordle scores
- Weekly summaries and comparisons
- Historical records and statistics
- Performance charts and trends