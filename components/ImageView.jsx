import React, { useState } from 'react';
import {
  Platform, Dimensions, View, StyleSheet,
} from 'react-native';
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';
import Image from 'react-native-scalable-image';
import {
  Layout, Input, Button, Icon, Modal, Text,
} from '@ui-kitten/components';

const imgHeight = Dimensions.get('window').height / 3 - 100;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width, flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center',
  },
  cardBackground: {
    backgroundColor: 'grey', flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', padding: 25, marginTop: 20,
  },
  plusButtonContainer: {
    flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center',
  },
  plusButton: {
    width: 50,
  },
  itemElement: {
    width: Dimensions.get('window').width - 100 > 350 ? 350 : Dimensions.get('window').width - 100,
  },
  closeButton: {
    zIndex: 99999, position: 'absolute', top: -20, right: -20, width: 10, heigh: 10,
  },
  selectImageContainer: {
    width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', flex: 2,
  },
  scrollForMore: {
    paddingTop: 10,
  },
});

export default function ImageView(props) {
  const {
    elem: { item, index }, items, setItems,
  } = props;
  const [imageModalVisible, setImageModalVisible] = useState(false);

  return (
    <Layout style={styles.container}>
      <View style={styles.cardBackground}>
        {item.uri === '+' ? (
          <View style={[styles.plusButtonContainer, styles.itemElement]}>
            <Button
              style={styles.plusButton}
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
                style={styles.itemElement}
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
              style={styles.closeButton}
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
                <View style={styles.selectImageContainer}>
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
                style={styles.itemElement}
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
      {item.uri !== '+' && index === 0 && <Text style={styles.scrollForMore}>Scroll to add more ⟶</Text>}
    </Layout>
  );
}
