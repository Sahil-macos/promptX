# Prompt Injection Defense Dashboard

A modern web-based dashboard for the Prompt Injection Defense System with real-time analysis and metrics visualization.

## Features

- **Real-time Analysis**: Analyze text and PDF inputs for prompt injection attacks
- **Security Gateway Integration**: Multi-layer detection (MVNet + Policy Engine + RoBERTa)
- **Live Metrics Dashboard**: View accuracy, precision, recall, F1-score, and confusion matrix
- **Modern UI**: Built with React, TailwindCSS, and shadcn/ui components
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

```
Frontend (React + Vite)
    ↓ HTTP API
Backend (Flask)
    ↓
Security Gateway (Python)
    ↓
ML Models (MVNet, RoBERTa)
```

## Prerequisites

- Python 3.8+
- Node.js 18+
- Existing prompt injection defense system setup

## Installation

### 1. Backend Setup

Navigate to the project root:

```bash
cd "/Users/sahilbaliyan/Desktop/prompt injection"
```

Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

## Running the Dashboard

### Step 1: Start the Backend API

From the project root:

```bash
python backend/api.py
```

The backend will start on `http://localhost:5001`

### Step 2: Start the Frontend

From the frontend directory (in a new terminal):

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### Step 3: Access the Dashboard

Open your browser and navigate to:

```
http://localhost:3000
```

## Usage

### Analyzing Text Input

1. Select "Text Input" from the toggle
2. Enter or paste your prompt in the text area
3. Click "Analyze Input"
4. View the security analysis results

### Analyzing PDF Input

1. Select "PDF Input" from the toggle
2. Enter the complete path to the PDF file
3. Click "Analyze Input"
4. View the security analysis results

### Understanding Results

- **ALLOW**: Input is safe and will proceed to the LLM
- **BLOCK**: Input was blocked due to potential prompt injection
- **Model 1 Risk Score**: Combined risk from MVNet and Policy Engine
- **Model 2 Triggered**: Whether secondary verification was needed
- **Gateway Time**: Processing time in milliseconds

## API Endpoints

### POST /api/analyze

Analyzes input for prompt injection.

**Request:**
```json
{
  "type": "text",
  "data": "Your prompt here"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "final_decision": "ALLOW",
    "model1_risk_score": 15.5,
    "model1_prediction": "BENIGN",
    "policy_score": 0.0,
    "model2_triggered": false,
    "gateway_time_ms": 8.2
  }
}
```

### GET /api/metrics

Returns system evaluation metrics.

**Response:**
```json
{
  "accuracy": 95.75,
  "precision": 97.41,
  "recall": 95.29,
  "f1_score": 96.34,
  "confusion_matrix": {
    "true_negatives": 376,
    "false_positives": 14,
    "false_negatives": 26,
    "true_positives": 526
  },
  "routing": {
    "allow_decisions": 402,
    "block_decisions": 540,
    "model2_triggered": 548,
    "model2_trigger_rate": 58.17,
    "avg_gateway_time_ms": 10.84
  },
  "test_samples": 942
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## Project Structure

```
prompt injection/
├── backend/
│   ├── api.py              # Flask API server
│   └── requirements.txt   # Backend dependencies
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── lib/
│       │   └── utils.js
│       └── components/
│           ├── ui/
│           │   ├── button.jsx
│           │   ├── card.jsx
│           │   ├── input.jsx
│           │   ├── textarea.jsx
│           │   └── badge.jsx
│           └── MetricsDashboard.jsx
└── DASHBOARD_SETUP.md
```

## Troubleshooting

### Backend Issues

**Error: Module not found**
- Ensure you're in the project root when running the backend
- Install dependencies: `pip install -r backend/requirements.txt`

**Error: Connection refused**
- Ensure the backend is running on port 5000
- Check if another process is using port 5000

### Frontend Issues

**Error: Cannot find module**
- Navigate to the frontend directory: `cd frontend`
- Install dependencies: `npm install`

**Error: API requests failing**
- Ensure the backend is running
- Check the browser console for CORS errors
- Verify the API proxy configuration in vite.config.js

### PDF Analysis Issues

**Error: No text extracted from PDF**
- Verify the PDF path is correct and absolute
- Ensure the PDF contains extractable text (not scanned images)
- Check file permissions

## Development

### Adding New Features

1. **Backend**: Add new endpoints in `backend/api.py`
2. **Frontend**: Create new components in `frontend/src/components/`
3. **Styling**: Use TailwindCSS utility classes
4. **UI Components**: Reuse existing shadcn/ui components

### Building for Production

Frontend:

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## Security Notes

- The dashboard runs locally and does not expose the ML models to the internet
- PDF paths are validated server-side
- All analysis happens on your local machine
- No data is sent to external services

## License

This dashboard is part of the Prompt Injection Defense System project.
