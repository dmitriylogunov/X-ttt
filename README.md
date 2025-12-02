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
