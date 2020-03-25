# helferportal-api
Backend des Portales in Sails.js

// RUN DATABASE



//*************************
// DATABASE
//*************************

//********** STEP: 1, add Docker

docker run --name some-postgis  -e POSTGRES_PASSWORD=root -p 5432:5432 -d mdillon/postgis

//********** STEP: 2, 

Download https://www.pgadmin.org/ und richte Datenbank ein
erstelle neue Datenbank namens 'helponspot'

//********** STEP: 3, führe auf der neuen Datenbank den query

CREATE EXTENSION postgis;

//********** STEP: 4, switch gemotry type

address.geom in der datenbank löschen und diesen query feuern.
SELECT AddGeometryColumn ('public','address','geom',4326,'POINT',2);

//*************************
// BEISPIEL QUERYS
//*************************

//Anleitung query geom:
INSERT INTO address (geom)
VALUES (ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Point"
,"coordinates":[10.195312,52.696361]}'), 4326));


DELETE FROM address
WHERE id=105;

UPDATE address
SET geom = ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Point","coordinates":[10.195312,52.696361]}'), 4326)
WHERE id=5;
