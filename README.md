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
6. Start the React development server:

    ```bash
    npm start
    ```

    The app will run at http://localhost:3000 and any code changes will cause the app to automatically reload, which is handy for local development.

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