# Government Portal

Digital government services portal — **Flask** backend + **React** frontend.

| Link | URL |
|------|-----|
| **Source code** | [github.com/bhautik0012/Government-potal](https://github.com/bhautik0012/Government-potal) |
| **Live app (phone / browser)** | Deploy once on Render — see below |

## Open on your phone (no local run)

Deploy from GitHub to get **one public link** (works on mobile Safari/Chrome):

1. Sign in at [render.com](https://render.com) (free account).
2. **New → Blueprint** → connect repo [Government-potal](https://github.com/bhautik0012/Government-potal).
3. Render reads `render.yaml` and builds backend + frontend automatically.
4. When deploy finishes, open your app URL, e.g. `https://government-potal.onrender.com` — bookmark it on your phone.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/bhautik0012/Government-potal)

> Free tier may sleep after ~15 min idle; first open can take ~30 seconds to wake up.

## Project structure

```
Government/
├── backend/     # Flask API + serves React build in production
├── frontend/    # React app
└── package.json
```

## Local development

**Backend**

```bash
cd Government/backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Frontend** (separate terminal)

```bash
cd Government/frontend
npm install
npm start
```

Frontend uses `http://127.0.0.1:5000` via `.env.development`.

**Production-like local test** (single URL)

```bash
cd Government/frontend && npm run build
# copy build to backend/static, then run python app.py
# open http://localhost:5000
```

## Notes

- Databases, uploads, and `node_modules` are in `.gitignore`.
- After clone: install deps, run backend, optionally hit `/api/seed-all` for admin user.
