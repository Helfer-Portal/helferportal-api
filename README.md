# helferportal-api
Backend des Portales in Sails.js

// RUN DATABASE
docker run --name some-postgis  -e POSTGRES_PASSWORD=root -p 5432:5432 -d mdillon/postgis

database > database erstellen mit pgadmin oder psql
docker run -it --link some-postgis:postgres --rm postgres \
    sh -c 'exec psql -h "$POSTGRES_PORT_5432_TCP_ADDR" -p "$POSTGRES_PORT_5432_TCP_PORT" -U postgres'
