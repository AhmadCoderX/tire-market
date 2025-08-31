# Tyre Marketplace Backend

This is the backend service for the Tyre Marketplace application built with Django and PostgreSQL.

## Prerequisites

### Windows
- Python 3.11 or higher
- PostgreSQL 15 or higher ([Download](https://www.postgresql.org/download/windows/))
- Git ([Download](https://git-scm.com/download/win))
- Visual Studio Build Tools (for psycopg2) - Optional if using psycopg2-binary
- Updated

### Linux (Ubuntu/Debian)
```bash
# Install Python
sudo apt update
sudo apt install python3 python3-pip python3-venv

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Git
sudo apt install git
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Tyre-Backend
```

### 2. Create and Activate Virtual Environment

#### Windows
```bash
python -m venv venv
venv\Scripts\activate
```

#### Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DB_NAME=tire_marketplace
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432

EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### 5. Database Setup

#### Creating a Fresh Database

##### Windows (using pgAdmin 4)
1. Open pgAdmin 4
2. Right-click on "Databases"
3. Select "Create" > "Database..."
4. Set name as `tire_marketplace`
5. Click "Save"

##### Linux
```bash
sudo -u postgres psql -c "CREATE DATABASE tire_marketplace;"
```

#### Database Backup and Restore

##### Creating Database Dump
```bash
# Windows (PowerShell)
& "D:\softwares\Postgres\pgAdmin 4\runtime\pg_dump.exe" --file "tyre_db_backup.dump" --host "localhost" --port "5432" --username "postgres" --format=c --large-objects --encoding "UTF8" --verbose "tire_marketplace"

# Linux
pg_dump --file "tyre_db_backup.dump" --host "localhost" --port "5432" --username "postgres" --format=c --large-objects --encoding "UTF8" --verbose "tire_marketplace"
```

##### Restoring Database from Dump
```bash
# Windows (PowerShell)
& "D:\softwares\Postgres\pgAdmin 4\runtime\pg_restore.exe" --host "localhost" --port "5432" --username "postgres" --dbname "tire_marketplace" --verbose "tyre_db_backup.dump"

# Linux
pg_restore --host "localhost" --port "5432" --username "postgres" --dbname "tire_marketplace" --verbose "tyre_db_backup.dump"
```

Note: You will be prompted for the PostgreSQL password during backup and restore operations.

### 6. Django Setup

Apply migrations:
```bash
# Windows
python manage.py migrate

# Linux
python3 manage.py migrate
```

Create superuser:
```bash
# Windows
python manage.py createsuperuser

# Linux
python3 manage.py createsuperuser
```

## Running the Server

### Development Server
```bash
# Windows
cd tyre_marketplace_django
python manage.py runserver

# Linux
cd tyre_marketplace_django
python3 manage.py runserver
```

The server will start at `http://localhost:8000`

## API Documentation

- Admin interface: `http://localhost:8000/admin/`
- API endpoints: `http://localhost:8000/api/`

## Important Notes

### Security
1. Never commit `.env` file to version control
2. Use strong passwords for database and email
3. In production:
   - Set `DEBUG=False`
   - Configure `ALLOWED_HOSTS`
   - Update `CORS_ALLOWED_ORIGINS`
   - Use HTTPS
   - Set up proper firewall rules

### Common Issues and Solutions

1. PostgreSQL Connection Issues:
   - Check if PostgreSQL service is running
   - Verify database credentials in `.env`
   - Ensure PostgreSQL is accepting connections (pg_hba.conf)

2. Python Package Issues:
   - Ensure virtual environment is activated
   - Update pip: `python -m pip install --upgrade pip`
   - If psycopg2 fails, try: `pip install psycopg2-binary`

3. Permission Issues (Linux):
   - Ensure proper file permissions: `chmod -R 755 .`
   - Database permissions: `sudo -u postgres createuser -s $USER`

## Database Maintenance

### Regular Backups
```bash
# Windows (PowerShell)
$date = Get-Date -Format "yyyy-MM-dd"
& "D:\softwares\Postgres\pgAdmin 4\runtime\pg_dump.exe" --file "backup_${date}.dump" --host "localhost" --port "5432" --username "postgres" --format=c --large-objects --encoding "UTF8" --verbose "tire_marketplace"

# Linux
pg_dump --file "backup_$(date +%Y-%m-%d).dump" --host "localhost" --port "5432" --username "postgres" --format=c --large-objects --encoding "UTF8" --verbose "tire_marketplace"
``` 