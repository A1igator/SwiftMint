import React, { useState } from 'react';
import {
  Dimensions, View, Linking, Platform, StyleSheet,
} from 'react-native';
import {
  Button, Icon, Input, Layout, Text, List, Modal, Card, Spinner,
} from '@ui-kitten/components';
import base64 from 'react-native-base64';
import * as Device from 'expo-device';
import { Link } from '@imtbl/imx-sdk';
import ImageView from './ImageView';

const boxHeight = Dimensions.get('window').height / 2.5;

const styles = StyleSheet.create({
  container: {
    flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center',
  },
  title: {
    textAlign: 'center', padding: 25,
  },
  listContainer: {
    height: boxHeight, alignSelf: 'stretch',
  },
  walletAddressInput: {
    width: Dimensions.get('window').width - 50 > 350 ? 350 : Dimensions.get('window').width - 50,
  },
  popText: {
    marginBottom: 10, textAlign: 'center',
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

const LoadingIndicator = ({ style }) => (
  <View style={style}>
    <Spinner size="small" />
  </View>
);

const setupWallet = async () => {
  const link = new Link('https://link.x.immutable.com');

  // Register user
  try {
    await link.setup({});
  } catch (err) {
    return false;
  }
  return true;
};

export default function UploadView({ history }) {
  const [walletAddress, setWalletAddress] = useState();
  const [items, setItems] = useState([{ uri: '+', name: '', description: '' }]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Layout style={styles.container}>
        <Text style={styles.title} category="h1">Mint NFTs for free on Ethereum</Text>
        <View style={styles.listContainer}>
          <List
            showsHorizontalScrollIndicator={false}
            horizontal
            data={items}
            renderItem={
            (elem) => <ImageView elem={elem} items={items} setItems={setItems} />
            }
          />
        </View>
        <Layout>
          <Input
            style={styles.walletAddressInput}
            onChangeText={(value) => setWalletAddress(value)}
            placeholder="Wallet Address"
          />
          {error && <Text status="danger">{error}</Text>}
        </Layout>
        <Button
          disabled={loading}
          appearance={loading ? 'outline' : 'filled'}
          accessoryLeft={loading ? LoadingIndicator : <Icon name="upload-outline" />}
          onPress={async () => {
            if (walletAddress === '' || walletAddress === undefined || walletAddress === null) {
              setError('Invalid wallet');
              return;
            }
            const itemsCopy = [...items];
            itemsCopy.pop();
            for (const item of itemsCopy) {
              const { name, uri } = item;
              if (name === '' || name === undefined || name === null) {
                setError('Item Name can not be empty');
                return;
              }
              item.uri = `data:image/png;base64,${uri}`;
            }

            setLoading(true);
            const res = await fetch('https://frictionless.eastus.cloudapp.azure.com/multimint', { // Your POST endpoint
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              mode: 'cors',
              body: JSON.stringify({
                walletAddress,
                items: itemsCopy,
                // collection: collectionName
              }),
            });
            if (res.status === 400) {
              const err = await res.text();
              if (err === 'Wallet not registered') {
                setModalVisible(true);
              } else {
                setError(err);
              }
            } else if (res.status === 524) {
              setError('IPFS timed out. Try again in a second');
            } else if (res.status === 200) {
              const results = await res.json();
              let resultsText = '';
              results.forEach((result) => {
                resultsText += `${result.token_id} `;
              });
              history.push(`/collections/${base64.encode(resultsText)}`);
            }
            setLoading(false);
          }}
        >
          Mint on Immutable X
        </Button>
      </Layout>
      <Modal
        visible={modalVisible}
        backdropStyle={styles.modalBackdrop}
      >
        <Card disabled>
          <Text style={styles.popText}>{'Your address is not registered on Immutable X.\nPlease register it using metamask extension on desktop.\n\nThis is only needed once.'}</Text>
          <Button onPress={async () => {
            if (Platform.OS === 'web' && (Device.osName === 'Windows' || Device.osName === 'Linux' || Device.osName === 'Mac')) {
              if (await setupWallet()) {
                setModalVisible(false);
              }
            } else {
              Linking.openURL('https://market.x.immutable.com/');
              setModalVisible(false);
            }
          }}
          >
            Registeration Link
          </Button>
        </Card>
      </Modal>
    </>
  );
}
