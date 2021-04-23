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
        await this.addRecursivelyToZip(zip, '', `SQLite`);
        await this.addRecursivelyToZip(zip, '', `plant-avatars`);

        const base64String = await zip.generateAsync({
            type: "base64",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        });

        const target = `${FileSystem.documentDirectory}/backup.zip`;
        await FileSystem.deleteAsync(target, {idempotent: true});

        await FileSystem.writeAsStringAsync(target, base64String, {encoding: 'base64'});

        return target;
    }

    private async addRecursivelyToZip(zip: JSZip, file: string, parent?: string) {
        const fileUri = this.createUri(file, parent);
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (!fileInfo.exists) {
            console.debug(`skipping non existing URI ${fileUri}`);
            return;
        }

        if (fileInfo.isDirectory) {
            const newParent = ObjectUtils.isDefined(parent) ? `${parent}/${file}` : file;

            for (const child of (await FileSystem.readDirectoryAsync(fileUri))) {
                await this.addRecursivelyToZip(zip, child, newParent);
            }
        } else {
            const fileInfoWithSize = await FileSystem.getInfoAsync(fileUri, {size: true});
            if (!ObjectUtils.isDefined(fileInfoWithSize.size) || fileInfoWithSize.size! <= 0) {
                console.debug(`skipping existing URI ${fileUri} with zero size`);
                return;
            }

            const fileSizeInMb = ObjectUtils.isDefined(fileInfoWithSize.size) ? `${fileInfoWithSize.size! / 1000000}` : 'unkown';

            console.log(`adding file ${fileUri} (${fileSizeInMb} MB)`);
            const content = FileSystem.readAsStringAsync(fileUri, {encoding: 'base64'});
            this.relativizeZipInstance(zip, parent).file(file, content, {base64: true, createFolders: true});
        }
    }

    private relativizeZipInstance(zip: JSZip, parent?: string) {
        return ObjectUtils.isDefined(parent) ? zip.folder(parent!)! : zip;
    }

    private createUri(file: string, parent?: string) {
        if (ObjectUtils.isDefined(parent)) {
            return `${FileSystem.documentDirectory}/${parent}/${file}`
        }

        return `${FileSystem.documentDirectory}/${file}`
    }

}

export default new ImportExportService();