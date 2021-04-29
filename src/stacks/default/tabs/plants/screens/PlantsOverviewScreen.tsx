import {useNavigation, useRoute} from "@react-navigation/native";
import {Divider, Icon, Layout, List, ListItem, Text, TopNavigation, TopNavigationAction} from "@ui-kitten/components";
import React, {useState} from "react";
import {ListRenderItemInfo, StyleSheet, View} from "react-native";
import {PlantsStackNavigationProp, PlantsStackRouteProp, PlantsStackRoute} from "../PlantsStackRoute";
import {Plant} from "../../../../../model/Plant";
import {useOnFocusOnceEffect} from "../../../../../common/hooks/Hooks";
import i18n from "../../../../../i18n";
import PlantAvatar from "../../../../../common/components/PlantAvatar";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import Badge from "../../../../../common/components/Badge";
import ObjectUtils from "../../../../../common/ObjectUtils";
import PlantService from "../../../../../services/PlantService";
import DrawerAction from "../../../../../common/components/DrawerAction";
import renderCreateAction from "../../../../../common/components/renderCreateAction";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsStackRoute.PLANTS_OVERVIEW>>();
    const route = useRoute<PlantsStackRouteProp<PlantsStackRoute.PLANTS_OVERVIEW>>();

    const [plants, setPlants] = useState<Plant[]>();

    const reload = () => {
        PlantService.getAllPlants().then((plants) => {
            setPlants(plants);
        });
    }

    useOnFocusOnceEffect(() => {
        reload()
    });

    const openPlantDetail = (plant: Plant) => {
        navigation.navigate({name: PlantsStackRoute.PLANTS_DETAIL, params: {plant}});
    }

    const openPrefillScreen = () => {
        navigation.navigate({name: PlantsStackRoute.PLANTS_PREFILL, params: {}});
    }

    const renderPlantAvatar = (plant: Plant) => {
        return () => {
            return (<PlantAvatar size="large" avatar={plant.avatar}/>)
        }
    }

    const renderItem = ({item}: ListRenderItemInfo<Plant>) => {
        const renderDescription = (props: any) => {
            return (
                <View {...props} style={[props.style, {flexDirection: "row", alignItems: "center", marginTop: 5}]}>
                    {item.lastTimeWatered &&
                    <Badge icon="droplet-outline"
                           title={ObjectUtils.formatIsoDateString(item.lastTimeWatered)!}
                           style={{marginRight: 5}}/>
                    }
                    {item.lastTimeFertilised &&
                    <Badge icon="flash-outline"
                           title={ObjectUtils.formatIsoDateString(item.lastTimeFertilised)!}
                           style={{marginRight: 5}}/>
                    }
                    {item.lastTimeSprayed &&
                    <Badge icon="shield-outline"
                           title={ObjectUtils.formatIsoDateString(item.lastTimeSprayed)!}/>
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

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle(i18n.t('ALL_PLANTS'))}
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