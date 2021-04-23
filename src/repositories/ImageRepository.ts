import * as FileSystem from 'expo-file-system';
import ObjectUtils from "../common/ObjectUtils";

const PLANT_AVATARS_DIRECTORY = `${FileSystem.documentDirectory}/plant-avatars`;

class ImageRepository {

    async storeImage(id: number, uri: string) {
        if (uri.startsWith(PLANT_AVATARS_DIRECTORY)) {
            return uri;
        }

        await FileSystem.makeDirectoryAsync(PLANT_AVATARS_DIRECTORY,{intermediates:true});

        const existingImage = (await FileSystem.readDirectoryAsync(PLANT_AVATARS_DIRECTORY)).find(entry => entry.startsWith(`${id}_`));
        if (ObjectUtils.isDefined(existingImage)) {
            await FileSystem.deleteAsync(`${PLANT_AVATARS_DIRECTORY}/${existingImage}`)
        }

        const filename = this.createFilename(id, uri);
        const destinationUri = `${PLANT_AVATARS_DIRECTORY}/${filename}`;

        await FileSystem.copyAsync({
            from: uri,
            to: destinationUri
        });

        return destinationUri;
    }

    private createFilename(id: number, uri: string) {
        return `${id}_${new Date().getTime()}.${this.getFileExtension(uri)}`;
    }

    private getFileExtension(uri: string) {
        const indexOfLastDot = uri.lastIndexOf(".");
        if (indexOfLastDot === -1) {
            return undefined;
        }

        return uri.substring(indexOfLastDot + 1);
    }

}

export default new ImageRepository();
