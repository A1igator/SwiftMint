import React from 'react';
import { Platform } from 'react-native';
import { Button, Icon, Text, Layout} from '@ui-kitten/components';
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerView(props) {
  const {setURI} = props;

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
    </>
  );
}