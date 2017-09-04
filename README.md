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
$ psql -d case_dist_server -U case_dist_server_user -W
$ \q
## If this does not work due to "FATAL: Peer authentication....", try:
$ psql -U someuser -h 127.0.0.1 database 

## Seed the database
$ sudo su postgres
$ psql case_dist_server < database_seeds/postgres/seed.sql


# Playing with curl

## Example of notifying the Case Distribution Server about a new VM (10.11.11.171).
$ curl -H 'Content-Type: application/json' -X POST -d '[{"case_name":"Hacker"}, {"case_name":"DDOS"}]' http://localhost:9911/dist/10.11.11.171

## Example of retrieving the distribution of a specific VM (10.11.11.171).
$ curl http://localhost:9911/dist/10.11.11.171

## Example of deleting a stored case distribution.
$ curl -X "DELETE" http://localhost:9911/dist/10.11.11.171
