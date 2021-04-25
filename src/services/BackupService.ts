import * as FileSystem from 'expo-file-system';
import ObjectUtils from "../common/ObjectUtils";
import JSZip from "jszip";
import * as Updates from 'expo-updates';
import GrowBuddyDatabaseService from "./database/GrowBuddyDatabaseService";

const BACKUP_FOLDER = 'backups';
const BACKUP_ROOT_PATH = `${FileSystem.documentDirectory}/${BACKUP_FOLDER}`

const BACKUP_FILE_EXTENSION = ".zip";

const IGNORED_FILES = ['__MACOSX', '.DS_Store'];

class BackupService {

    async getAllBackups() {
        await this.createBackupRootIfNotExisting();

        return (await FileSystem.readDirectoryAsync(BACKUP_ROOT_PATH))
            .map((backupName) => this.createBackupDescriptorForBackupName(backupName))
            .sort((a, b) => a.name < b.name ? -1 : 1);
    }

    private async createBackupRootIfNotExisting() {
        await FileSystem.makeDirectoryAsync(BACKUP_ROOT_PATH, {intermediates: true});
    }

    async deleteBackup(backup: Backup) {
        await FileSystem.deleteAsync(`${BACKUP_ROOT_PATH}/${backup.name}`, {idempotent: true});
    }

    async applyBackup(backup: Backup) {
        GrowBuddyDatabaseService.closeDatabase();

        const backupContent = await FileSystem.readAsStringAsync(`${BACKUP_ROOT_PATH}/${backup.name}`, {encoding: 'base64'});
        const zip = await JSZip.loadAsync(backupContent, {base64: true});

        (await this.getFoldersIncludedInBackup()).forEach(async (folder) => {
            await FileSystem.deleteAsync(this.createUri(folder), {idempotent: true});
        });

        const filesToRestore = zip.filter(this.shouldRestoreFile);
        console.log(`found ${filesToRestore.length} paths to restore`);

        for (const file of filesToRestore) {
            if (file.dir) {
                console.log(`restoring directory ${file.name}`);

                await FileSystem.makeDirectoryAsync(this.createUri(file.name));
            } else {
                console.log(`restoring file ${file.name}`);

                const content = await file.async('base64');
                await FileSystem.writeAsStringAsync(this.createUri(file.name), content, {encoding: 'base64'});
            }
        }

        Updates.reloadAsync();
    }

    shouldRestoreFile(relativePath: string) {
        for (const ignoredFile of IGNORED_FILES) {
            if (relativePath.indexOf(ignoredFile) >= 0) {
                return false;
            }
        }

        return true;
    }

    async addBackup(backupName: string, uri: string) {
        console.log(`adding backup ${backupName}`);
        const target = `${BACKUP_ROOT_PATH}/${backupName}`;

        await FileSystem.copyAsync({from: uri, to: target});
    }

    async createBackup() {
        const zip = new JSZip();

        const foldersIncludedInBackup = await this.getFoldersIncludedInBackup();
        for (const folder of foldersIncludedInBackup) {
            console.log(`adding folder ${folder} to backup`);

            await this.addRecursivelyToZip(zip, '', folder);
        }

        const base64String = await zip.generateAsync({
            type: "base64",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        });

        const backupCreationTime = `${new Date().getTime()}`;
        const backupName = `${backupCreationTime}${BACKUP_FILE_EXTENSION}`;
        const target = `${BACKUP_ROOT_PATH}/${backupName}`;

        await FileSystem.writeAsStringAsync(target, base64String, {encoding: 'base64'});
    }

    private async getFoldersIncludedInBackup() {
        return (await FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}`))
            .filter((folder) => folder !== BACKUP_FOLDER);
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

            const content = await FileSystem.readAsStringAsync(fileUri, {encoding: 'base64'});
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

    private createBackupDescriptorForBackupName(backupName: string) {
        const timestamp = backupName.replace(BACKUP_FILE_EXTENSION, '');
        const creationDate = ObjectUtils.formatTimeString(timestamp);

        return {name: backupName, creationDate, uri: `${BACKUP_ROOT_PATH}/${backupName}`} as Backup
    }


}

export interface Backup {
    name: string;
    creationDate: string;
    uri: string;
}

export default new BackupService();