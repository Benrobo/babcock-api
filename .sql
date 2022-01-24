-- Database

CREATE DATABASE "babcock-uber";


-- organization table


CREATE TABLE "usersTable"(
    id TEXT UNIQUE NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "mail" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "usersIdentifier" TEXT NOT NULL,
    "profilePics" TEXT NOT NULL,
    "userRole" TEXT,
    "status" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL
);

-- trips table

CREATE TABLE "trips"(
    id TEXT UNIQUE NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);