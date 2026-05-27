# 🔍 LogPulse

Real-time log analysis and monitoring — because your logs deserve more than grep.

LogPulse is a full-stack log analysis platform that helps developers and DevOps engineers ingest, parse, search, and visualize application logs in real time. Instead of sifting through raw log files manually, LogPulse gives you a clean, browser-based dashboard to spot errors, track trends, and drill into what's actually happening inside your application — fast.

# 📌 Table of Contents

What is LogPulse?\
Features\
Tech Stack\
Project Structure\
Getting Started\
Clone the Repository\
How to Access\
Contributing\
License\

# What is LogPulse?
Modern applications produce enormous volumes of logs — server errors, API calls, user events, database queries — and hunting through them manually is painful and slow.\
LogPulse bridges that gap. It provides:

A Java-powered backend (loganalyzer) that parses, processes, and indexes log data.\
A JavaScript/HTML/CSS frontend (frontend) that gives you a live, interactive view of your log streams.\
A simple, self-hosted setup that you can run locally or deploy to any server.\

# ✨ Features

📂 Log Ingestion — Upload or stream log files directly into the analyzer\
🔎 Search & Filter — Query logs by keyword, log level (INFO / WARN / ERROR), timestamp range, or custom patterns\
📊 Log Level Breakdown — Visual summary of error distribution across your log data\
🕒 Timestamp Parsing — Automatic detection and sorting of log entries by time\
🌐 Browser-Based Dashboard — Access everything from a clean web UI — no CLI required\
⚙️ Backend Analysis Engine — Java core handles heavy parsing and pattern matching\
🔄 Real-time Updates — Live-refresh of log data as new entries come in\

# 🛠 Tech Stack
Backend Java (Spring Boot)\
Frontend JavaScript ( React), HTML5, CSS3\
Build Tools Maven / npmDev\
Environment VS Code (.vscode config included)\

# 📁 Project Structure
LogPulse/ \
├── frontend          
│   ├── index.html \
│   ├── styles/ \
│   └── scripts \
├── loganalyzer     
│   ├── src/ \
│   └── pom.xml / build files \
├── .vscode/         \
└── README.md

# 🚀 Getting Started
Prerequisites
Make sure you have the following installed before running LogPulse:

Java 11 or higher

### Clone the Repository
```
git clone https://github.com/mani-shika/LogPulse.git
cd LogPulse
```
### Running the Backend
Navigate to the loganalyzer directory and start the Java backend:
```
cd loganalyzer
```

If using Maven:
```
mvn clean install
mvn spring-boot:run
```
## #Running the Frontend
Open a new terminal tab, navigate to the frontend directory, and serve the UI:
```
cd frontend
```
```
npm install
npm start
```

## 🤝 Contributing
Contributions are welcome! To get started:
```
# Fork the repo, then clone your fork
git clone https://github.com/<your-username>/LogPulse.git
cd LogPulse

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes, then commit
git add .
git commit -m "feat: describe your change"

# Push and open a pull request
git push origin feature/your-feature-name
```

📄 License
This project is open source. See the repository for license details
