# Government Portal

Digital government services portal with a **Flask** backend and **React** frontend.

## Project structure

```
Government/
├── backend/     # Flask API (Python)
├── frontend/    # React app
└── package.json
```

## Setup

### Backend

```bash
cd Government/backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd Government/frontend
npm install
npm start
```

## Notes

- Local databases, uploads, and `node_modules` are excluded via `.gitignore`.
- After cloning, run setup steps above to install dependencies and create local data.
