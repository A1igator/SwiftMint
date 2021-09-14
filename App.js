import React, { useState } from 'react';
import { SafeAreaView, useColorScheme, Linking } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Button, Icon, Layout } from '@ui-kitten/components';
import Constants from 'expo-constants';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import UploadView from './components/UploadView';
import UploadToImmutable from './components/UploadToImmutable';
import { Fontisto } from '@expo/vector-icons';
// import CameraView from './components/CameraView';


export default function App() {
  
  const [URI, setURI] = useState(null);
  const [theme, setTheme] = useState(useColorScheme() === 'dark' ? eva.dark : eva.light);
  return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={theme}>
          <SafeAreaView style={{flex: 1, paddingTop: Constants.statusBarHeight}}>
            <Layout style={{flex: 1}}>
              {URI ? (
                <UploadToImmutable style={{flex: .9}} URI={URI} setURI={setURI}/>
              ) : (
                <UploadView theme={theme} setTheme={setTheme} setURI={setURI}/>
                // <CameraView/>
              )}
              <Layout style={{flex: .1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Button style={{width: 50}} onPress={() => {
                  Linking.openURL("https://discord.gg/xFRt2rpyq4");
                }}
                accessoryLeft={<Fontisto size={24} color="white" name="discord"/>}>
                </Button>
                <Button style={{width: 50, marginLeft: 10}} onPress={() => {
                  Linking.openURL("https://twitter.com/swift_mint");
                }}
                accessoryLeft={<Fontisto size={18} color="white" name="twitter"/>}>
                </Button>
              </Layout>
            </Layout>
            <Button onPress={() => {
              if (theme === eva.dark) {
                setTheme(eva.light);
              } else {
                setTheme(eva.dark);
              }
            }} style={{zIndex: 10, height: 50, aspectRatio: 1, marginTop: Constants.statusBarHeight + 10, position: 'absolute', right: 10}} 
            accessoryLeft={<Icon name={theme === eva.dark ? 'moon-outline' : 'sun-outline'}/>}>
            </Button>
          </SafeAreaView>
        </ApplicationProvider>
      </>
  );
}