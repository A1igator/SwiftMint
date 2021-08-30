import React from 'react';
import { Platform } from 'react-native';
import { Button, Icon, Text, Layout} from '@ui-kitten/components';
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';
import * as eva from '@eva-design/eva';
import Constants from 'expo-constants';

export default function CameraComplete(props) {
  const {setURI, setTheme, theme} = props;

  return (
    <>
    <Layout style={{flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center'}}>
      <Text style={{textAlign: 'center'}} category="h1">Mint NFTs for free on Ethereum</Text>
      <Layout style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
        {(Device.osName !== 'Windows' && Device.osName !== 'Linux' && Device.osName !== 'Mac' && typeof window.ethereum === 'undefined') && <Button accessoryLeft={<Icon name="camera-outline"/>}  onPress={async () => {
          if (Platform.OS !== 'web') {
            await ImagePicker.requestCameraPermissionsAsync();
          }
          const image = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true
          });
          setURI(image.base64);
        }}>Take a picture</Button>}
        <Button accessoryLeft={<Icon name="file-add-outline"/>} onPress={async () => {
          const image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true
          });
          setURI(image.base64);
        }}>Select from library</Button>
      </Layout>
    </Layout>
    <Button onPress={() => {
      if (theme === eva.dark) {
        setTheme(eva.light);
      } else {
        setTheme(eva.dark);
      }
    }} style={{zIndex: 10,height: 50, aspectRatio: 1, marginTop: Constants.statusBarHeight + 10, position: 'absolute', right: 10}} 
    accessoryLeft={<Icon name={theme === eva.dark ? 'moon-outline' : 'sun-outline'}/>}></Button>
    </>
  );
}