import {useNavigation, useRoute} from "@react-navigation/native";
import {
    Button,
    Card,
    Divider,
    Icon,
    Layout,
    List,
    ListItem,
    Modal,
    Text,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import React, {useState} from "react";
import {ListRenderItemInfo, StyleSheet, View} from "react-native";
import {PlantsStackNavigationProp, PlantsStackRouteProp, PlantsTabRoute} from "../PlantsTabRoute";
import {Plant} from "../../../../../model/Plant";
import {useOnFocusOnceEffect} from "../../../../../common/hooks/Hooks";
import PlantRepository from "../../../../../repositories/PlantRepository";
import i18n from "../../../../../i18n";
import PlantAvatar from "../../../../../common/components/PlantAvatar";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsTabRoute.PLANTS_OVERVIEW>>();
    const route = useRoute<PlantsStackRouteProp<PlantsTabRoute.PLANTS_OVERVIEW>>();

    const [plants, setPlants] = useState<Plant[]>();
    const [prePlantCreationDialogVisible, setPrePlantCreationDialogVisible] = useState(false);

    const reload = () => {
        PlantRepository.selectAllPlants().then((plants) => {
            setPlants(plants);
        });
    }

    useOnFocusOnceEffect(() => {
        reload()
    });

    const openPlantDetail = (plant: Plant) => {
        navigation.navigate({name: PlantsTabRoute.PLANTS_DETAIL, params: {plant}});
    }

    const openBaldurPrefill = () => {
        setPrePlantCreationDialogVisible(false);

        navigation.navigate({name: PlantsTabRoute.PLANTS_BALDUR_PREFILL, params: {}});
    }

    const openPlantCreate = () => {
        setPrePlantCreationDialogVisible(false);

        navigation.navigate({name: PlantsTabRoute.PLANTS_EDIT, params: {}});
    }

    const SettingsIcon = (props: any) => (
        <Icon {...props} name="plus-outline"/>
    );

    const CreateAction = () => (
        <TopNavigationAction icon={SettingsIcon} onPress={() => setPrePlantCreationDialogVisible(true)}/>
    );

    const renderPlantAvatar = (plant: Plant) => {
        return (props: any) => {
            return (<PlantAvatar {...props} avatar={plant.avatar}/>)
        }
    }

    const renderItem = ({item}: ListRenderItemInfo<Plant>) => {
        return (
            <ListItem title={item.name}
                      accessoryLeft={renderPlantAvatar(item)}
                      onPress={() => openPlantDetail(item)}/>
        )
    }

    return (
        <React.Fragment>
            <TopNavigation title={i18n.t('ALL_PLANTS')} alignment="center" accessoryRight={CreateAction}/>
            <Divider/>
            <Layout style={styles.layout}>
                <List data={plants} renderItem={renderItem} style={styles.list} ItemSeparatorComponent={Divider}/>

                <Modal visible={prePlantCreationDialogVisible}
                       backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}
                       onBackdropPress={() => setPrePlantCreationDialogVisible(false)}>
                    <Card disabled={true}>
                        <Text>Hast du die Pflanze bei Baldur gekauft?</Text>
                        <View style={{flexDirection:"row", justifyContent:"center", marginTop:15}}>
                        <Button onPress={() => openBaldurPrefill()} style={{marginRight:15}}>Ja</Button>
                        <Button onPress={() => openPlantCreate()}>Nein</Button>
                        </View>
                    </Card>
                </Modal>
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