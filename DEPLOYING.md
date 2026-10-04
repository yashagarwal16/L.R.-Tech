# Deploying StudySpark

The frontend and Express API are served by the same Node.js container. This
keeps page routes and `/api` requests on one public origin, so no separate
frontend hosting or CORS configuration is needed. The container listens on
`PORT` (8080 by default) and reports health at `/health`.

Before deploying, have a MongoDB connection string ready and allow the cloud
service to connect to your MongoDB deployment. Set `MONGODB_URI` as a secret
environment variable in the hosting provider. Configure any email, Twilio,
Vapi, and public `VITE_` settings required by your site as described in
[README.md](./README.md). Never put private credentials in `VITE_` variables.
`VITE_` values are embedded in the frontend at image-build time. The Dockerfile
accepts them as build arguments; changing them requires rebuilding the image.
Do not use build arguments for private credentials.

These are three alternative deployment targets. Creating a service on each
provider means three separately hosted deployments and may incur charges.

## Render

1. In Render, create a **Blueprint** and connect this GitHub repository.
2. Render reads `render.yaml` and builds the root `Dockerfile`. Enter
   `MONGODB_URI` when prompted; add any other required environment variables
   before deploying.
3. Wait for the `/health` check to pass, then open the service URL. Add a
   custom domain in the service's settings if desired.

The Blueprint uses Render's Free plan, which may spin down when idle. Change
`plan` in `render.yaml` if you want a different supported plan.

## AWS App Runner

Build and publish the same Docker image to Amazon ECR (replace the example
region and account ID):

```bash
aws ecr create-repository --repository-name studyspark --region us-east-1
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
docker buildx build --platform linux/amd64 -t ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/studyspark:latest --push .
```

In App Runner, create a service from that ECR image. Select port `8080`, set
the HTTP health check path to `/health`, and provide `MONGODB_URI` and other
required settings as service environment variables/secrets. Allow App Runner
to access the private ECR repository. For later releases, publish a new image
tag and deploy that image from the App Runner service.

## Microsoft Azure

Use Azure Container Apps and its source deployment to build the root
Dockerfile. After logging in with `az login`, run:

```bash
az containerapp up \
  --name studyspark \
  --resource-group studyspark \
  --location eastus \
  --source . \
  --ingress external \
  --target-port 8080
```

In the created Container App, add `MONGODB_URI` and other required values under
**Secrets**, then reference them from the app's **Environment variables**.
Configure the health probe to use `/health`. Keep production secrets out of
the command line and source control. The generated app URL is the public site
and API origin.

For updates, run the source deployment again or deploy a newly built image
through Azure Container Registry.
