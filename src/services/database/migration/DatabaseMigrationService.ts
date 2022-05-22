import {Database} from "expo-sqlite";
import DatabaseHelper from "../DatabaseHelper";
import * as Crypto from 'expo-crypto';
import {Platform} from "react-native";

const SCHEMA_VERSION_TABLE_DDL = `create table schema_version
                                  (
                                      version integer primary key not null,
                                      hash    varchar(255)
                                  );`;

const MIGRATION_SELECT_STATEMENT = `select *
                                    from schema_version
                                    where version = ?;`;

const MIGRATION_INSERT_STATEMENT = `insert
                                    into schema_version
                                        (version, hash)
                                    values (?, ?);`;

class DatabaseMigrationService {

    async migrateDatabase(database: Database, migrationScripts: string[]): Promise<void> {
        let schemaVersionTableExists = await DatabaseHelper.tableExists("schema_version", database);
        if (!schemaVersionTableExists) {
            await this.createSchemaVersionTable(database);
        }

        for (let version = 0; version < migrationScripts.length; version++) {
            const migrationScript = migrationScripts[version];
            const migrationScriptHash = await this.createMigrationScriptHash(migrationScript);

            const migrationScriptAlreadyExecuted = await this.migrationScriptAlreadyExecuted(database, version, migrationScriptHash);
            if (!migrationScriptAlreadyExecuted) {
                await this.executeMigrationScript(database, version, migrationScript, migrationScriptHash);
            }
        }
    }

    private async createSchemaVersionTable(database: Database) {
        await DatabaseHelper.executeSingleStatement(database, SCHEMA_VERSION_TABLE_DDL);
    }

    private async migrationScriptAlreadyExecuted(database: Database, version: number, migrationScriptHash: string) {
        const result = await DatabaseHelper.executeSingleStatement(database, MIGRATION_SELECT_STATEMENT, [version])
        if (result.rows.length === 0) {
            return false;
        }

        if (result.rows.length > 1) {
            throw Error("found multiple rows for a migration");
        }

        let item = result.rows.item(0) as Migration;

        if (item.hash !== migrationScriptHash) {
            throw Error(`invalid hash ${item.hash} at version ${version} - expected ${migrationScriptHash}`);
        }

        return true;
    }

    private async createMigrationScriptHash(migrationScript: string) {
        return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, migrationScript);
    }

    private async executeMigrationScript(database: Database, version: number, migrationScript: string, migrationScriptHash: string) {
        if (migrationScript.match(/^.+drop column.+$/) && Platform.OS === 'android') {
            console.warn('dropping columns is not supported on Android - migration will be skipped');
        } else {
            await DatabaseHelper.executeSingleStatement(database, migrationScript);
        }

        await this.registerSuccessfulMigrationExecution(database, version, migrationScriptHash);
    }

    private async registerSuccessfulMigrationExecution(database: Database, version: number, migrationScriptHash: string) {
        await DatabaseHelper.executeSingleStatement(database, MIGRATION_INSERT_STATEMENT, [version, migrationScriptHash]);
    }

}

interface Migration {
    version: number,
    script: string
    hash: string
}

export default new DatabaseMigrationService();