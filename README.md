# Haultrackr Fullstack

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## Overview

**HaulTrackr** is a full-stack application designed to help truck drivers plan optimal routes and manage Electronic Logging Device (ELD) logs, ensuring compliance with Hours of Service (HOS) regulations. The system integrates a React frontend for user interaction and a Django backend for route planning, log generation, and compliance logic.

Deployed Frontend: https://haultrackr.onrender.com 

Deployed Backend: https://haultrackr-fullstack.onrender.com/api

## Project Structure

```
haultrackr-fullstack/
├── apps/
│   ├── backend/             # Django backend application
│   │   ├── eld_logs/        # ELD logs management
│   │   ├── route_planner/   # Route planning and optimization
│   │   ├── users/           # User authentication and management
│   │   └── haultrackrbackend/  # Main Django project configuration
│   │
│   ├── frontend/            # React frontend application
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Page components
│   │   │   ├── lib/         # Utility functions and libraries
│   │   │   ├── types/       # TypeScript type definitions
│   │   │   └── App.tsx      # Main application component
│   │   └── ...
│   │
│   └── frontend-e2e/        # End-to-end tests
│
├── .github/                 # GitHub configuration
├── .vscode/                 # VS Code settings
├── node_modules/            # Frontend dependencies
├── venv/                    # Python virtual environment
├── .gitignore               # Git ignore file
├── package.json             # Frontend dependencies
├── pnpm-lock.yaml           # Lock file for pnpm
├── README.md                # This file
└── tsconfig.base.json       # TypeScript configuration
```

### Key Features

- **Route Planning:** Calculates optimal truck routes using the OpenRouteService API, factoring in HOS rules, rest stops, and fuel stops.
- **ELD Log Generation:** Automatically generates HOS-compliant ELD logs and visual log sheets for each trip.
- **Trip Management:** Allows users to create, view, and manage multi-day trips.
- **Rest & Fuel Stop Optimization:** Plans required rest and fuel stops along the route.
- **Authentication:** Secure user registration and login with JWT-based authentication.
- **Interactive UI:** Modern React frontend with map visualization, trip forms, and log sheet display.
- **User Authentication:** Secure user registration and login system

### System Architecture

- **Frontend:**
  - React with TypeScript
  - Vite for build tooling
  - React Router for navigation

- **Backend:**
  - Django REST Framework
  - SQLite database (default)
  - JWT authentication
  - Modular architecture with separate apps for different features

- **API Docs:** 
  - Swagger and ReDoc available at `/swagger/` and `/redoc/` on the backend server

---

## Setup

### Prerequisites

- Node.js (v14 or later)
- Python (3.8 or later)
- pnpm (package manager)

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bridgitkanini/haultrackr-fullstack.git
   cd haultrackr-fullstack
   ```

2. **Set up Python virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   cd apps/backend
   pip install -r requirements.txt
   ```

4. **Set environment variables:**

   - Create a `.env` file or set the following variables in your shell:
     - `SECRET_KEY` (if overriding default)
     - `ORS_API_KEY` (for OpenRouteService, if used)
     - Any other API keys or secrets

5. **Apply migrations:**

   ```bash
   python manage.py migrate
   ```

6. **Start the development server:**
   ```bash
   python manage.py runserver
   ```
   The API will be available at [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)

7. **Access the API and documentation:**
   - API root: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
   - Swagger: [http://127.0.0.1:8000/swagger/](http://127.0.0.1:8000/swagger/)
   - ReDoc: [http://127.0.0.1:8000/redoc/](http://127.0.0.1:8000/redoc/)

### Frontend Setup

1. **Install dependencies using pnpm:**
   ```bash
   pnpm install
   ```

2. **Start the development server:**
   ```bash
   pnpm start
   ```
   The frontend will be available at [http://localhost:4200](http://localhost:4200).

---

## API Documentation

### Authentication

- `POST /api/auth/register/` — Register a new user
- `POST /api/auth/login/` — User login
- `POST /api/auth/refresh/` — Refresh authentication token

### Trips

- `GET /api/trips/` — List all trips for the authenticated user
- `POST /api/trips/` — Create a new trip
- `GET /api/trips/{id}/` — Get trip details
- `PUT /api/trips/{id}/` — Update a trip
- `DELETE /api/trips/{id}/` — Delete a trip

### ELD Logs

- `GET /api/eld-logs/` — List all ELD logs
- `POST /api/eld-logs/` — Create a new ELD log entry
- `GET /api/eld-logs/{id}/` — Get log details
- `GET /api/eld-logs/trip/{trip_id}/` — Get logs for a specific trip

### Users

- `GET /api/users/me/` — Get current user profile
- `PUT /api/users/me/` — Update user profile

For detailed API documentation, run the development server and visit:
- API root: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
- Admin interface: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) (requires superuser)

---

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

Run `npx nx graph` to visually explore what got created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/DlmSjaiFup)

## Run tasks

To run tasks with Nx use:

```sh
npx nx <target> <project-name>
```

For example:

```sh
npx nx build myproject
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

To install a new plugin you can use the `nx add` command. Here's an example of adding the React plugin:

```sh
npx nx add @nx/react
```

Use the plugin's generator to create new projects. For example, to create a new React app or library:

```sh
# Generate an app
npx nx g @nx/react:app demo

# Generate a library
npx nx g @nx/react:lib some-lib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
