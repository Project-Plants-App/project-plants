import React, {useState} from "react";
import {
    Button,
    Divider,
    Icon,
    Input,
    Layout,
    List,
    ListItem,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import {ListRenderItemInfo, StyleSheet} from "react-native";
import i18n from "../../../../../i18n";
import PlantAvatar from "../../../../../common/components/PlantAvatar";
import {StackActions, useNavigation, useRoute} from "@react-navigation/native";
import {PlantsStackNavigationProp, PlantsStackRouteProp, PlantsTabRoute} from "../PlantsTabRoute";
import BaldurGartenService, {BaldurGartenProductSearchResult} from "../../../../../services/BaldurGartenService";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsTabRoute.PLANTS_BALDUR_PREFILL>>();
    const route = useRoute<PlantsStackRouteProp<PlantsTabRoute.PLANTS_BALDUR_PREFILL>>();

    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<BaldurGartenProductSearchResult[]>([]);

    const onChangeText = async (query: string) => {
        setQuery(query);

        BaldurGartenService.searchForProducts(query).then((searchResults) => {
            setSearchResults(searchResults);
        })
    };

    const select = async (searchResult: BaldurGartenProductSearchResult) => {
        const plant = await BaldurGartenService.extractPlantDetails(searchResult);

        navigation.navigate({name: PlantsTabRoute.PLANTS_EDIT, params: {plant}});
    }

    const skip = () => {
        navigation.navigate({name: PlantsTabRoute.PLANTS_EDIT, params: {}});
    }

    const cancel = () => {
        navigation.dispatch(StackActions.popToTop());
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

    const renderAvatar = (item: BaldurGartenProductSearchResult) => {
        return (props: any) => {
            return <PlantAvatar {...props} avatar={item.avatarUrl}/>
        }
    }

    const renderSearchResult = (entry: ListRenderItemInfo<BaldurGartenProductSearchResult>) => (
        <ListItem
            title={entry.item.name}
            accessoryLeft={renderAvatar(entry.item)}
            accessoryRight={ChevronRightIcon}
            onPress={() => select(entry.item)}
        />
    );

    return (
        <React.Fragment>
            <TopNavigation title="Pflanze von BALDUR-Garten wählen"
                           alignment="center"
                           accessoryLeft={CancelAction}/>
            <Divider/>
            <Layout style={styles.layout}>
                <Input label={i18n.t('SEARCH')} value={query} onChangeText={onChangeText}/>

                <List data={searchResults} renderItem={renderSearchResult}
                      ItemSeparatorComponent={Divider} style={styles.list}/>

                <Button onPress={skip} style={styles.button}>Überspringen</Button>
            </Layout>
            <Divider/>
        </React.Fragment>
    )

}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        padding: 15
    },
    list: {
        marginTop: 15,
        flexGrow: 0
    },
    button: {
        marginTop: 15,
    }
});