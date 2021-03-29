import * as SQLite from "expo-sqlite";
import DatabaseMigrationService from "./migration/DatabaseMigrationService";

const DATABASE = SQLite.openDatabase("grow-buddy-1.db")

const MIGRATIONS = [
    `create table plants
     (
         id                 integer primary key not null,
         name               varchar(255),
         preferred_location integer,
         preferred_ph_Level integer,
         water_demand       integer
     );  `
];

class GrowBuddyDatabaseService {

    async migrateDatabase() {
        await DatabaseMigrationService.migrateDatabase(DATABASE, MIGRATIONS);
    }

    async getDatabase() {
        return DATABASE;
    }

}

export default new GrowBuddyDatabaseService();