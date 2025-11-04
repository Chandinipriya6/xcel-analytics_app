# Excel Analytics Platform

> Upload Excel files and instantly turn them into interactive 2D/3D visualizations and dashboards — no coding required.

---

## 🚀 Project Overview

Excel Analytics Platform is a web application that allows users to upload `.xlsx` / `.xls` files, explore data fields, and create interactive visualizations (bar, pie, scatter, histogram, heatmap, 2D/3D charts). Users can save analysis history, download charts, and admins/superadmins can manage users and view dashboards.

This README was created to be used in the project's GitHub repository. Replace any placeholder paths with actual paths in your repo (for example: `docs/screenshots/`).

---

## 🔥 Key Features

* Upload Excel files and parse sheets and columns
* Drag & drop field selector for easy chart building
* Multiple chart types: Bar, Pie, Scatter, Histogram, Heatmap, 2D & 3D
* Interactive charts with tooltips and zoom
* Download charts as images
* Save analysis history with a short summary (min, max, average)
* User authentication with roles: User, Admin, SuperAdmin
* Admin dashboard with user stats, weekly activity and admin approvals
* Responsive UI design and appealing theme

---

## 🧩 Tech Stack

* **Frontend:** HTML, CSS, JavaScript, React
* **Backend:** Node.js
* **Database:** MongoDB (Mongoose) 
* **Authentication:** Passport.js / JWT 
* **File parsing:** `xlsx` / `pandas`
* **Charting:** Chart.js, Plotly.js

---

## 📁 Repository Structure (suggested)

```
excel-analytics-platform/
├─ client/                 # Frontend app (React or plain HTML/CSS/JS)
│  ├─ public/
│  └─ src/
├─ server/                 # Backend (Express or Flask)
│  ├─ routes/
│  ├─ controllers/
│  └─ models/
├─ docs/
│  └─ screenshots/         # Add the screenshots used in this README
├─ .env.example
├─ package.json
└─ README.md
```

---

## 🛠️ Installation & Local Setup

> The steps below a Node.js + Express + MongoDB backend with a separate frontend in `client/`.

1. **Clone the repo**

```bash
git clone https://github.com/Chandinipriya6/xcel-analytics_app
cd excel-analytics-platform
```

2. **Install server dependencies**

```bash
cd server
npm install
```

3. **Install client dependencies (if React)**

```bash
cd ../client
npm install
```

4. **Environment variables**

* Copy `.env.example` to `.env` and fill in values:

```
MONGODB_URI=
JWT_SECRET=
PORT=3000
```

5. **Start the backend**

```bash
cd server
npm run dev
```

6. **Start the frontend**

```bash
cd ../client
npm start
```

Open `http://localhost:3000` (or the port you configured).

---

## 🧪 Example Usage

1. Register as a **User** and login.
2. Go to **Upload Excel File** and provide a table name, description and upload `.xlsx` file.
3. After upload, open the file fields panel. Drag the column names into the X/Y slots and select chart type (Bar, Pie, Scatter, Histogram, Heatmap).
4. Customize 2D/3D view and press **Save Analysis** to store the visualization with summary.
5. View **My Analysis History** to re-open or delete saved analyses.

---

## 📸 Screenshots

Add the screenshots to `docs/screenshots/` in your repo and reference them below (replace file names if different):

![Landing page](docs/screenshots/landing.png)

![Login/Register](docs/screenshots/login.png)

![Upload Form](docs/screenshots/upload.png)

![Chart Builder](docs/screenshots/chart-builder.png)

![Analysis History](docs/screenshots/analysis-history.png)

![Admin Dashboard](docs/screenshots/admin-dashboard.png)

---

## 🔐 Roles & Permissions

* **User:** Upload files, create visualizations, save analysis history.
* **Admin:** Manage user uploads, view analytics for their assigned scope, approve/reject content.
* **SuperAdmin:** Full access to all user/admin records and global dashboard metrics.

---

## 🔁 API Endpoints (example)

> Provide real endpoints and request/response samples from your server.

```
POST   /api/auth/register     # Register user
POST   /api/auth/login        # Login (returns token)
POST   /api/files/upload      # Upload Excel file
GET    /api/files/:id         # Get file metadata & fields
POST   /api/analysis/save     # Save chart analysis
GET    /api/analysis/history  # List saved analysis for user
GET    /api/admin/users       # Admin: list users
PUT    /api/admin/user/:id    # Admin: update user status
```

---

## ✅ To-do / Roadmap

* [ ] Add real-time collaboration on dashboards
* [ ] Advanced AI insights for anomaly detection and trend prediction
* [ ] More chart types (boxplot, violin plots, time series forecasting)
* [ ] User settings and profile pictures
* [ ] CI/CD + deploy to Heroku / Render / Vercel

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"
4. Push: `git push origin feature/your-feature`
5. Create a Pull Request and describe the change

---

## 📬 Contact

Created by **Pasagada Chandini priya** 

* Email: `chandinipriya643@gmail.com`

---

