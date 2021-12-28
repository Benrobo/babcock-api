CREATE DATABASE babcock-uber;


-- organization table


CREATE TABLE "usersTable"(
    id TEXT UNIQUE NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "mail" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "usersIdentifier" TEXT NOT NULL,
    "profilePics" TEXT NOT NULL,
    "userRole" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL
);


-- product table

CREATE TABLE "notification"(
    id TEXT UNIQUE NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL
);

-- Payment table

CREATE TABLE payments(
    id TEXT UNIQUE NOT NULL PRIMARY KEY,
    "cName" TEXT NOT NULL,
    "total" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "pHash" TEXT [] NOT NULL,
    "orgHash" TEXT [] NOT NULL,
    status TEXT,
    "expiry" TEXT NOT NULL,
    "pDate" TIMESTAMP NOT NULL DEFAULT NOW()
);












