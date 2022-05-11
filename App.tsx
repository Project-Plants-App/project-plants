import React, {useCallback, useEffect, useState} from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry, Layout} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {NavigationContainer} from "@react-navigation/native";
import GrowBuddyDatabaseService from "./src/services/database/GrowBuddyDatabaseService";
import DefaultStack from "./src/stacks/default/DefaultStack";
import {Appearance, SafeAreaView, StatusBar} from "react-native";
import * as Sentry from 'sentry-expo';
import * as SplashScreen from 'expo-splash-screen';

Sentry.init({
    dsn: 'https://87b522a85d234062b39f044f423848af@o566027.ingest.sentry.io/5708282',
    enableInExpoDevelopment: false
});

export default () => {
    return (
        <App/>
    );
}

const App = () => {

    const colorScheme = Appearance.getColorScheme();
    const themeStatusBarStyle = colorScheme === 'light' ? 'dark-content' : 'light-content';

    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        async function initialize() {
            await SplashScreen.preventAutoHideAsync();
            await GrowBuddyDatabaseService.openDatabase();
            setInitialized(true);
        }

        initialize();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (initialized) {
            await SplashScreen.hideAsync();
        }
    }, [initialized]);

    if (!initialized) {
        return null;
    }

    return (
        <NavigationContainer>
            <StatusBar barStyle={themeStatusBarStyle}/>
            <IconRegistry icons={EvaIconsPack}/>
            <ApplicationProvider {...eva} theme={colorScheme === 'dark' ? eva.dark : eva.light}>
                <Layout style={{flex: 1}} onLayout={onLayoutRootView}>
                    <SafeAreaView style={{flex: 1}}>
                        <DefaultStack/>
                    </SafeAreaView>
                </Layout>
            </ApplicationProvider>
        </NavigationContainer>
    )

}