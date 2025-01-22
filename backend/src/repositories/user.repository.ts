import db from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { IUser } from "../types";
import { IDbUser } from "../types";


export default class UserRepository {
    table: typeof usersTable;
    constructor() {
        this.table = usersTable;
    }

    async findByEmail(email: string) {
        return await db.select().from(this.table).where(eq(this.table.email, email)).limit(1).then(users => users[0]);
    }

    async create(data: IDbUser) {
        return await db.insert(this.table).values(data).returning().then(users => users[0]);
    }

    async updateUser (id: string, data: Partial<IDbUser>)  {
        return await db.update(this.table).set(data).where(eq(this.table.id, id)).returning().then(users => users[0]);
    }

    async findById(id: string) {
        return await db.select().from(this.table).where(eq(this.table.id, id)).limit(1).then(users => users[0]);
    }

    async findByUsername (username: string) {
        return await db.select().from(this.table).where(eq(this.table.username, username)).limit(1).then(users => users[0]);
    }
}