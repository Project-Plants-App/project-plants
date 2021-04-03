import React from "react";
import {Divider, Layout, List, ListItem, TopNavigation} from "@ui-kitten/components";
import {ListRenderItemInfo} from "react-native";
import PlantRepository from "../../../../../repositories/PlantRepository";
import Clipboard from 'expo-clipboard';
import {Plant} from "../../../../../model/Plant";
import ImportExportService from "../../../../../services/ImportExportService";

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
                />
            </Layout>
            <Divider/>
        </React.Fragment>
    )

};