# Deploying an App in Coolify from a Private GitHub Repository (Specific Branch)

This guide shows how to create a new project in Coolify and deploy an application from a **private GitHub repository** via the already-connected **GitHub App**, targeting a specific branch.

## 1. Create a project

1. In the Coolify dashboard, go to **Projects → + Add**. - This is in case you want to create a new project environment that will create your deploy resources 
2. Enter a name (and optional description) and save.
3. A default **production** environment is created. Add more environments (e.g. `staging`) if needed.

<img width="1691" height="858" alt="Screenshot-20260909-134451-042686" src="https://github.com/user-attachments/assets/e79c0b99-9aad-4d57-9519-7fbcf7f4ed13" />

## 2. Add a new resource

1. Open the project and select the environment.
2. Click **+ New Resource**.
3. Under **Applications**, choose **Private Repository (with GitHub App)**.
4. Select the server and destination (network) to deploy to.

<img width="2052" height="831" alt="Screenshot-20260909-134518-405516" src="https://github.com/user-attachments/assets/322cf27c-9428-4661-ba88-b7eda923b5f3" />

## 3. Select the repository and branch

1. Choose the existing GitHub App from the **Source** dropdown.
2. Click **Load Repositories** and select the repository.
3. Choose the target branch from the **Branch** dropdown (e.g. `develop`, `release/1.2`).
4. Click **Continue**.

<img width="2052" height="1043" alt="Screenshot-20260909-134600-309414" src="https://github.com/user-attachments/assets/db42fdf3-91fb-4a6e-afc4-fd5659141289" />

## 4. Configure the build

- **Build Pack** – Dockerfile.
- **Port** – 80.
- **Base Directory** – set this if the app lives in a subfolder (monorepo).
- **Environment Variables** – ENVIRONMENT (value=> STAGING).
- **Domain** – set your own domain (Coolify provisions HTTPS automatically) or keep the generated one.

## 5. Deploy

1. Click **Deploy** and follow the build logs.
2. When the deployment succeeds, open the domain to verify the app.


## Changing the branch later

Open the application → **General** → change the **Branch** field → save → **Redeploy**.
