import React, {useEffect, useState} from "react";
import {
    Button,
    Divider,
    Icon,
    IndexPath,
    Input,
    Layout,
    List,
    ListItem,
    Select,
    SelectItem,
    Text,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import {ListRenderItemInfo, StyleSheet, View} from "react-native";
import i18n, {translateEnumValue} from "../../../../../i18n";
import {useNavigation, useRoute} from "@react-navigation/native";
import {PlantsStackNavigationProp, PlantsStackRoute, PlantsStackRouteProp} from "../PlantsStackRoute";
import TopNavigationTitle from "../../../../../common/components/TopNavigationTitle";
import {Plant} from "../../../../../model/Plant";
import GrowBuddyPlantsService, {PlantInfoSource} from "../../../../../services/GrowBuddyPlantsService";
import {isDefined} from "../../../../../common/Utils";
import Badge from "../../../../../common/components/Badge";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsStackRoute.PLANTS_PREFILL>>();
    const route = useRoute<PlantsStackRouteProp<PlantsStackRoute.PLANTS_PREFILL>>();

    const generateSelectableSources = () => {
        return Object.keys(PlantInfoSource).map((sourceAsString) => (PlantInfoSource as any)[sourceAsString] as PlantInfoSource);
    }

    const generateInitialSourceSelection = () => {
        return selectableSources.map((source) => new IndexPath(selectableSources.indexOf(source)));
    }

    const generateSelectItems = () => {
        return selectableSources.map((source) => (
            <SelectItem title={translateEnumValue(source, PlantInfoSource)}
                        key={selectableSources.indexOf(source)}/>
        ));
    }

    const getSelectedSources: () => PlantInfoSource[] = () => {
        return selectedSources.map((source) => selectableSources[source.row]);
    }

    const [existingPlant] = useState(route.params.plant)

    const [selectableSources] = useState(generateSelectableSources())

    const [query, setQuery] = useState(existingPlant?.name || '');
    const [selectedSources, setSelectedSources] = useState<IndexPath[]>(generateInitialSourceSelection());

    const [searchResults, setSearchResults] = useState<Plant[]>([]);

    useEffect(() => {
        GrowBuddyPlantsService.searchForProducts(query, getSelectedSources()).then((searchResults) => {
            setSearchResults(searchResults);
        })
    }, [query, selectedSources])

    const select = async (plant: Plant) => {
        const mergedPlant = Object.assign(existingPlant || {}, plant);
        console.log(mergedPlant)
        if (existingPlant) {
            navigation.goBack();
            navigation.replace(PlantsStackRoute.PLANTS_EDIT, {plant: mergedPlant});
        } else {
            navigation.navigate({name: PlantsStackRoute.PLANTS_EDIT, params: {plant: mergedPlant}});
        }
    }

    const skip = () => {
        navigation.navigate({name: PlantsStackRoute.PLANTS_EDIT, params: {}});
    }

    const cancel = () => {
        navigation.goBack();
    }

    const CancelIcon = (props: any) => (
        <Icon {...props} name="close-outline"/>
    );

    const CancelAction = () => (
        <TopNavigationAction icon={CancelIcon} onPress={() => cancel()}/>
    );

    const ChevronRightIcon = (props: any) => (
        <Icon {...props} name="chevron-right-outline"/>
    );

    const renderSearchResult = (entry: ListRenderItemInfo<Plant>) => {
        const renderDescription = (props: any) => {
            return (
                <View {...props}
                      style={[props.style, {flexDirection: "column", alignItems: "flex-start", marginTop: 5}]}>
                    {entry.item.detailLinkName1 &&
                    <Badge
                        title={isDefined(entry.item.detailLinkName1) ? i18n.t(entry.item.detailLinkName1!) : 'UNKNOWN'}
                        style={{marginBottom: 5}}/>
                    }
                    {entry.item.botanicalName &&
                    <Badge title={entry.item.botanicalName}/>
                    }
                </View>
            )
        }

        return (
            <ListItem
                title={entry.item.name}
                description={renderDescription}
                accessoryRight={ChevronRightIcon}
                onPress={() => select(entry.item)}
            />
        )
    };

    return (
        <React.Fragment>
            <TopNavigation title={TopNavigationTitle("Pflanze suchen")}
                           alignment="center"
                           accessoryLeft={CancelAction}/>
            <Layout style={styles.layout}>
                <Input placeholder={i18n.t('SEARCH')} value={query}
                       onChangeText={(query) => setQuery(query)}/>
                <Select
                    style={styles.select}
                    multiSelect={true}
                    selectedIndex={selectedSources}
                    value={() => <Text>{i18n.t('SOURCES')}</Text>}
                    onSelect={(selectedSources) => setSelectedSources(selectedSources as IndexPath[])}>
                    {generateSelectItems()}
                </Select>
            </Layout>
            <Divider/>
            <Layout style={styles.listContainer}>
                <List data={searchResults} renderItem={renderSearchResult}
                      ItemSeparatorComponent={Divider} style={styles.list}/>
            </Layout>
            <Divider/>
            {!existingPlant &&
            <Layout style={styles.layout}>
                <Button onPress={skip} style={styles.button}>Nicht gefunden</Button>
            </Layout>
            }
        </React.Fragment>
    )

}

const styles = StyleSheet.create({
    layout: {
        padding: 15,
        paddingTop: 0
    },
    listContainer: {
        flex: 1
    },
    list: {
        flexGrow: 1
    },
    select: {
        marginTop: 15,
    },
    button: {
        marginTop: 15,
    }
});