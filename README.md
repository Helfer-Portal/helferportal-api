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

//*************************
// ANPASSUNGEN FÜR DIE UMWANDLUNG GEOMETRY/GEOJSON
//*************************

View einrichten (Vordefinierter Query mit Alias):

CREATE OR REPLACE VIEW address_view AS
SELECT "id", created, updated, street, hn, zip, city, country, ST_AsGeoJSON(geom) AS geojson
FROM address;

Dieser View ist nun die Anlaufstelle für die API und kann zum Auslesen der Daten verwendet werden z.B.:

SELECT geojson FROM address_view;

Durch die Typumwandlung mit der Funktion "ST_AsGeoJSON" funktioniert der View allerdings nicht Rückwärts für
INSERT oder UPDATE queries. Diese Problem kann mit einer Trigger Function umgangen werden, die den jeweiligen
Befehl vor der Ausführung abfängt, angepasst direkt auf den address table umlenkt.

CREATE OR REPLACE FUNCTION insert_address()
  RETURNS trigger
  LANGUAGE plpgsql
  AS
$BODY$
BEGIN
	INSERT INTO address(created, street, hn, zip, city, country, geom)
	VALUES(now(), NEW.street, NEW.hn, NEW.zip, NEW.city, NEW.country, ST_SetSRID(ST_GeomFromGeoJSON(NEW.geojson),4326));
	RETURN NEW;
END;
$BODY$;

DROP TRIGGER IF EXISTS insert_address on address_view;

CREATE TRIGGER insert_address
  INSTEAD OF INSERT
  ON address_view
  FOR EACH ROW
  EXECUTE PROCEDURE insert_address();
  
  Der address_view bleibt auf diese Weise die Anlaufstelle für die API z.B. mit:
  
INSERT INTO address_view(street, hn, zip, city, country, geom, geojson)
VALUES('Holzweg', '13', '0815', 'Großehütte', 'Germany', NULL, '{"type": "Point","coordinates":[10.294189453125,52.35710874569601]}');

Analoges Vorgehen für UPDATE:

CREATE OR REPLACE FUNCTION update_address()
  RETURNS trigger
  LANGUAGE plpgsql
  AS
$BODY$
BEGIN
	UPDATE address
	SET
		updated = now(),
		street = NEW.street,
		hn = NEW.hn,
		zip = NEW.zip,
		city = NEW.city,
		country = NEW.country,
		geom = ST_SetSRID(ST_GeomFromGeoJSON(NEW.geojson),4326),
		geojson = OLD.geojson
	WHERE "id" = NEW."id";
	RETURN NEW;
END;
$BODY$;

DROP TRIGGER IF EXISTS update_address on address_view;

CREATE TRIGGER update_address
  INSTEAD OF UPDATE
  ON address_view
  FOR EACH ROW
  EXECUTE PROCEDURE update_address();
