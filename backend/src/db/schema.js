"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.usersTable = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    username: (0, pg_core_1.varchar)("username", { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)("password", { length: 900 }),
    isVerified: (0, pg_core_1.boolean)("is_verified").notNull().default(false),
    verificationCode: (0, pg_core_1.varchar)("verification_code", { length: 500 }),
    created_at: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow()
});
