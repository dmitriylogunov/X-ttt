# A simple example of a full multiplayer game web app built with React.js and Node.js stack

Major libraries used on front end:
- react
- webpack
- babel
- react-router
- ampersand
- sass
- jest

Major libraries used on server:
- node.js
- socket.io
- express

### Folder structure:
- **WS** - server side and compiled front end
- **react_ws_src** - React development source and testing

---

### View it online at 
https://x-ttt.herokuapp.com/

#### Configurable with external XML file - 
https://x-ttt.herokuapp.com/ws_conf.xml

---

##For demonstration purposes only.

---

## Requirements
- Node.js 16.x (LTS) or newer with the bundled npm
- Two terminal sessions (React dev server and Node socket server run independently)

## Install dependencies
```bash
nvm install 16
nvm use 16

cd react_ws_src
npm install

cd ../WS
npm install
```

## Run locally
1. **React client** – from `react_ws_src` run `npm start` and open `http://localhost:3000` (webpack dev server with hot reload).
2. **Socket server** – from `WS` run `npm start`. The server listens on `PORT` (defaults to `3001`) and serves everything under `WS/public`.

## WS server endpoints

### HTTP
- `GET /` and all other asset paths are served via `express.static(__dirname + '/public')` inside `WS/Xttt.js`. Anything you copy into `WS/public` becomes directly reachable (for example `GET /ws_conf.xml`, `GET /images/*.png`, etc.). There are no custom REST controllers — only static hosting behind Express.

### Socket.io events
**Client → server**
- `new player` (`WS/XtttGame.js:onNewPlayer`) – expects at least `{ name }`. Creates a `Player`, tracks it in the global lobby, and immediately calls `pair_avail_players()` so two waiting users are matched.
- `ply_turn` (`WS/XtttGame.js:onTurn`) – payload `{ cell_id }`. The handler relays the move to the opponent’s socket and logs the action.
- `disconnect` (`WS/XtttGame.js:onClientDisconnect`) – built-in event. Removes the socket’s `Player` from both `players` and `players_avail`, logging whether it was an admin or a user socket.

**Server → client**
- `pair_players` (emitted inside `pair_avail_players()` in `WS/XtttGame.js`) – sent to each matched socket with `{ opp: { name, uid }, mode }`, where mode is `'m'` for the player who starts and `'s'` for the second. Establishes opponent metadata on the client.
- `opp_turn` (emitted from `onTurn`) – includes `{ cell_id }` so the opponent mirrors the move on their board.

## Production build
1. Build the React bundle:
   ```bash
   cd react_ws_src
   npm run build
   ```
2. Copy the generated assets into the server’s public folder. On Linux/macOS:
   ```bash
   cp -r dist/* ../WS/public/
   cp -r static/* ../WS/public/
   ```
   On Windows you can use the helper scripts: `npm run bc` (copy all) or `npm run bu` (only update bundle/style).
3. Start the Node socket server from `WS`:
   ```bash
   cd WS
   PORT=3001 npm start
   ```

## Testing & linting
- Client unit tests: `cd react_ws_src && npm test`
- Client linting: `cd react_ws_src && npm run lint`

Run tests before copying the bundle so the code under `WS/public` always matches the server you deploy.
