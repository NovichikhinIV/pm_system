Информационная система контроля и оценки выполнения ИТ-проектов с использованием микросервисной архитектуры


# Микросервисы

frontend 

main - микросервис с основной базой данных

auth - регистрация и аутентификация пользователей

reports - отчеты по проектам


# env файл

перед запуском надо добавить .env файл в ./main/main, ./auth/auth, ./reports/reports

файл .env:
```
DEBUG=
SECRET_KEY=''
ALLOWED_HOSTS=*

# postgres
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

DATABASE_URL="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?sslmode=disable"
```

# Запуск

sudo docker-compose up


