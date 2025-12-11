# X Tic-Tac-Toe — React Client

A comprehensive Tic-Tac-Toe game demo front-end built with the React.js stack. This application supports both single-player (vs AI) and multiplayer (via WebSocket) game modes.

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Diagram](#architecture-diagram)
4. [Project Structure](#project-structure)
5. [Component Hierarchy](#component-hierarchy)
6. [Routing Architecture](#routing-architecture)
7. [State Management](#state-management)
8. [Game Flow](#game-flow)
9. [WebSocket Communication](#websocket-communication)
10. [Configuration](#configuration)
11. [Getting Started](#getting-started)
12. [Suggested Improvements](#suggested-improvements)

---

## Overview

The React client provides a modern, responsive UI for playing Tic-Tac-Toe. Key features include:

| Feature             | Description                                        |
| ------------------- | -------------------------------------------------- |
| **Single Player**   | Play against a basic AI opponent                   |
| **Multiplayer**     | Real-time play against another human via WebSocket |
| **Persistent Name** | Player name saved to localStorage                  |
| **Animations**      | Smooth transitions using GSAP (TweenMax)           |
| **Analytics**       | Google Analytics integration                       |
| **Responsive**      | Mobile and desktop support                         |

---

## Technology Stack

| Technology           | Version | Purpose                            |
| -------------------- | ------- | ---------------------------------- |
| **React**            | 15.2.0  | UI framework                       |
| **React Router**     | 2.5.2   | Client-side routing                |
| **Vite**             | 4.x     | Build tool and dev server          |
| **Ampersand-app**    | 2.0.0   | Global application state singleton |
| **Socket.IO Client** | 4.7.2   | WebSocket communication            |
| **GSAP**             | 1.18.5  | Animations                         |
| **Sass**             | 1.69.x  | CSS preprocessing                  |
| **Jest**             | 29.7.0  | Unit testing                       |

---

## Architecture Diagram

```mermaid
flowchart TB
    subgraph Browser["CLIENT (Browser)"]
        subgraph AppLayer["Application Layer"]
            AppJS["app.jsx<br/>Entry Point"]
            Router["React Router<br/>Route Configuration"]
            AmpersandApp["ampersand-app<br/>Global State"]
        end

        subgraph Views["Views Layer"]
            Main["Main.jsx<br/>Root Layout"]

            subgraph Layouts["Layout Components"]
                MainContent["MainContent.jsx"]
                Header["Header.jsx"]
                Footer["Footer.jsx"]
                PopUp["PopUp.jsx"]
            end

            subgraph TTT["Tic-Tac-Toe Components"]
                Ttt["Ttt.jsx<br/>Game Router"]
                MainMenu["MainMenu.jsx"]
                SetName["SetName.jsx"]
                GameMain["GameMain.jsx<br/>Game Logic"]
                GameStat["GameStat.jsx"]
                About["About.jsx"]
            end

            subgraph Pages["Page Components"]
                TxtPage["Txt_page.jsx"]
                Contact["Contact.jsx"]
                ErrorPage["ErrorPage.jsx"]
            end
        end

        subgraph Helpers["Helpers"]
            RandArrElem["rand_arr_elem.js"]
            RandToFro["rand_to_fro.js"]
            SerializeParams["serialize_params.js"]
            FindObjByVal["find_obj_by_val.js"]
        end

        subgraph Models["Models"]
            PrepEnv["prep_env.js<br/>Configuration Loader"]
        end
    end

    subgraph External["External"]
        WSConf["ws_conf.xml<br/>Site Configuration"]
        SocketServer["Socket.IO Server<br/>(WS Project)"]
    end

    AppJS --> Router
    AppJS --> AmpersandApp
    Router --> Main
    Main --> MainContent
    MainContent --> Ttt
    Ttt --> MainMenu
    Ttt --> SetName
    Ttt --> GameMain
    Ttt --> About
    GameMain --> GameStat
    GameMain -.->|WebSocket| SocketServer
    PrepEnv -->|Loads| WSConf
    AmpersandApp -->|Stores| WSConf
```

---

## Project Structure

```
react_ws_src/
├── babel.config.cjs      # Babel configuration for Jest
├── devServer.js          # Legacy webpack dev server (deprecated)
├── index.html            # HTML entry point
├── jest.config.cjs       # Jest test configuration
├── package.json          # Dependencies and scripts
├── vite.config.mjs       # Vite build configuration
├── webpack.config.*.js   # Legacy webpack configs (deprecated)
│
├── src/
│   ├── app.jsx           # Application entry point & router setup
│   │
│   ├── helpers/          # Utility functions
│   │   ├── find_obj_by_val.js    # Find object in array by property value
│   │   ├── getBodyHeight.js      # Get document body height
│   │   ├── rand_arr_elem.js      # Get random array element
│   │   ├── rand_to_fro.js        # Generate random number in range
│   │   ├── serialize_params.js   # Serialize object to URL params
│   │   └── __tests__/            # Unit tests for helpers
│   │
│   ├── models/
│   │   ├── prep_env.js           # Environment/config preparation
│   │   └── __tests__/
│   │
│   ├── sass/                     # SCSS stylesheets
│   │   ├── main.scss             # Main stylesheet (imports all)
│   │   ├── ttt.scss              # Game-specific styles
│   │   ├── _variables.scss       # SCSS variables
│   │   ├── _mixins.scss          # SCSS mixins
│   │   ├── _normalize.scss       # CSS reset
│   │   └── _*.scss               # Component-specific partials
│   │
│   └── views/
│       ├── Main.jsx              # Root layout component
│       │
│       ├── layouts/              # Reusable layout components
│       │   ├── MainContent.jsx   # Main content wrapper
│       │   ├── Header.jsx        # Site header (navigation)
│       │   ├── Footer.jsx        # Site footer
│       │   ├── MessageBar.jsx    # Notification bar
│       │   └── PopUp.jsx         # Modal popup wrapper
│       │
│       ├── pages/                # Static page components
│       │   ├── Txt_page.jsx      # XML-driven text pages
│       │   ├── Contact.jsx       # Contact form
│       │   ├── PopUp_page.jsx    # Popup content wrapper
│       │   └── ErrorPage.jsx     # Error handling page
│       │
│       └── ttt/                  # Tic-Tac-Toe game components
│           ├── Ttt.jsx           # Game mode router
│           ├── MainMenu.jsx      # Main menu
│           ├── SetName.jsx       # Player name input
│           ├── GameMain.jsx      # Core game logic
│           ├── GameStat.jsx      # Game status display
│           ├── About.jsx         # About page
│           └── __tests__/
│
└── static/
    ├── ws_conf.xml               # Site configuration (XML)
    └── images/                   # Static images
```

---

## Component Hierarchy

```mermaid
graph TD
    App["app.jsx"] --> Router["Router"]
    Router --> Main["Main"]

    Main --> MainContent["MainContent"]
    Main --> Popup["Popup Slot"]

    MainContent --> Ttt["Ttt"]
    MainContent --> TxtPage["Txt_page"]
    MainContent --> ErrorPage["ErrorPage"]

    Popup --> Contact["Contact"]
    Popup --> PopUpPage["PopUp_page"]

    Ttt --> MainMenu["MainMenu"]
    Ttt --> SetName["SetName"]
    Ttt --> GameMain["GameMain"]
    Ttt --> About["About"]

    GameMain --> GameStat["GameStat"]

    style Ttt fill:#e1f5fe
    style GameMain fill:#e1f5fe
    style GameStat fill:#e1f5fe
```

---

## Routing Architecture

```mermaid
flowchart LR
    subgraph Routes["Route Configuration"]
        Root["/"] --> IndexRoute["Ttt (MainMenu)"]
        Single["/single"] --> TttSingle["Ttt (GameMain - AI)"]
        Multi["/multi"] --> TttMulti["Ttt (SetName → GameMain - Live)"]
        AboutRoute["/about"] --> TttAbout["Ttt (About)"]
        Pg["/pg/:page"] --> TxtPage["Txt_page"]
        PuPg["/pupg/:pu_page"] --> PopUpPage["PopUp_page (popup)"]
        ContactRoute["/contact-us"] --> ContactPage["Contact (popup)"]
        Error["/error/404"] --> ErrorPage["ErrorPage"]
        CatchAll["*"] --> ErrorPage
    end
```

| Route             | Component                | Description              |
| ----------------- | ------------------------ | ------------------------ |
| `/`               | Ttt → MainMenu           | Main game menu           |
| `/single`         | Ttt → GameMain           | Single player vs AI      |
| `/multi`          | Ttt → SetName → GameMain | Multiplayer mode         |
| `/about`          | Ttt → About              | About page               |
| `/pg/:page`       | Txt_page                 | Dynamic XML-driven pages |
| `/pupg/:pu_page`  | PopUp_page               | Popup content pages      |
| `/contact-us`     | Contact                  | Contact form popup       |
| `/error/404`, `*` | ErrorPage                | Error handling           |

---

## State Management

The application uses **ampersand-app** as a global singleton for application-wide state:

```mermaid
classDiagram
    class AmpersandApp {
        +settings: Object
        +history: History
        +init()
        +start()
        +start_ga()
        +show_page(url)
    }

    class Settings {
        +is_mobile: boolean
        +mobile_type: string
        +can_app: boolean
        +ws_conf: Object
        +curr_user: Object
        +user_ready: boolean
        +hasFlash: boolean
    }

    AmpersandApp --> Settings : contains
```

### State Flow

```mermaid
sequenceDiagram
    participant App as app.jsx
    participant PrepEnv as prep_env.js
    participant XML as ws_conf.xml
    participant Settings as app.settings
    participant React as React Components

    App->>PrepEnv: init()
    PrepEnv->>XML: HTTP GET
    XML-->>PrepEnv: XML Response
    PrepEnv->>Settings: Store ws_conf
    PrepEnv->>Settings: Set device/mobile flags
    PrepEnv->>App: callback (start)
    App->>React: renderSite()
```

---

## Game Flow

### Single Player (vs AI)

```mermaid
sequenceDiagram
    participant User
    participant GameMain
    participant AI as AI Logic

    User->>GameMain: Click cell
    GameMain->>GameMain: turn_ply_comp()
    GameMain->>GameMain: check_turn()

    alt Game not over
        GameMain->>AI: turn_comp() (delayed 500-1000ms)
        AI->>GameMain: Random move
        GameMain->>GameMain: check_turn()
    else Win/Draw
        GameMain->>User: Display result
    end
```

### Multiplayer (WebSocket)

```mermaid
sequenceDiagram
    participant P1 as Player 1
    participant Client as GameMain
    participant Server as Socket.IO Server
    participant P2 as Player 2

    P1->>Client: Enter name
    Client->>Server: connect + "new player"
    Server-->>Client: "pair_players" (when matched)

    loop Game Loop
        P1->>Client: Click cell
        Client->>Server: "ply_turn" {cell_id}
        Server->>Server: Validate move
        Server-->>P2: "opp_turn" {cell_id}

        alt Game Over
            Server-->>P1: "game_over" {result, winningCells}
            Server-->>P2: "game_over" {result, winningCells}
        end
    end
```

---

## WebSocket Communication

### Events (Client → Server)

| Event        | Payload               | Description            |
| ------------ | --------------------- | ---------------------- |
| `new player` | `{ name: string }`    | Register as new player |
| `ply_turn`   | `{ cell_id: string }` | Submit a move (c1-c9)  |

### Events (Server → Client)

| Event                   | Payload                             | Description           |
| ----------------------- | ----------------------------------- | --------------------- |
| `pair_players`          | `{ opp, mode, symbol, gameCode }`   | Matched with opponent |
| `opp_turn`              | `{ cell_id: string }`               | Opponent made a move  |
| `game_over`             | `{ result, message, winningCells }` | Game ended            |
| `opponent_disconnected` | `{ message }`                       | Opponent left         |
| `server_full`           | `{ message }`                       | Server at capacity    |
| `turn_error`            | `{ error }`                         | Invalid move rejected |

---

## Configuration

Site configuration is loaded from `static/ws_conf.xml` at startup:

```xml
<data>
    <site>
        <vals year="2016" author="..." />
    </site>
    <conf>
        <ga_acc an="UA-XXXXX" />  <!-- Google Analytics -->
    </conf>
    <loc>
        <SOCKET__io u="wss://your-server.com" />  <!-- WebSocket URL -->
    </loc>
    <header>...</header>
    <footer>...</footer>
    <pgs>...</pgs>  <!-- Dynamic page content -->
</data>
```

---

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

### Testing

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

Output to `dist/` folder.

---

## Suggested Improvements

### Critical / High Priority

1. **Upgrade React Version**

   - Current: React 15.2.0 (2016)
   - React 15 is significantly outdated and lacks modern features
   - Migrate to React 18.x for Concurrent Mode, Suspense, automatic batching
   - Replace deprecated `React.PropTypes` with the `prop-types` package

2. **Upgrade React Router**

   - Current: react-router 2.5.2 (deprecated API)
   - Migrate to react-router-dom v6 with modern hooks (`useNavigate`, `useParams`)

3. **State Management Modernization**

   - Replace `ampersand-app` singleton with modern alternatives:
     - React Context + useReducer for simpler state
     - Zustand or Jotai for lightweight global state
     - Redux Toolkit if complexity grows
   - Avoid direct state mutation (`this.state.cell_vals = ...`)

4. **Convert Class Components to Functional Components**
   - Use React Hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
   - Improves readability and enables better code reuse

### Medium Priority

5. **TypeScript Migration**

   - Add type safety to catch errors at compile time
   - Improves IDE support and documentation

6. **Improve AI Logic**

   - Current AI is random; implement Minimax algorithm
   - Add difficulty levels (Easy, Medium, Hard)

7. **Remove Deprecated Dependencies**

   - Remove unused webpack configs
   - Update `gsap` to v3 (modern syntax)
   - Replace `x2js` XML parsing with JSON configuration

8. **Better Error Handling**

   - Add Error Boundaries for graceful UI failure
   - Improve WebSocket reconnection logic
   - Add user-friendly error messages

9. **Code Organization**

   - Split `GameMain.jsx` (568 lines) into smaller components
   - Extract game logic into custom hooks
   - Move Socket.IO logic to a dedicated service/hook

10. **Testing Improvements**
    - Add integration tests for game flow
    - Add component tests with React Testing Library
    - Increase test coverage (currently minimal)

### Low Priority / Nice-to-Have

11. **Accessibility (a11y)**

    - Add ARIA labels to game board cells
    - Keyboard navigation for game cells
    - Screen reader announcements for turns/results

12. **Performance Optimizations**

    - Memoize components with `React.memo`
    - Use `useMemo`/`useCallback` for expensive operations
    - Lazy load routes with `React.lazy`

13. **UX Improvements**

    - Add sound effects
    - Add game replay functionality
    - Show move history
    - Add player statistics/leaderboard

14. **Replace XML Configuration**

    - Use JSON or environment variables
    - Simplify configuration loading

15. **Mobile PWA Support**
    - Add service worker
    - Add manifest.json
    - Enable offline single-player mode

---

## License

This project is licensed under Creative Commons.

Originally created by **Maxim Shklyar** ([xims](https://github.com/xims/X-ttt)) at kisla interactive.
