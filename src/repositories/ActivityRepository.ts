import {Activity} from "../model/Activity";
import DatabaseService from "../services/database/DatabaseService";
import DatabaseHelper from "../services/database/DatabaseHelper";
import {ActivityType} from "../model/ActivityType";


const ACTIVITY_INSERT_STATEMENT = `insert into activities (id,
                                                           activity_date,
                                                           activity_type)
                                   values ((select coalesce(max(id), 0) + 1 from activities), ?, ?)`

const ACTIVITY_PLANTS_INSERT_STATEMENT = `insert into activities_plants (activity_id,
                                                                         plant_id)
                                          values (?, ?)`

const ACTIVITY_SELECT_ALL_STATEMENT = `select a.id,
                                              a.activity_date,
                                              a.activity_type,
                                              group_concat(ap.plant_id, ',') as plants
                                       from activities a
                                                join activities_plants ap on a.id = ap.activity_id
                                       group by a.id, a.activity_date, a.activity_type
                                       order by a.id desc`

const ACTIVITY_SELECT_STATEMENT = `select a.id,
                                          a.activity_date,
                                          a.activity_type,
                                          group_concat(ap.plant_id, ',') as plants
                                   from activities a
                                            join activities_plants ap on a.id = ap.activity_id
                                   where a.id = ?
                                   group by a.id, a.activity_date, a.activity_type
                                   order by a.id desc`

const ACTIVITY_SELECT_LAST_STATEMENT = `select a.id,
                                               a.activity_date,
                                               a.activity_type,
                                               group_concat(ap.plant_id, ',') as plants
                                        from activities a
                                                 join activities_plants ap on a.id = ap.activity_id
                                        where a.activity_type = ?
                                          and exists(select 1
                                                     from activities_plants ap2
                                                     where ap2.activity_id = ap.activity_id
                                                       and ap2.plant_id = ?)
                                        group by a.id, a.activity_date, a.activity_type
                                        order by a.id desc`

const ACTIVITY_DELETE_STATEMENT = `delete
                                   from activities
                                   where id = ?`

class ActivityRepository {

    async insertActivity(activity: Activity) {
        const database = await DatabaseService.getDatabase();

        const activityInsertArgs = [
            activity.date,
            activity.type
        ];

        const resultSet = await DatabaseHelper.executeSingleStatement(database, ACTIVITY_INSERT_STATEMENT, activityInsertArgs);
        activity.id = resultSet.insertId

        for (const plantId of activity.plants) {
            const activityPlantInsertArgs = [
                activity.id,
                plantId
            ];

            await DatabaseHelper.executeSingleStatement(database, ACTIVITY_PLANTS_INSERT_STATEMENT, activityPlantInsertArgs);
        }
    }

    async selectActivity(id: number): Promise<Activity> {
        const database = await DatabaseService.getDatabase();

        return DatabaseHelper.executeSingleStatement(database, ACTIVITY_SELECT_STATEMENT, [id]).then((resultSet) => {
            return this.convertRowToActivity(resultSet.rows.item(0));
        });
    }

    async selectLastActivityForPlant(plantId: number, type: ActivityType): Promise<Activity> {
        const database = await DatabaseService.getDatabase();

        return DatabaseHelper.executeSingleStatement(database, ACTIVITY_SELECT_LAST_STATEMENT, [type, plantId]).then((resultSet) => {
            return this.convertRowToActivity(resultSet.rows.item(0));
        });
    }

    async selectAllActivities(): Promise<Activity[]> {
        const database = await DatabaseService.getDatabase();

        return DatabaseHelper.executeSingleStatement(database, ACTIVITY_SELECT_ALL_STATEMENT).then((resultSet) => {
            const result: Activity[] = [];
            for (let i = 0; i < resultSet.rows.length; i++) {
                result.push(this.convertRowToActivity(resultSet.rows.item(i)));
            }

            return result;
        });
    }

    private convertRowToActivity(row: any) {
        return {
            id: row.id,
            date: row.activity_date,
            type: row.activity_type,
            plants: (row.plants as string).split(',').map(value => parseInt(value))
        } as Activity
    }

    async deleteActivity(activity: Activity): Promise<void> {
        const database = await DatabaseService.getDatabase();

        await DatabaseHelper.executeSingleStatement(database, ACTIVITY_DELETE_STATEMENT, [activity.id]);
    }

}

export default new ActivityRepository();