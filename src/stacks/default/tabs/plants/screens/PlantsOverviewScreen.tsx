import {useNavigation, useRoute} from "@react-navigation/native";
import {Divider, Layout, List, ListItem, Text, TopNavigation} from "@ui-kitten/components";
import React, {useState} from "react";
import {ListRenderItemInfo, StyleSheet, View} from "react-native";
import {PlantsStackNavigationProp, PlantsStackRoute, PlantsStackRouteProp} from "../PlantsStackRoute";
import {Plant} from "../../../../../model/Plant";
import {useOnFocusOnceEffect} from "../../../../../common/hooks/Hooks";
import i18n from "../../../../../i18n";
import PlantAvatar from "../../../../../common/components/PlantAvatar";
import TopNavigationTitle from "../../../../../common/components/TopNavigationTitle";
import Badge from "../../../../../common/components/Badge";
import {formatIsoDateStringAsTimeAgo} from "../../../../../common/Utils";
import PlantService from "../../../../../services/PlantService";
import DrawerAction from "../../../../../common/components/DrawerAction";
import renderCreateAction from "../../../../../common/components/CreateAction";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsStackRoute.PLANTS_OVERVIEW>>();
    const route = useRoute<PlantsStackRouteProp<PlantsStackRoute.PLANTS_OVERVIEW>>();

    const [plants, setPlants] = useState<Plant[]>();

    function reload() {
        PlantService.getAllPlants().then((plants) => {
            setPlants(plants);
        });
    }

    function openPlantDetail(plant: Plant) {
        navigation.navigate({name: PlantsStackRoute.PLANTS_DETAIL, params: {plant}});
    }

    function openPrefillScreen() {
        navigation.navigate({name: PlantsStackRoute.PLANTS_PREFILL, params: {}});
    }

    function renderPlantAvatar(plant: Plant) {
        return () => {
            return (<PlantAvatar size="large" avatar={plant.avatar}/>)
        }
    }

    function renderItem({item}: ListRenderItemInfo<Plant>) {
        const renderDescription = (props: any) => {
            return (
                <View {...props}
                      style={[props.style, {flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginTop: 5}]}>
                    {!item.automaticallyWatered && item.lastTimeWatered &&
                        <Badge icon="droplet-outline"
                               title={formatIsoDateStringAsTimeAgo(item.lastTimeWatered)!}
                               style={{marginRight: 5, marginTop: 5}}/>
                    }
                    {item.automaticallyWatered &&
                        <Badge icon="droplet-automatic-outline"
                               iconPack="assets"
                               title={i18n.t('AUTOMATICALLY_WATERED_SHORT')}
                               style={{marginRight: 5, marginTop: 5}}/>
                    }
                    {item.lastTimeFertilised &&
                        <Badge icon="flash-outline"
                               title={formatIsoDateStringAsTimeAgo(item.lastTimeFertilised)!}
                               style={{marginRight: 5, marginTop: 5}}/>
                    }
                    {item.lastTimeSprayed &&
                        <Badge icon="shield-outline"
                               title={formatIsoDateStringAsTimeAgo(item.lastTimeSprayed)!} style={{marginTop: 5}}/>
                    }
                </View>
            )
        }

        const renderTitle = (props: any) => (
            <Text {...props} numberOfLines={1}>{item.name}</Text>
        )

        return (
            <ListItem title={renderTitle}
                      description={renderDescription}
                      accessoryLeft={renderPlantAvatar(item)}
                      onPress={() => openPlantDetail(item)}/>
        )
    }

    useOnFocusOnceEffect(() => {
        reload()
    });

    return (
        <React.Fragment>
            <TopNavigation title={TopNavigationTitle(i18n.t('ALL_PLANTS'))}
                           alignment="center"
                           accessoryLeft={DrawerAction}
                           accessoryRight={renderCreateAction(openPrefillScreen)}/>
            <Divider/>
            <Layout style={styles.layout}>
                <List data={plants} renderItem={renderItem} style={styles.list} ItemSeparatorComponent={Divider}/>
            </Layout>
            <Divider/>
        </React.Fragment>
    )
}


const styles = StyleSheet.create({
    layout: {
        flex: 1
    },
    list: {
        flex: 1,
    }
});