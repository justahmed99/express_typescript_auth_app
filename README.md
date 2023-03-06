# Express.js + TypeScript Auth App Template

## Tech I Used in Development
- NodeJS (v16.13.0)
- npm (v9.4.0)
- PostgreSQL
- Docker
- TypeScript (v4.9.5)
- Prisma (v4.11.0)
- Express (v4.18.2)

## Initial Setup

**First**, you must create and setup the `.env` file, the example format can be seen in `.env.example` file.

```toml
PORT=8080

DATABASE_URL="postgresql://[user]:[password]@[dbhost]:[db_port]/warehouse?schema=public"

PASSWORD_SALT="input_your_salt_here"
PASSWORD_DIGEST="sha512"
PASSWORD_KEY_LENGTH=64
PASSWORD_ITERATION=1000

OTP_LENGTH=8
```
You must set `user`, `password`, `dbhost`, and `port` for database connection.

Also you can costumize `PASSWORD_SALT`, `PASSWORD_DIGEST`, `PASSWORD_KEY_LENGTH`, and `PASSWORD_ITERATION` if necessary.

For the database, you can use your existing database (if you already have) or make it using the `docker-compose.yml` file with `docker-compose build up -d` command.
```yml
version: '3'
services:
  postgres:
    container_name: 'warehouse-postgres'
    image: postgres
    restart: always
    environment:
      - POSTGRES_USER=warehouse
      - POSTGRES_PASSWORD=[your_password]
    volumes:
      - postgres:/var/lib/postgresql/data
    ports:
      - '2345:5432'
volumes:
  postgres:

```
You must change `your_password` (without `[]`) with the password you want. Make sure the PostgreSQL setup in `docker-compose.yml` and `.env` is same.

**Second**, migrate the database. We use **prisma** in this project. For initial migration, you can use this command :
```
npx prisma init
```

Next time, if you do a changes with the database schema, you can do migration by using this command :
```
npx prisma migrate dev --name [title_of_migration]
```
For example :
```
npx prisma migrate dev --name add_new_index_in_table_x
```


## How to Run This Program
- Install modules with `npm install` command.
- To run in dev mode you can use this command :
```commandLine
npm run dev
```
- To build the project, use this command :
```commanLine
npm run build
```
- To run the built version, use this command :
```commandLine
npm run serve
```