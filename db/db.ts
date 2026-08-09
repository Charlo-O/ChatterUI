import { drizzle as drizzleAsync } from 'drizzle-orm/sqlite-proxy'
import { drizzle as drizzleSync } from 'drizzle-orm/expo-sqlite'
import {
    bundledExtensions,
    openDatabaseAsync,
    openDatabaseSync,
    type SQLiteDatabase,
} from 'expo-sqlite'
import { Platform } from 'react-native'

import * as schema from './schema'

//deleteDatabaseAsync('db.db')
export let sqliteDB: SQLiteDatabase

const createNativeDatabase = (database: SQLiteDatabase) => drizzleSync(database, { schema })
type Database = ReturnType<typeof createNativeDatabase>

export let db: Database

const initializeDatabase = (database: SQLiteDatabase) => {
    sqliteDB = database
    const extension = bundledExtensions?.['sqlite-vec']
    if (extension) void sqliteDB.loadExtensionAsync(extension.libPath, extension.entryPoint)

    if (Platform.OS === 'web') {
        db = drizzleAsync(
            async (sql, params, method) => {
                const statement = await sqliteDB.prepareAsync(sql)
                try {
                    if (method === 'run') {
                        const result = await statement.executeAsync(params)
                        return {
                            rows: [
                                {
                                    changes: result.changes,
                                    lastInsertRowId: result.lastInsertRowId,
                                },
                            ],
                        }
                    }

                    const result = await statement.executeForRawResultAsync(params)
                    if (method === 'get') {
                        return { rows: (await result.getFirstAsync()) as any }
                    }
                    return { rows: await result.getAllAsync() }
                } finally {
                    await statement.finalizeAsync()
                }
            },
            { schema }
        ) as unknown as Database
    } else {
        db = createNativeDatabase(sqliteDB)
    }

    void sqliteDB.execAsync('PRAGMA foreign_keys = ON;')
    return db
}

export const dbReady =
    Platform.OS === 'web'
        ? openDatabaseAsync('db.db', { enableChangeListener: true }).then(initializeDatabase)
        : Promise.resolve(
              initializeDatabase(openDatabaseSync('db.db', { enableChangeListener: true }))
          )
