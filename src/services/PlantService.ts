import {Plant} from "../model/Plant";
import ImageRepository from "../repositories/ImageRepository";
import PlantRepository from "../repositories/PlantRepository";
import {isDefined} from "../common/Utils";

class PlantService {

    async savePlant(plant: Plant) {
        await PlantRepository.insertOrUpdatePlant(plant);

        if (isDefined(plant.avatar)) {
            try {
                plant.avatar = await ImageRepository.storeImage(plant.id!, plant.avatar!);
                await PlantRepository.insertOrUpdatePlant(plant);
            } catch (e) {
                console.warn(`failed to store avatar: ${e}`)
            }
        }
    }

    async getPlant(id: number): Promise<Plant> {
        return PlantRepository.selectPlant(id);
    }

    async getAllPlants(): Promise<Plant[]> {
        return PlantRepository.selectAllPlants();
    }

    async deletePlant(plant: Plant): Promise<void> {
        await PlantRepository.deletePlant(plant);
        await ImageRepository.deleteImageIfExists(plant.id!);
    }

}

export default new PlantService();