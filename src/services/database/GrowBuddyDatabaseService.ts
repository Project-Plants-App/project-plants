import * as SQLite from "expo-sqlite";
import {WebSQLDatabase} from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import DatabaseMigrationService from "./migration/DatabaseMigrationService";

const DATABASE_NAME = "grow-buddy.db";

const MIGRATIONS = [
    `create table plants
     (
         id                 integer primary key not null,
         name               varchar(255),
         avatar             blob,
         preferred_location integer,
         water_demand       integer,
         winter_proof       integer,
         baldur_article_id  varchar(255)
     );`,
    `alter table plants
        add column last_time_watered date;`,
    `alter table plants
        add column last_time_fertilised date;`
];

class GrowBuddyDatabaseService {

    private database?: WebSQLDatabase;

    async migrateDatabase() {
        await DatabaseMigrationService.migrateDatabase(this.database!, MIGRATIONS);
    }

    async getDatabase() {
        return this.database!;
    }

    async resetDatabase() {
        await FileSystem.deleteAsync(`${FileSystem.documentDirectory}/SQLite/${DATABASE_NAME}`);
        await this.openDatabase();
    }

    async openDatabase() {
        this.database = SQLite.openDatabase(DATABASE_NAME);
        await this.migrateDatabase();
    }

}

export default new GrowBuddyDatabaseService();