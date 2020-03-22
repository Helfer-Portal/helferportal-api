--Eingangsparameter: id der request, Abstand der Suche (Aktuell müssen die qualities noch manuell abgefragt werden. Es existiert aber auch ein Testdatensatz request_quality, aus dem eine Liste der benötigten qualities gezogen werden kann. Das muss noch gemacht werden.
--Ausgabe: Alle User , die sich innerhalb des maximalen Abstands vom Suchpunkt befinden und gewünschte Eigenschaften mitbringen. Der Standort wird als GeoJSON codiert ausgegeben ==> {"type":"Point","crs":{"type":"name","properties":{"name":"EPSG:4326"}},"coordinates":[9.910927,53.32021]}

WITH close_users AS (
	SELECT users.*
	FROM users
	WHERE ST_DWithin(users.geom::geography, 
		(SELECT request.geom FROM request
		WHERE id=102)::geography, 10000)
	)
SELECT ST_AsGeoJson(close_users.geom,6,2), close_users.first_name, close_users.last_name, close_users.email, close_users.id
FROM   close_users
WHERE  close_users.id IN (SELECT user_id FROM user_quality WHERE quality_id = 5)
AND    close_users.id IN (SELECT user_id FROM user_quality WHERE quality_id = 2);