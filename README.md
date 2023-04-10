# env файл

перед запуском надо добавить .env файл в ./main/main:

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

./start.sh

# Остановка

./off.sh

# Микросервисы

frontend 

main - микросервис с основной базой данных

