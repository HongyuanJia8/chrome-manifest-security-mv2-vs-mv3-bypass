To set up make sure you

`npm install`

then go to `localhost:3000` to check if it's working

Follow this tutorial to set up the postgres database: https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/
Stop when you reach 'Creating a table in Postgres'

To start/stop: `brew services [start/stop] postgresql`

You'll have to make a database called `api`. Hopefully you followed the instructions in that link above. 

To set up a table in the database, navigate to `localhost:3000/create-database`

to reset the contents of the table go to `localhost:3000/reset-database`

To add strings to table, go to `localhost:3000/report-a-bug/{string-to-add-to-db}`

To see the strings in the table, go to `localhost:3000/SUPERSECRETDATABASEDEALIO`