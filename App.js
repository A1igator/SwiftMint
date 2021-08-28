import React, { useState } from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import Constants from 'expo-constants';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import CameraComplete from './components/CameraComplete';
import UploadToImmutable from './components/UploadToImmutable';


export default function App() {
  
  const [URI, setURI] = useState(null);
  const [theme, setTheme] = useState(useColorScheme() === 'dark' ? eva.dark : eva.light);
  return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={theme}>
          <SafeAreaView style={{flex: 1, paddingTop: Constants.statusBarHeight}}>
            {URI ? (
              <UploadToImmutable URI={URI} setURI={setURI}/>
            ) : (
              <CameraComplete theme={theme} setTheme={setTheme} setURI={setURI}/>
            )}
          </SafeAreaView>
        </ApplicationProvider>
      </>
  );
}