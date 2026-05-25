# Government Portal

Digital government services portal — **Flask** backend + **React** frontend.

| Link | URL |
|------|-----|
| **Source code** | [github.com/bhautik0012/Government-potal](https://github.com/bhautik0012/Government-potal) |
| **Live app (phone / browser)** | Deploy once on Render — see below |

## Open on your phone (no local run)

Use a **Web Service** (Python), not Static Site — backend + frontend deploy together.

### Render dashboard settings (copy these)

| Field | Value |
|-------|--------|
| **Service type** | Web Service |
| **Root Directory** | `Government` |
| **Runtime** | Python 3 |
| **Build Command** | `bash build.sh` |
| **Start Command** | `bash start.sh` |

> Do **not** put `Government` in Start Command or Build Command — that is only for **Root Directory**.

`Government` folder contains **both** `backend/` and `frontend/`.

### Quick deploy

1. [render.com](https://render.com) → **New → Web Service** (or Blueprint).
2. Connect [Government-potal](https://github.com/bhautik0012/Government-potal).
3. Set **Root Directory** to `Government` and commands from the table above (or use Blueprint — reads `render.yaml`).
4. Open your live URL on your phone and bookmark it.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/bhautik0012/Government-potal)

> If you only created a **Static Site**, API/login will not work. Delete it and use **Web Service** with `Government` as root.

> Free tier may sleep after idle; first open can take ~30 seconds.

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
