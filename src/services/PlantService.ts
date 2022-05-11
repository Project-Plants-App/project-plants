import {Plant} from "../model/Plant";
import ImageRepository from "../repositories/ImageRepository";
import PlantRepository from "../repositories/PlantRepository";
import {isDefined} from "../common/Utils";

class PlantService {

    async savePlant(plant: Plant) {
        const avatar = plant.avatar;
        delete plant.avatar;

        await PlantRepository.insertOrUpdatePlant(plant);

        if (isDefined(avatar)) {
            try {
                await ImageRepository.storeImage(plant.id!, avatar!)
            } catch (e) {
                console.warn(`failed to store avatar: ${e}`)
            }
        }
    }

    async getPlant(id: number): Promise<Plant> {
        const plant = await PlantRepository.selectPlant(id);
        plant.avatar = await ImageRepository.resolveImage(plant.id!);

        return plant;
    }

    async getAllPlants(): Promise<Plant[]> {
        const plants = await PlantRepository.selectAllPlants();
        for (const plant of plants) {
            plant.avatar = await ImageRepository.resolveImage(plant.id!);
        }

        return plants;
    }

    async deletePlant(plant: Plant): Promise<void> {
        await PlantRepository.deletePlant(plant);
        await ImageRepository.deleteImageIfExists(plant.id!);
    }

}

export default new PlantService();