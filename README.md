# X Tic-Tac-Toe — Multiplayer Demo

A simple multiplayer Tic-Tac-Toe web app built with **React** and **Node.js**.

## Tech Stack

### Front End (`react_ws_src/`)
- React 15
- Vite 5
- Babel 7
- react-router
- ampersand-app
- Sass (dart-sass)
- Jest

### Server (`WS/`)
- Node.js / Express
- Socket.IO 4

---

## Folder Structure
| Path | Description |
|------|-------------|
| `WS/` | Socket server & compiled front-end assets |
| `react_ws_src/` | React source, dev tooling & tests |

---

## Requirements
- **Node.js 22+** (tested with v22.16)
- Two terminal sessions (client dev server and socket server run independently)

## Install Dependencies
```bash
nvm install 22
nvm use 22

cd react_ws_src
npm install

cd ../WS
npm install
```

## Run Locally
1. **React client** – from `react_ws_src`:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:3000` (Vite dev server with hot reload).

2. **Socket server** – from `WS`:
   ```bash
   npm start
   ```
   Listens on `PORT` (defaults to `3001`) and serves static files from `WS/public`.

---

## Configuration
Site settings (GA tracking, socket URL, menus, pages) live in `static/ws_conf.xml` and are fetched at runtime.

---

## WS Server Endpoints

### HTTP
All paths are served via `express.static` from `WS/public`. Copy built assets there for production.

### Socket.IO Events
| Direction | Event | Payload | Description |
|-----------|-------|---------|-------------|
| Client → Server | `new player` | `{ name }` | Registers player and attempts pairing |
| Client → Server | `ply_turn` | `{ cell_id }` | Sends move to opponent |
| Client → Server | `disconnect` | — | Cleans up player state |
| Server → Client | `pair_players` | `{ opp: { name, uid }, mode }` | Notifies both players of match (`mode`: `'m'` = first, `'s'` = second) |
| Server → Client | `opp_turn` | `{ cell_id }` | Relays opponent's move |

---

## Production Build
1. Build the React bundle:
   ```bash
   cd react_ws_src
   npm run build
   ```
2. Copy output to the server's public folder:
   ```bash
   cp -r dist/* ../WS/public/
   cp -r static/* ../WS/public/
   ```
3. Start the server:
   ```bash
   cd WS
   PORT=3001 npm start
   ```

---

## Testing & Linting
```bash
cd react_ws_src
npm test        # Jest unit tests
npm run lint    # ESLint
```

---

## Deployment
The server is Vercel/Heroku-ready (Node 22 engine declared in both `package.json` files). Set the `PORT` env var if needed.

---

*For demonstration purposes only.*
