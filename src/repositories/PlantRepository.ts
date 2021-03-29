import {Plant} from "../model/Plant";
import DatabaseHelper from "../services/database/DatabaseHelper";
import GrowBuddyDatabaseService from "../services/database/GrowBuddyDatabaseService";

const PLANT_INSERT_STATEMENT = `insert into plants (id, name, preferred_location, preferred_ph_Level, water_demand)
                                values ((select coalesce(max(id), 0) + 1 from plants), ?, ?, ?, ?)`


const PLANT_SELECT_STATEMENT = `select id, name, preferred_location, preferred_ph_Level, water_demand
                                from plants
                                where id = ?`

const PLANT_SELECT_ALL_STATEMENT = `select id, name, preferred_location, preferred_ph_Level, water_demand
                                    from plants`

const PLANT_UPDATE_STATEMENT = `update plants
                                set name               = ?,
                                    preferred_location = ?,
                                    preferred_ph_Level = ?,
                                    water_demand       = ?
                                where id = ?`

const PLANT_DELETE_STATEMENT = `delete
                                from plants
                                where id = ?`

class PlantRepository {

    async insertOrUpdatePlant(plant: Plant) {
        const database = await GrowBuddyDatabaseService.getDatabase();

        const args = [
            plant.name,
            plant.preferredLocation,
            plant.preferredPhLevel,
            plant.waterDemand
        ];

        if (plant.id === undefined) {
            return DatabaseHelper.executeSingleStatement(database, PLANT_INSERT_STATEMENT, args).then((resultSet) => {
                console.debug(`received id ${resultSet.insertId} after inserting plant`)
                plant.id = resultSet.insertId;

                return resultSet;
            });
        } else {
            args.push(plant.id);
            return DatabaseHelper.executeSingleStatement(database, PLANT_UPDATE_STATEMENT, args);
        }
    }

    async selectPlant(id: number): Promise<Plant> {
        const database = await GrowBuddyDatabaseService.getDatabase();

        return DatabaseHelper.executeSingleStatement(database, PLANT_SELECT_STATEMENT, [id]).then((resultSet) => {
            return this.convertRowToPlant(resultSet.rows.item(0));
        });
    }

    async selectAllPlants(): Promise<Plant[]> {
        const database = await GrowBuddyDatabaseService.getDatabase();

        return DatabaseHelper.executeSingleStatement(database, PLANT_SELECT_ALL_STATEMENT).then((resultSet) => {
            const result: Plant[] = [];
            for (let i = 0; i < resultSet.rows.length; i++) {
                result.push(this.convertRowToPlant(resultSet.rows.item(i)));
            }

            return result;
        });
    }

    private convertRowToPlant(row:any) {
        return {
            id:row.id,
            name: row.name,
            preferredLocation: row.preferred_location,
            preferredPhLevel: row.preferred_ph_Level,
            waterDemand: row.water_demand
        } as Plant
    }

    async deletePlant(id: number): Promise<void> {
        const database = await GrowBuddyDatabaseService.getDatabase();

        await DatabaseHelper.executeSingleStatement(database, PLANT_DELETE_STATEMENT, [id]);
    }

}

export default new PlantRepository();