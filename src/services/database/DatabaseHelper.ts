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
                tx.executeSql(statement, args, (tx, result) => {
                    resolve(result);
                }, (tx, error) => {
                    reject(error.message);

                    // return true to stop on error
                    return false;
                });
            });
        });
    }

}

export default new DatabaseHelper();