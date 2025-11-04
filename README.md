![WhatsApp Image 2025-11-04 at 16 33 56_72f3db64](https://github.com/user-attachments/assets/3f91451d-07c8-4c82-8fa0-1b67144c4184)# Excel Analytics Platform

> Upload Excel files and instantly turn them into interactive 2D/3D visualizations and dashboards — no coding required.

---

## 🚀 Project Overview

Excel Analytics Platform is a web application that allows users to upload `.xlsx` / `.xls` files, explore data fields, and create interactive visualizations (bar, pie, scatter, histogram, heatmap, 2D/3D charts). Users can save analysis history, download charts, and admins/superadmins can manage users and view dashboards.


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

![WhatsApp Image 2025-11-04 at 16 33 56_72f3db64](https://github.com/user-attachments/assets/55a6c020-ccde-4713-89e8-4f59e5cef7ee)

![WhatsApp Image 2025-11-04 at 16 34 17_e85b9912](https://github.com/user-attachments/assets/d6070383-c142-48d5-ba70-3a31ab530266)

![WhatsApp Image 2025-11-04 at 16 34 38_574e0d86](https://github.com/user-attachments/assets/7ec593b4-ae44-40e4-b0f8-2063165df774)

![WhatsApp Image 2025-11-04 at 16 35 25_5afd1fbf](https://github.com/user-attachments/assets/dc6605ff-f068-46dd-bbba-49157e576467)

![WhatsApp Image 2025-11-04 at 16 35 50_be99219c](https://github.com/user-attachments/assets/f3b1e8b3-4023-4634-827b-2bf150fbd984)

![WhatsApp Image 2025-11-04 at 16 36 22_bbf30283](https://github.com/user-attachments/assets/83673973-1da1-4130-a2e8-62e9f2c4d3c0)

![WhatsApp Image 2025-11-04 at 16 37 13_06e33d68](https://github.com/user-attachments/assets/ce488db2-0878-4c43-8790-5bca205b8683)

![WhatsApp Image 2025-11-04 at 16 37 53_ab534ba8](https://github.com/user-attachments/assets/86915dd8-763f-4db5-86fe-27803fc9868c)

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

