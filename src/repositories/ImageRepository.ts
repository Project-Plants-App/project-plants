import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from "expo-image-manipulator";
import {Dimensions} from 'react-native';
import {bytesToMegaBytes, isDefined, isMetaFile} from "../common/Utils";

const PLANT_AVATARS_DIRECTORY = `${FileSystem.documentDirectory}/plant-avatars`;
const DATA_URI = 'data:';

class ImageRepository {

    async storeImage(id: number, uri: string) {
        if (uri.startsWith(PLANT_AVATARS_DIRECTORY) || uri.startsWith(DATA_URI)) {
            return uri;
        }

        await FileSystem.makeDirectoryAsync(PLANT_AVATARS_DIRECTORY, {intermediates: true});

        await this.deleteImageIfExists(id);

        const filename = this.createFilename(id, uri);
        const destinationUri = `${PLANT_AVATARS_DIRECTORY}/${filename}`;

        await FileSystem.copyAsync({from: uri, to: destinationUri});

        await this.compressImage(destinationUri);

        return destinationUri;
    }

    async deleteImageIfExists(id: number) {
        await FileSystem.makeDirectoryAsync(PLANT_AVATARS_DIRECTORY, {intermediates: true});
        const existingImage = (await FileSystem.readDirectoryAsync(PLANT_AVATARS_DIRECTORY)).find(entry => entry.startsWith(`${id}_`));
        if (isDefined(existingImage)) {
            await FileSystem.deleteAsync(`${PLANT_AVATARS_DIRECTORY}/${existingImage}`)
        }
    }

    async compressAllImages() {
        for (const image of (await FileSystem.readDirectoryAsync(PLANT_AVATARS_DIRECTORY))) {
            const imageUri = `${PLANT_AVATARS_DIRECTORY}/${image}`;

            await this.compressImage(imageUri);
        }
    }

    async compressImage(imageUri: string) {
        try {
            if (isMetaFile(imageUri)) {
                return;
            }

            const fileInfo = await FileSystem.getInfoAsync(imageUri, {size: true});
            if (fileInfo.isDirectory) {
                return;
            }

            const screenDimensions = Dimensions.get("screen");
            const targetWidth = screenDimensions.width * screenDimensions.scale;

            console.debug(`compressing image ${imageUri}...`);

            const originalImageSize = bytesToMegaBytes((await FileSystem.getInfoAsync(imageUri, {size: true})).size);
            const result = await ImageManipulator.manipulateAsync(imageUri, [{resize: {width: targetWidth}}], {compress: .9});
            await FileSystem.copyAsync({from: result.uri, to: imageUri});
            const compressedImageSize = bytesToMegaBytes((await FileSystem.getInfoAsync(imageUri, {size: true})).size);

            console.debug(`image size of ${imageUri} went from ${originalImageSize} MB to ${compressedImageSize} MB after compression`);
        } catch (e) {
            console.warn(`failed to compress image ${imageUri}`, e);
        }
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
