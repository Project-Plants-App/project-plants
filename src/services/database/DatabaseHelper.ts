import {Database, SQLResultSet} from "expo-sqlite";

const TABLE_EXISTS_STATEMENT = `SELECT *
                                FROM sqlite_master
                                WHERE type = 'table'
                                  AND name = ?;`

class DatabaseHelper {

    async tableExists(table: string, database: Database): Promise<boolean> {
        const resultSet = await this.executeSingleStatement(database, TABLE_EXISTS_STATEMENT, [table])

        return resultSet.rows.length === 1;
    }

    executeSingleStatement(database: Database, statement: string, args?: any[]): Promise<SQLResultSet> {
        return new Promise<SQLResultSet>((resolve, reject) => {
            database.transaction((tx) => {
                console.debug(`execute statement '${statement}'`)

                tx.executeSql(statement, args, (tx, result) => {
                    console.debug(`successfully executed statement '${statement}'`)

                    resolve(result);
                }, (tx, error) => {
                    console.debug(`failed to execute statement '${statement}' because '${error.message}'`)
                    reject(error.message);

                    // return true to stop on error
                    return false;
                });
            });
        });
    }

}

export default new DatabaseHelper();