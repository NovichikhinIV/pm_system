# Микросервисы

frontend 

main - микросервис с основной базой данных

auth - регистрация и аутентификация пользователей

reports - отчеты по проектам


# env файл

перед запуском надо добавить .env файл в ./main/main, ./auth/auth, ./reports/reports 

и дописать SECRET_KEY


1. файл .env в ./main/main:
```
DEBUG=True
SECRET_KEY='django-insecure-'
ALLOWED_HOSTS=*

# postgres
POSTGRES_USER=ilya
POSTGRES_PASSWORD=123123
POSTGRES_DB=pm_system__tasks_db

DATABASE_URL="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db_main:5432/${POSTGRES_DB}?sslmode=disable"
```


2. файл .env в ./auth/auth:
```
DEBUG=True
SECRET_KEY='django-insecure-'
ALLOWED_HOSTS=*

# postgres
POSTGRES_USER=ilya
POSTGRES_PASSWORD=123123
POSTGRES_DB=pm_system__auth_db

DATABASE_URL="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db_auth:5433/${POSTGRES_DB}?sslmode=disable"
```


3. файл .env в ./reports/reports:
```
DEBUG=True
SECRET_KEY='django-insecure-'
ALLOWED_HOSTS=*

# postgres
POSTGRES_USER=ilya
POSTGRES_PASSWORD=123123
POSTGRES_DB=pm_system__reports_db

DATABASE_URL="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db_reports:5434/${POSTGRES_DB}?sslmode=disable"
```


# Запуск

sudo docker-compose up


