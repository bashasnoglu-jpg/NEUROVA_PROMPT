# Deployment Guide

This guide outlines how to deploy the SANTIS Spa & Wellness website to various hosting platforms.

## Prerequisites

- A Git repository (GitHub, GitLab, or Bitbucket).
- A build process is not strictly required as this is a static site, but using a CI/CD pipeline is recommended for automated deployments.

## Hosting Providers

### Netlify

This project includes a `netlify.toml` configuration file optimized for Netlify.

1.  Log in to Netlify and click **"New site from Git"**.
2.  Connect your repository.
3.  **Build settings**:
    -   **Base directory**: `/` (Root)
    -   **Publish directory**: `.` (Root) or leave blank if using `netlify.toml`.
4.  Deploy site.

The `netlify.toml` file handles:
-   Redirecting the root URL (`/`) to the Turkish home page (`/tr/`).
-   Custom 404 error page handling.
-   Disabling caching for `sw.js` to ensure PWA updates work immediately.

### Vercel

This project includes a `vercel.json` configuration file.

1.  Log in to Vercel and click **"Add New..."** > **"Project"**.
2.  Import your Git repository.
3.  **Framework Preset**: Select "Other".
4.  **Root Directory**: `./`
5.  Deploy.

The `vercel.json` file handles:
-   Redirects from `/` to `/tr/`.
-   Cache-Control headers for the Service Worker.

### GitHub Pages

1.  Go to your repository **Settings** > **Pages**.
2.  Select the branch (e.g., `main`) and folder (root `/`).
3.  Save.

*Note: For GitHub Pages, you might need to ensure the `CNAME` file is present if using a custom domain.*

## Manual Deployment (FTP/SFTP)

If deploying to a traditional shared hosting server (Apache/Nginx):

1.  Upload all files from the root directory to your `public_html` folder.
2.  Ensure your server is configured to serve `index.html` as the default document.
3.  **Important**: You must serve the site over **HTTPS**. Service Workers and PWA features will **not** work over insecure HTTP connections.

## PWA Considerations

-   **HTTPS is mandatory**: The Service Worker (`sw.js`) will fail to register if the site is not served over HTTPS (except on `localhost`).
-   **Service Worker Scope**: The `sw.js` file is located in the root to ensure it can control all pages under `/tr/`. Do not move it to a subdirectory without adjusting the scope registration.