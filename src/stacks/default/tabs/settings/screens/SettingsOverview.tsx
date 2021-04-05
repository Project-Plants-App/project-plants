import React from "react";
import {Divider, Layout, List, ListItem, TopNavigation} from "@ui-kitten/components";
import {ListRenderItemInfo} from "react-native";
import ImportExportService from "../../../../../services/ImportExportService";
import GrowBuddyDatabaseService from "../../../../../services/database/GrowBuddyDatabaseService";

export default () => {

    const settings = [
        {
            title: 'Exportieren',
            description: 'Alle Pflanzen in Zwischenablage exportieren',
            onPress: async () => {
                await ImportExportService.exportAllPlantsIntoClipboard();
            }
        }, {
            title: 'Importieren',
            description: 'Alle Pflanzen aus Zwischenablage importieren',
            onPress: async () => {
                await ImportExportService.importAllPlantsFromClipboard();
            }
        }, {
            title: 'Datenbank zurücksetzen',
            description: 'Datenbank zurücksetzen',
            onPress: async () => {
                await GrowBuddyDatabaseService.resetDatabase();
            }
        }
    ]

    const renderItem = ({item}: ListRenderItemInfo<any>) => {
        return (
            <ListItem title={item.title} description={item.description} onPress={item.onPress}/>
        )
    }

    return (
        <React.Fragment>
            <TopNavigation title="Settings" alignment="center"/>
            <Divider/>
            <Layout style={{flex: 1}}>
                <List
                    data={settings}
                    renderItem={renderItem}
                    ItemSeparatorComponent={Divider}
                />
            </Layout>
            <Divider/>
        </React.Fragment>
    )

};