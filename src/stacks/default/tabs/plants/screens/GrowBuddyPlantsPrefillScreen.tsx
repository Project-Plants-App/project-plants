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
import {useNavigation, useRoute} from "@react-navigation/native";
import {PlantsStackNavigationProp, PlantsStackRouteProp, PlantsTabRoute} from "../PlantsTabRoute";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import {Plant} from "../../../../../model/Plant";
import GrowBuddyPlantsService from "../../../../../services/GrowBuddyPlantsService";
import ObjectUtils from "../../../../../common/ObjectUtils";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsTabRoute.PLANTS_PREFILL>>();
    const route = useRoute<PlantsStackRouteProp<PlantsTabRoute.PLANTS_PREFILL>>();

    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Plant[]>([]);

    const onChangeText = async (query: string) => {
        setQuery(query);

        GrowBuddyPlantsService.searchForProducts(query).then((searchResults) => {
            setSearchResults(searchResults);
        })
    };

    const select = async (plant: Plant) => {
        navigation.replace(PlantsTabRoute.PLANTS_EDIT, {plant});
    }

    const skip = () => {
        navigation.navigate({name: PlantsTabRoute.PLANTS_EDIT, params: {}});
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

    const renderSearchResult = (entry: ListRenderItemInfo<Plant>) => (
        <ListItem
            title={entry.item.name}
            description={ObjectUtils.isDefined(entry.item.detailLinkName1) ? i18n.t(entry.item.detailLinkName1!) : 'UNKNOWN'}
            accessoryRight={ChevronRightIcon}
            onPress={() => select(entry.item)}
        />
    );

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle("Pflanze suchen")}
                           alignment="center"
                           accessoryLeft={CancelAction}/>
            <Divider/>
            <Layout style={styles.layout}>
                <Input label={i18n.t('SEARCH')} value={query} onChangeText={onChangeText}/>

                <List data={searchResults} renderItem={renderSearchResult}
                      ItemSeparatorComponent={Divider} style={styles.list}/>

                <Button onPress={skip} style={styles.button}>Nicht gefunden</Button>
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
        flexGrow: 1
    },
    button: {
        marginTop: 15,
    }
});