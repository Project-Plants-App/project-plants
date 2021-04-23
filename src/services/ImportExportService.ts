import Clipboard from "expo-clipboard";
import {Plant} from "../model/Plant";
import ObjectUtils from "../common/ObjectUtils";
import PlantService from "./PlantService";
import JSZip from "jszip";
import * as FileSystem from 'expo-file-system';

class ImportExportService {

    async exportAllPlantsIntoClipboard() {
        const plants = await PlantService.getAllPlants();
        const plantsAsString = JSON.stringify(plants);

        Clipboard.setString(plantsAsString);
    }

    async importAllPlantsFromClipboard() {
        const plantsAsString = await Clipboard.getStringAsync();
        if (ObjectUtils.isDefined(plantsAsString)) {
            const plants = JSON.parse(plantsAsString) as Plant[];

            for (const plant of plants) {
                plant.id = undefined;
                await PlantService.savePlant(plant);
            }
        }
    }

    async createBackupZip() {
        const zip = new JSZip();
        await this.addFolderToZip(zip, `SQLite`);
        await this.addFolderToZip(zip, `plant-avatars`);

        const base64String = await zip.generateAsync({type: "base64"});

        const target = `${FileSystem.documentDirectory}/backup.zip`;
        await FileSystem.deleteAsync(target, {idempotent: true});

        await FileSystem.writeAsStringAsync(target, base64String, {encoding: 'base64'});

        return target;
    }

    private async addFolderToZip(zip: JSZip, folder: string) {
        for (const file of (await FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}/${folder}`))) {
            const content = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}/${folder}/${file}`, {encoding: 'base64'});
            zip.folder(folder)!.file(file, content, {base64: true, createFolders: true});
        }
    }

}

export default new ImportExportService();