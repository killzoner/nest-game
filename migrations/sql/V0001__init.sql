CREATE TABLE "PUBLISHER"
(
    "id"    SERIAL PRIMARY KEY,
    "name"  VARCHAR(128),
    "siret" BIGINT,
    "phone" VARCHAR(50)
);

CREATE TABLE "GAME"
(
    "id"            SERIAL PRIMARY KEY,
    "title"         VARCHAR(128),
    "price"         INTEGER,
    "publisher"     SERIAL, 
    "tags"          TEXT [],
    "releaseDate"   TIMESTAMP,
    CONSTRAINT "PUBLISHER_FK" FOREIGN KEY ("publisher") REFERENCES "PUBLISHER" ("id")
);

INSERT INTO "PUBLISHER" (id, name, siret, phone) VALUES(1, 'Publisher1', 123456789, '0666666666');
INSERT INTO "PUBLISHER" (id, name, siret, phone) VALUES(2, 'Publisher2', 987654321, '0666666666');

INSERT INTO "GAME" (id, title, price, publisher, tags, "releaseDate") VALUES(1, 'Game1', 1000, 1, '{awesome,cooperation}', '2004-10-19');
INSERT INTO "GAME" (id, title, price, publisher, tags, "releaseDate") VALUES(2, 'Indie1', 10, 2, '{cheap,indie}', '2010-10-01');
