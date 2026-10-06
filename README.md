# Winter Project Pro v3

## Login
- Admin: `admin` / `admin00` — add, edit, delete projects.
- Operator: `operator` / `operator00` — add projects only.

## Systems
After login the user selects one of:
- Winter Project
- Maintenance
- Manufacturing

Each system has its own project dataset, dashboard progress, hotel statistics and department statistics.

## Project filters
Projects can be filtered independently by:
- Hotel
- Status: Completed / On Going / Not Started
- Department: Kitchen / Engineering / HR / IT / FO / FB / Recreation
- Search

The old extra Departments / Hotels / Maintenance navigation has been removed; only Dashboard, Projects, Reports and Settings remain.

## Run / Deploy
Open `index.html` locally or upload the full folder to static hosting. The supplied Almaza Bay image is used on the animated login screen.

This is a front-end prototype. Credentials and permissions are implemented client-side for demo/presentation purposes; production deployment should use a secure server-side authentication/database layer.
