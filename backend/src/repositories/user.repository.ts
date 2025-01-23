import db from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { IDbUser, IUser } from "../types";





export default class UserRepository {
    table: typeof usersTable;
    constructor() {
        this.table = usersTable;
    }

    async findByEmail(email: string): Promise<IUser>  {
        return await db.select().from(this.table).where(eq(this.table.email, email)).limit(1).then(users => users[0]);
    }

    async create(data: IDbUser): Promise<IUser>  {
        return await db.insert(this.table).values(data).returning().then(users => users[0]);
    }

    async updateUser (id: string, data: Partial<IDbUser>) : Promise<IUser>  {
        return await db.update(this.table).set(data).where(eq(this.table.id, id)).returning().then(users => users[0]);
    }

    async findById(id: string):  Promise<IUser>  {
        return await db.select().from(this.table).where(eq(this.table.id, id)).limit(1).then(users => users[0]);
    }

    async findByUsername (username: string):  Promise<IUser>  {
        return await db.select().from(this.table).where(eq(this.table.username, username)).limit(1).then(users => users[0]);
    }
}