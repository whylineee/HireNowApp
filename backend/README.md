# Django backend (admin panel)

This folder contains the server part for HireNowApp built with Django.

## Quick start

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. (Optional) copy env template:

```bash
cp .env.example .env
```

4. Run migrations:

```bash
python manage.py migrate
```

5. Create admin user:

```bash
python manage.py createsuperuser
```

6. Start server:

```bash
python manage.py runserver 0.0.0.0:8000
```

Admin panel URL: `http://127.0.0.1:8000/admin/`  
Healthcheck URL: `http://127.0.0.1:8000/health/`  
Jobs API URL: `http://127.0.0.1:8000/api/jobs/`

For Expo on a real device, point the app to your machine IP with `EXPO_PUBLIC_API_URL=http://<your-machine-ip>:8000`.
In `DEBUG`, the backend also allows LAN hosts so the same dev server can serve simulator and device traffic.

## Frontend sync

The mobile/web app now reads and creates vacancies through Django:

- `GET /api/jobs/` for search and listing
- `GET /api/jobs/<id>/` for job details
- `POST /api/jobs/` for employer-created vacancies

The initial database migration also seeds the same starter vacancies that were previously hardcoded in the frontend, so the admin panel and app share one source of truth.

## What is included

- Django project config (`backend/` package).
- `jobs` app with `Job` model aligned with mobile app job fields.
- Admin UI configuration for searching/filtering/sorting jobs.
- JSON API used by the Expo frontend.
