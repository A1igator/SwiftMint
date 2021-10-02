import React, { useState } from 'react';
import { Platform, Dimensions, View } from 'react-native';
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';
import Image from 'react-native-scalable-image';
import {
  Layout, Input, Button, Icon, Modal, Text,
} from '@ui-kitten/components';

const imgHeight = Dimensions.get('window').height / 3 - 100;

export default function ImageView(props) {
  const {
    elem: { item, index }, items, setItems,
  } = props;
  const [imageModalVisible, setImageModalVisible] = useState(false);

  return (
    <Layout style={{
      width: Dimensions.get('window').width, flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center',
    }}
    >
      <View style={{
        backgroundColor: 'grey', flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', padding: 25,
      }}
      >
        {item.uri === '+' ? (
          <View style={{
            width: Dimensions.get('window').width - 100 > 350 ? 350 : Dimensions.get('window').width - 100, flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center',
          }}
          >
            <Button
              style={{ width: 50 }}
              onPress={() => {
                if (index > 0) {
                  item.uri = 'selectItem';
                  items[index].uri = 'selectItem';
                  setItems([...items, { uri: '+', name: '', description: '' }]);
                } else {
                  setItems([{ uri: 'selectItem', name: '', description: '' }, ...items]);
                }
              }}
            >
              +
            </Button>
          </View>
        ) : (
          <>
            <Layout>
              <Input
                style={{ width: Dimensions.get('window').width - 100 > 350 ? 350 : Dimensions.get('window').width - 100 }}
                onChangeText={(value) => {
                  item.name = value;
                  items[index].name = value;
                  setItems([...items]);
                }}
                placeholder="Item Name"
              />
            </Layout>
            {item.uri !== '+' && (
            <Button
              style={{
                zIndex: 100, position: 'absolute', top: 0, right: -20, width: 10, heigh: 10,
              }}
              onPress={() => {
                items.splice(index, 1);
                setItems([...items]);
              }}
            >
              X
            </Button>
            )}
            {item.uri === 'selectItem' ? (
              <>
                <View style={{
                  width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', flex: 2,
                }}
                >
                  {(Device.osName !== 'Windows' && Device.osName !== 'Linux' && Device.osName !== 'Mac' && typeof window.ethereum === 'undefined') && (
                  <Button
                    accessoryLeft={<Icon name="camera-outline" />}
                    onPress={async () => {
                      if (Platform.OS !== 'web') {
                        await ImagePicker.requestCameraPermissionsAsync();
                      }
                      const image = await ImagePicker.launchCameraAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        base64: true,
                      });
                      item.uri = image.base64;
                      items[index].uri = image.base64;
                      setItems([...items]);
                    }}
                  >
                    Take a picture
                  </Button>
                  )}
                  <Button
                    accessoryLeft={<Icon name="file-add-outline" />}
                    onPress={async () => {
                      const image = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        base64: true,
                      });
                      item.uri = image.base64;
                      items[index].uri = image.base64;
                      setItems([...items]);
                    }}
                  >
                    Select from library
                  </Button>
                </View>
              </>
            ) : (
              <>
                <Image
                  onPress={() => {
                    setImageModalVisible(true);
                  }}
                  source={{
                    uri: `data:image/png;base64,${item.uri}`,
                  }}
                  height={imgHeight}
                />
                <Modal visible={imageModalVisible}>
                  <Image
                    onPress={() => {
                      setImageModalVisible(false);
                    }}
                    source={{
                      uri: `data:image/png;base64,${item.uri}`,
                    }}
                    height={Dimensions.get('window').height}
                  />
                </Modal>
              </>
            )}
            <Layout>
              <Input
                multiline
                style={{ width: Dimensions.get('window').width - 100 > 350 ? 350 : Dimensions.get('window').width - 100 }}
                onChangeText={(value) => {
                  item.description = value;
                  items[index].description = value;
                  setItems([...items]);
                }}
                placeholder="Description (optional)"
              />
            </Layout>
          </>
        )}

      </View>
      {item.uri !== '+' && index === 0 && <Text style={{ paddingTop: 10 }}>Scroll to add more ⟶</Text>}
    </Layout>
  );
}
