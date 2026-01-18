# 🚀 How to Deploy this House Rental System

This guide will help you deploy this project to the web for free, so you can add it to your portfolio.

## Prerequisites

1.  A **GitHub** account (where this code lives).
2.  A **MongoDB Atlas** account (for the cloud database).
3.  A **Render** account (to host the website).

---

## Step 1: Set up the Cloud Database (MongoDB Atlas)

1.  **Register:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2.  **Create Cluster:** detailed instructions:
    *   Click **Build a Database**.
    *   Select **M0** (Free Tier).
    *   Click **Create**.
3.  **Setup User:**
    *   Create a username (e.g., `admin`) and a **password**.
    *   **Write down this password**, you will need it in 5 minutes.
4.  **Allow Access:**
    *   Go to **Network Access** in the left menu.
    *   Click **Add IP Address**.
    *   Select **Allow Access from Anywhere** (`0.0.0.0/0`).
    *   Click **Confirm**.
5.  **Get the Connection String:**
    *   Click **Database** in the left menu.
    *   Click **Connect** button on your cluster.
    *   Select **Drivers**.
    *   **Copy** the connection string (it looks like `mongodb+srv://...`).

---

## Step 2: Deploy the Website (Render)

1.  **Register:** Go to [Render.com](https://render.com/) and sign up using your GitHub account.
2.  **New Web Service:**
    *   Click the **New +** button and select **Web Service**.
    *   Select **Build and deploy from a Git repository**.
    *   Choose your `House-rental-system` repository.
3.  **Configure:**
    *   **Name:** Give your site a name (e.g., `house-rental-portfolio`).
    *   **Region:** Choose the one closest to you (e.g., Singapore).
    *   **Start Command:** `node src/app.js` (Default).
4.  **Environment Variables (Crucial):**
    *   Scroll down to the **Environment Variables** section.
    *   Click **Add Environment Variable**.
    *   **Key:** `DB_URL`
    *   **Value:** Paste your MongoDB connection string from Step 1.
    *   **IMPORTANT:** Replace `<password>` in the connection string with your actual database password.
5.  **Launch:**
    *   Click **Create Web Service**.

---

## Step 3: Done!

Wait for Render to build your app (2-3 minutes). Once the status is **Live**, copy the URL at the top (e.g., `https://house-rental-portfolio.onrender.com`).

**Add this URL to your Portfolio!** 🎉
