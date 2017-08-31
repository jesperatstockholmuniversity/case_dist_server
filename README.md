# case_dist_server
SITE4SEFO Case Distribution Server

1. Run "npm install" from the project root folder.
2. Copy and configure: 'default.json.template' as 'default.json'.
3. Copy and configure: 'production.json.template' as 'production.json'.
4. Run "node src/index.js" to start server.


## Setup a database
$ sudo su postgres
$ createdb case_dist_server
$ psql case_dist_server
$ CREATE USER case_dist_server_user WITH PASSWORD 'test';
$ GRANT ALL PRIVILEGES ON DATABASE "case_dist_server" to case_dist_server_user;
$ \q
$ exit

### Try the database access
$ psql -d case_dist_server -U case_dist_server_usesr -W
$ \q

