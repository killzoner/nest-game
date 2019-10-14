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
    "price"         FLOAT,
    "publisher"     SERIAL, 
    "tags"          TEXT [],
    "releaseDate"   TIMESTAMP,
    CONSTRAINT "PUBLISHER_FK" FOREIGN KEY ("publisher") REFERENCES "PUBLISHER" ("id")
);

INSERT INTO "PUBLISHER" (id, name, siret, phone) VALUES(1, 'Publisher1', 123456789, '0666666666');
INSERT INTO "PUBLISHER" (id, name, siret, phone) VALUES(2, 'Publisher2', 987654321, '0666666666');

INSERT INTO "GAME" (id, title, price, publisher, tags, "releaseDate") VALUES(1, 'Game1', 1000, 1, '{awesome,cooperation}', '2019-10-14');
INSERT INTO "GAME" (id, title, price, publisher, tags, "releaseDate") VALUES(2, 'Indie1', 10, 2, '{cheap,indie}', '2019-10-01');

INSERT INTO "GAME" (id, title, price, publisher, tags, "releaseDate") VALUES(3, 'OldGame', 15, 1, '{old,toDelete}', '2002-01-18');
INSERT INTO "GAME" (id, title, price, publisher, tags, "releaseDate") VALUES(4, 'GoodOldGame', 8.5, 2, '{classic,fun}', '2018-10-14');
