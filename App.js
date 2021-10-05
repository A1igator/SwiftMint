/* eslint react/jsx-filename-extension: 0 */

import React, { useState } from 'react';
import {
  SafeAreaView, useColorScheme, Linking, StyleSheet,
} from 'react-native';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider, IconRegistry, Button, Icon, Layout,
} from '@ui-kitten/components';
import Constants from 'expo-constants';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Fontisto } from '@expo/vector-icons';
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import UploadView from './components/UploadView';
import CollectionView from './components/CollectionView';

const styles = StyleSheet.create({
  container: {
    flex: 1, paddingTop: Constants.statusBarHeight,
  },
  bottomBarContainer: {
    flex: 0.1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  linkButton: {
    width: 50,
    margin: 5,
  },
  themeButton: {
    zIndex: 10, height: 50, aspectRatio: 1, marginTop: Constants.statusBarHeight + 10, position: 'absolute', right: 10,
  },
});

export default function App() {
  const [theme, setTheme] = useState(useColorScheme() === 'dark' ? eva.dark : eva.light);
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={theme}>
        <SafeAreaView style={styles.container}>
          <Router>
            <Switch>
              <Route path="/collections/:id" component={CollectionView} />
              <Route path="/" component={UploadView} />
            </Switch>
            <Layout style={styles.bottomBarContainer}>
              <Button
                style={styles.linkButton}
                onPress={() => {
                  Linking.openURL('https://discord.gg/xFRt2rpyq4');
                }}
                accessoryLeft={<Fontisto size={24} color="white" name="discord" />}
              />
              <Button
                style={styles.linkButton}
                onPress={() => {
                  Linking.openURL('https://twitter.com/swift_mint');
                }}
                accessoryLeft={<Fontisto size={18} color="white" name="twitter" />}
              />
            </Layout>
            <Button
              onPress={() => {
                if (theme === eva.dark) {
                  setTheme(eva.light);
                } else {
                  setTheme(eva.dark);
                }
              }}
              style={styles.themeButton}
              accessoryLeft={<Icon name={theme === eva.dark ? 'moon-outline' : 'sun-outline'} />}
            />
          </Router>
        </SafeAreaView>
      </ApplicationProvider>
    </>
  );
}
