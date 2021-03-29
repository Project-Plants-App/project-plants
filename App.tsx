import React, {useState} from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry, Layout} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {NavigationContainer} from "@react-navigation/native";
import GrowBuddyDatabaseService from "./src/services/database/GrowBuddyDatabaseService";
import AppLoading from "expo-app-loading";
import {AppearanceProvider, useColorScheme} from "react-native-appearance";
import {SafeAreaView, StatusBar} from "react-native";
import DefaultStack from "./src/stacks/default/DefaultStack";

export default () => {
    return (
        <AppearanceProvider>
            <App/>
        </AppearanceProvider>
    );
}

const App = () => {

    const colorScheme = useColorScheme();
    const themeStatusBarStyle = colorScheme === 'light' ? 'dark-content' : 'light-content';

    const [initialized, setInitialized] = useState(false);

    const initialize = async () => {
        await GrowBuddyDatabaseService.migrateDatabase();
    }

    if (!initialized) {
        return (
            <AppLoading
                startAsync={initialize}
                onFinish={() => setInitialized(true)}
                onError={(error) => console.log(error)}
            />
        );
    }

    return (
        <NavigationContainer>
            <StatusBar barStyle={themeStatusBarStyle}/>
            <IconRegistry icons={EvaIconsPack}/>
            <ApplicationProvider {...eva} theme={colorScheme === 'dark' ? eva.dark : eva.light}>
                <Layout style={{flex: 1}}>
                    <SafeAreaView style={{flex: 1}}>
                        <DefaultStack/>
                    </SafeAreaView>
                </Layout>
            </ApplicationProvider>
        </NavigationContainer>
    )

}