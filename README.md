# Express.js + TypeScript Auth App Template

## Initial Setup

**First**, you must create and setup the `.env` file, the example format can be seen in `.env.example` file.

```env
PORT=8080

DATABASE_URL="postgresql://[user]:[password]@[dbhost]:[db_port]/warehouse?schema=public"

PASSWORD_SALT="input_your_salt_here"
PASSWORD_DIGEST="sha512"
PASSWORD_KEY_LENGTH=64
PASSWORD_ITERATION=1000

OTP_LENGTH=8
```
You must set `user`, `password`, `dbhost`, and `port` for database connection.

For the database, you can use your existing database (if you already have) or make it using the `docker-compose.yml` file with `docker-compose build up -d` command.

Also yu can costumize `PASSWORD_SALT`, `PASSWORD_DIGEST`, `PASSWORD_KEY_LENGTH`, and `PASSWORD_ITERATION` if necessary.

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