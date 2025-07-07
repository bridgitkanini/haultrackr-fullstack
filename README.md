# Haultrackr Fullstack

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## Overview

**HaulTrackr** is a full-stack application designed to help truck drivers plan optimal routes and manage Electronic Logging Device (ELD) logs, ensuring compliance with Hours of Service (HOS) regulations. The system integrates a React frontend for user interaction and a Django backend for route planning, log generation, and compliance logic.

### Key Features

- **Route Planning:** Calculates optimal truck routes using the OpenRouteService API, factoring in HOS rules, rest stops, and fuel stops.
- **ELD Log Generation:** Automatically generates HOS-compliant ELD logs and visual log sheets for each trip.
- **Trip Management:** Allows users to create, view, and manage multi-day trips.
- **Rest & Fuel Stop Optimization:** Plans required rest and fuel stops along the route.
- **Authentication:** Secure user registration and login with JWT-based authentication.
- **Interactive UI:** Modern React frontend with map visualization, trip forms, and log sheet display.

### System Architecture

- **Frontend:** React (with Vite, Tailwind CSS, and Leaflet for maps)
- **Backend:** Django & Django REST Framework, SQLite (default), OpenRouteService API, JWT authentication
- **API Docs:** Swagger and ReDoc available at `/swagger/` and `/redoc/` on the backend server

---

## Setup

### Backend

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd haultrackr-fullstack/apps/backend
   ```

2. **Create and activate a virtual environment:**

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**

   ```bash
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

6. **Run the development server:**

   ```bash
   python manage.py runserver
   ```

7. **Access the API and documentation:**
   - API root: [http://localhost:8000/api/](http://localhost:8000/api/)
   - Swagger: [http://localhost:8000/swagger/](http://localhost:8000/swagger/)
   - ReDoc: [http://localhost:8000/redoc/](http://localhost:8000/redoc/)

### Frontend

1. **Install dependencies:**

   ```bash
   cd ../../frontend
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at [http://localhost:4200](http://localhost:4200).

---

## API Endpoints

All endpoints are available under the `/api/` prefix on the backend server.

### Authentication

- `POST /users/register/` — Register a new user
- `POST /token/` — Obtain JWT access and refresh tokens
- `POST /token/refresh/` — Refresh an access token

### Trip Planning

- `GET /trips/` — List all trips for the authenticated user
- `POST /trips/` — Create a new trip
- `GET /trips/{id}/` — Retrieve details for a specific trip
- `POST /trips/{id}/plan/` — Generate a full route plan for a trip

### Log Management

- `GET /logs/` — List all log sheets for the authenticated user's trips
- `GET /logs/{id}/` — Get a specific log sheet
- `POST /logs/generate_logs/` — Generate log sheets for a given trip
- `GET /logs/{id}/grid/` — Get a visual grid image for a specific log sheet

### Duty Status Management

- `GET /duty-status/` — List all duty status changes for the authenticated user
- `POST /duty-status/` — Create a new duty status change
- `GET /duty-status/{id}/` — Get a specific duty status change

> For full API details, data models, and advanced configuration, see [`apps/backend/README.md`](apps/backend/README.md).

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
