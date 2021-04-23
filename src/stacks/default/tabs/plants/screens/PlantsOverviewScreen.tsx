import {useNavigation, useRoute} from "@react-navigation/native";
import {Divider, Icon, Layout, List, ListItem, Text, TopNavigation, TopNavigationAction} from "@ui-kitten/components";
import React, {useState} from "react";
import {ListRenderItemInfo, StyleSheet, View} from "react-native";
import {PlantsStackNavigationProp, PlantsStackRouteProp, PlantsTabRoute} from "../PlantsTabRoute";
import {Plant} from "../../../../../model/Plant";
import {useOnFocusOnceEffect} from "../../../../../common/hooks/Hooks";
import i18n from "../../../../../i18n";
import PlantAvatar from "../../../../../common/components/PlantAvatar";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import Badge from "../../../../../common/components/Badge";
import ObjectUtils from "../../../../../common/ObjectUtils";
import PlantService from "../../../../../services/PlantService";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsTabRoute.PLANTS_OVERVIEW>>();
    const route = useRoute<PlantsStackRouteProp<PlantsTabRoute.PLANTS_OVERVIEW>>();

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
        navigation.navigate({name: PlantsTabRoute.PLANTS_DETAIL, params: {plant}});
    }

    const openPrefillScreen = () => {
        navigation.navigate({name: PlantsTabRoute.PLANTS_PREFILL, params: {}});
    }

    const SettingsIcon = (props: any) => (
        <Icon {...props} name="plus-outline"/>
    );

    const CreateAction = () => (
        <TopNavigationAction icon={SettingsIcon} onPress={() => openPrefillScreen()}/>
    );

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
                           title={ObjectUtils.formatDate(item.lastTimeWatered)!}
                           style={{marginRight: 5}}/>
                    }
                    {item.lastTimeFertilised &&
                    <Badge icon="flash-outline"
                           title={ObjectUtils.formatDate(item.lastTimeFertilised)!}
                           style={{marginRight: 5}}/>
                    }
                    {item.lastTimeSprayed &&
                    <Badge icon="shield-outline"
                           title={ObjectUtils.formatDate(item.lastTimeSprayed)!}/>
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
                           accessoryRight={CreateAction}/>
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