class ImageDataUriHelper {

    toImageDataUri(originalUri: string, dataAsBase64: string) {
        const indexOfLastDot = originalUri.lastIndexOf(".");
        if (indexOfLastDot === -1) {
            return undefined;
        }

        const extension = originalUri.substring(indexOfLastDot + 1);
        return `data:image/${extension};base64,${dataAsBase64}`;
    }

}

export default new ImageDataUriHelper();