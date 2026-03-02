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
python manage.py runserver
```

Admin panel URL: `http://127.0.0.1:8000/admin/`  
Healthcheck URL: `http://127.0.0.1:8000/health/`

## What is included

- Django project config (`backend/` package).
- `jobs` app with `Job` model aligned with mobile app job fields.
- Admin UI configuration for searching/filtering/sorting jobs.
