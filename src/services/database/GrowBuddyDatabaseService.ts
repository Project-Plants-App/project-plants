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
        add column last_time_fertilised date;`,
    `alter table plants
        add column last_time_sprayed date;`,
    `alter table plants
        add column detail_link_1 varchar(255);`,
    `alter table plants
        add column detail_link_name_1 varchar(255);`,
    `alter table plants
        add column botanical_name varchar(255);`,
    `alter table plants
        add column deleted boolean default false`,
    `alter table plants
        add column planted date`,
    `alter table plants
        add column amount integer`,
    `delete
     from plants
     where deleted = true`,
    `create table activities
     (
         id   integer primary key not null,
         activity_date date                not null,
         activity_type integer             not null
     );`,
    `create table activities_plants
     (
         activity_id integer not null,
         plant_id    integer not null,
         CONSTRAINT fk_activities FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE CASCADE
     );`,

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
        this.closeDatabase();
        await FileSystem.deleteAsync(`${FileSystem.documentDirectory}/SQLite/${DATABASE_NAME}`);
        await this.openDatabase();
    }

    async openDatabase() {
        this.database = SQLite.openDatabase(DATABASE_NAME);
        await this.migrateDatabase();
    }

    async closeDatabase() {
        // close database
        (this.database! as any)._db.close();
        this.database = undefined;
    }

}

export default new GrowBuddyDatabaseService();