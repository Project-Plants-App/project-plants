import {Plant} from "../model/Plant";
import ImageRepository from "../repositories/ImageRepository";
import PlantRepository from "../repositories/PlantRepository";
import ObjectUtils from "../common/ObjectUtils";

class PlantService {

    async savePlant(plant: Plant) {
        await PlantRepository.insertOrUpdatePlant(plant);

        if (ObjectUtils.isDefined(plant.avatar)) {
            plant.avatar = await ImageRepository.storeImage(plant.id!, plant.avatar!);
            await PlantRepository.insertOrUpdatePlant(plant);
        }
    }

    async getPlant(id: number): Promise<Plant> {
        return PlantRepository.selectPlant(id);
    }

    async getAllPlants(): Promise<Plant[]> {
        return PlantRepository.selectAllPlants();
    }

    async deletePlant(plant: Plant): Promise<void> {
        return PlantRepository.deletePlant(plant);
    }

}

export default new PlantService();