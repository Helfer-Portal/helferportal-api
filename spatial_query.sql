--Eingangsparameter: Punkt der Suche, maximaler Abstand, quality_ids als suchfilter
--Ausgabe: Alle User , die sich innerhalb des maximalen Abstands vom Suchpunkt befinden und gewünschte Eigenschaften mitbringen. Der Standort wird als GeoJSON codiert ausgegeben ==> {"type":"Point","crs":{"type":"name","properties":{"name":"EPSG:4326"}},"coordinates":[9.910927,53.32021]}

WITH close_users as (
	SELECT users.*
	FROM users, poc
	WHERE ST_DWithin(users.geom::geography, poc.geom::geography, 5000)
	)
SELECT ST_AsGeoJson(close_users.geom,6,2), close_users.first_name, close_users.last_name, close_users.email, close_users.id
FROM   close_users
WHERE  close_users.id IN (SELECT user_id FROM user_quality WHERE quality_id = 5)
AND    close_users.id IN (SELECT user_id FROM user_quality WHERE quality_id = 2);