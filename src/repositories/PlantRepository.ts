import {Plant} from "../model/Plant";
import DatabaseHelper from "../services/database/DatabaseHelper";
import GrowBuddyDatabaseService from "../services/database/DatabaseService";

const PLANT_INSERT_STATEMENT = `insert into plants (id,
                                                    name,
                                                    botanical_name,
                                                    preferred_location,
                                                    water_demand,
                                                    winter_proof,
                                                    detail_link_1,
                                                    detail_link_name_1,
                                                    planted,
                                                    amount,
                                                    last_time_watered,
                                                    last_time_fertilised,
                                                    last_time_sprayed)
                                values ((select coalesce(max(id), 0) + 1 from plants), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                                        ?, ?)`

const PLANT_BASE_SELECT_STATEMENT = `select id,
                                            name,
                                            botanical_name,
                                            preferred_location,
                                            water_demand,
                                            winter_proof,
                                            detail_link_1,
                                            detail_link_name_1,
                                            planted,
                                            amount,
                                            last_time_watered,
                                            last_time_fertilised,
                                            last_time_sprayed
                                     from plants`

const PLANT_SELECT_ALL_STATEMENT = `${PLANT_BASE_SELECT_STATEMENT} order by name`

const PLANT_SELECT_STATEMENT = `${PLANT_BASE_SELECT_STATEMENT} where id = ?`

const PLANT_UPDATE_STATEMENT = `update plants
                                set name                 = ?,
                                    botanical_name       = ?,
                                    preferred_location   = ?,
                                    water_demand         = ?,
                                    winter_proof         = ?,
                                    detail_link_1        = ?,
                                    detail_link_name_1   = ?,
                                    planted              = ?,
                                    amount               = ?,
                                    last_time_watered    = ?,
                                    last_time_fertilised = ?,
                                    last_time_sprayed    = ?
                                where id = ?`

const PLANT_DELETE_STATEMENT = `delete
                                from plants
                                where id = ?`

class PlantRepository {

    async insertOrUpdatePlant(plant: Plant) {
        const database = await GrowBuddyDatabaseService.getDatabase();

        const args = [
            plant.name,
            plant.botanicalName,
            plant.preferredLocation,
            plant.waterDemand,
            plant.winterProof,
            plant.detailLink1,
            plant.detailLinkName1,
            plant.planted,
            plant.amount,
            plant.lastTimeWatered,
            plant.lastTimeFertilised,
            plant.lastTimeSprayed,
        ];

        if (plant.id === undefined) {
            return DatabaseHelper.executeSingleStatement(database, PLANT_INSERT_STATEMENT, args).then((resultSet) => {
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

    private convertRowToPlant(row: any) {
        return {
            id: row.id,
            name: row.name,
            botanicalName: row.botanical_name,
            preferredLocation: row.preferred_location,
            waterDemand: row.water_demand,
            winterProof: row.winter_proof,
            detailLink1: row.detail_link_1,
            detailLinkName1: row.detail_link_name_1,
            planted: row.planted,
            amount: row.amount,
            lastTimeWatered: row.last_time_watered,
            lastTimeFertilised: row.last_time_fertilised,
            lastTimeSprayed: row.last_time_sprayed
        } as Plant
    }

    async deletePlant(plant: Plant): Promise<void> {
        const database = await GrowBuddyDatabaseService.getDatabase();

        await DatabaseHelper.executeSingleStatement(database, PLANT_DELETE_STATEMENT, [plant.id]);
    }

}

export default new PlantRepository();