# helferportal-api
Backend des Portales in Sails.js

// RUN DATABASE
docker run --name some-postgis  -e POSTGRES_PASSWORD=root -p 5432:5432 -d mdillon/postgis

database > database erstellen mit pgadmin oder psql
docker run -it --link some-postgis:postgres --rm postgres \
    sh -c 'exec psql -h "$POSTGRES_PORT_5432_TCP_ADDR" -p "$POSTGRES_PORT_5432_TCP_PORT" -U postgres'


CREATE EXTENSION postgis;

address.geom in der datenbank löschen und diesen query feuern.
SELECT AddGeometryColumn ('public','address','geom',4326,'POINT',2);



//Anleitung query geom:
INSERT INTO address (geom)
VALUES (ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Point"
,"coordinates":[10.195312,52.696361]}'), 4326));


DELETE FROM address
WHERE id=105;

UPDATE address
SET geom = ST_SetSRID(ST_GeomFromGeoJSON(‘{“type”:“Point”,“coordinates”:[10.195312,52.696361]}‘), 4326)
WHERE id=5;
