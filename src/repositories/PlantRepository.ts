import {Plant} from "../model/Plant";
import DatabaseHelper from "../services/database/DatabaseHelper";
import GrowBuddyDatabaseService from "../services/database/GrowBuddyDatabaseService";

const PLANT_INSERT_STATEMENT = `insert into plants (id,
                                                    name,
                                                    avatar,
                                                    preferred_location,
                                                    water_demand,
                                                    winter_proof,
                                                    baldur_article_id,
                                                    last_time_watered,
                                                    last_time_fertilised,
                                                    last_time_sprayed)
                                values ((select coalesce(max(id), 0) + 1 from plants), ?, ?, ?, ?, ?, ?, ?, ?, ?)`

const PLANT_BASE_SELECT_STATEMENT = `select id,
                                            name,
                                            avatar,
                                            preferred_location,
                                            water_demand,
                                            winter_proof,
                                            baldur_article_id,
                                            last_time_watered,
                                            last_time_fertilised,
                                            last_time_sprayed
                                     from plants`

const PLANT_SELECT_ALL_STATEMENT = `${PLANT_BASE_SELECT_STATEMENT} order by name`

const PLANT_SELECT_STATEMENT = `${PLANT_BASE_SELECT_STATEMENT} where id = ?`

const PLANT_UPDATE_STATEMENT = `update plants
                                set name                 = ?,
                                    avatar               = ?,
                                    preferred_location   = ?,
                                    water_demand         = ?,
                                    winter_proof         = ?,
                                    baldur_article_id    = ?,
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
            plant.avatar,
            plant.preferredLocation,
            plant.waterDemand,
            plant.winterProof,
            plant.baldurArticleId,
            plant.lastTimeWatered ? plant.lastTimeWatered.toISOString() : undefined,
            plant.lastTimeFertilised ? plant.lastTimeFertilised.toISOString() : undefined,
            plant.lastTimeSprayed ? plant.lastTimeSprayed.toISOString() : undefined
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
            avatar: row.avatar,
            preferredLocation: row.preferred_location,
            waterDemand: row.water_demand,
            winterProof: row.winter_proof,
            baldurArticleId: row.baldur_article_id,
            lastTimeWatered: this.parseDate(row.last_time_watered),
            lastTimeFertilised: this.parseDate(row.last_time_fertilised),
            lastTimeSprayed: this.parseDate(row.last_time_sprayed)
        } as Plant
    }

    private parseDate(date: string) {
        try {
            if (date) {
                return new Date(Date.parse(date));
            }
        } catch (e) {
            // ignore
        }
        return undefined as any as Date;
    }

    async deletePlant(plant: Plant): Promise<void> {
        const database = await GrowBuddyDatabaseService.getDatabase();

        await DatabaseHelper.executeSingleStatement(database, PLANT_DELETE_STATEMENT, [plant.id]);
    }

}

export default new PlantRepository();