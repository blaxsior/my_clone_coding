import {PrismaClient} from '@prisma/client';

export const db = new PrismaClient();

/**
 * prisma 클라이언트를 데이터베이스와 연결
 */
export async function dbConn() {
    await db.$connect();
}