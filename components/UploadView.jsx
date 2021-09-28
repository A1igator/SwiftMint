import React, { useState } from 'react';
import { Dimensions, View, Linking, Platform } from 'react-native';
import { Button, Icon, Input, Layout, Text, List, Modal, Card, Spinner } from '@ui-kitten/components';
import base64 from 'react-native-base64'
import ImageView from './ImageView';

const LoadingIndicator = (props) => (
  <View style={props.style}>
    <Spinner size='small'/>
  </View>
);

const setupWallet = async () => {
  const link = new Link('https://link.x.immutable.com');

  // Register user, you can persist address to local storage etc.
  try {
    await link.setup({});
  } catch(err) {
    return false
  }
  return true;
}

const boxHeight = Dimensions.get('window').height/2.5;

export default function UploadView({ history }) {
  // const [collectionName, setCollectionName] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [items, setItems] = useState([{uri: "+", name: "", description: ""}]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState("Mint on ImmutableX");
  const [disclaimer, setDisclaimer] = useState();

  return (
    <>
      <Layout style={{flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center'}}>
        <Text style={{textAlign: 'center', padding: 25}} category="h1">Mint NFTs for free on Ethereum</Text>
        {/* <Layout>
          <Input style={{width: Dimensions.get('window').width - 50 > 350 ? 350 : Dimensions.get('window').width - 50}} onChangeText={value => setCollectionName(value)} placeholder="Collection Name (optional)" />
        </Layout> */}
        <View style={{height: boxHeight, alignSelf: 'stretch'}}>
          <List showsHorizontalScrollIndicator={false} horizontal data={items} renderItem={(elem) => <ImageView elem={elem} items={items} setItems={setItems} />}/>
        </View>
        <Layout>
          <Input style={{width: Dimensions.get('window').width - 50 > 350 ? 350 : Dimensions.get('window').width - 50}} onChangeText={value => setWalletAddress(value)} placeholder="Wallet Address" />
          {error && <Text status='danger'>{error}</Text>}
        </Layout>
        <Button disabled={loading} appearance={loading ? "outline" : "filled"} accessoryLeft={loading ? LoadingIndicator : <Icon name="upload-outline"/>} onPress={async () => {
                if (walletAddress === '' || walletAddress === undefined || walletAddress === null) {
                  setError("Invalid wallet");
                  return;
                }
                const itemsCopy = [...items];
                console.log(itemsCopy);
                itemsCopy.pop();
                for(let item of itemsCopy) {
                  const {name, uri} = item;
                  if (name === '' || name === undefined || name === null) {
                    setError("Item Name can not be empty");
                    return;
                  }
                  item.uri = `data:image/png;base64,${uri}`;
                }

                setLoading(true);
                const res = await fetch('https://frictionless.eastus.cloudapp.azure.com/multimint', { // Your POST endpoint
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                        walletAddress,
                        items: itemsCopy,
                        // collection: collectionName
                    }) // This is your file object
                });
                if (res.status === 400) {
                    const error = await res.text();
                    if (error === "Wallet not registered") {
                      setModalVisible(true);
                    } else {
                        setError(error);
                    }
                } else if (res.status === 524) {
                    setError("IPFS timed out. Try again in a second")
                } else  if (res.status === 200) {
                    const results = await res.json();
                    let resultsText = '';
                    results.forEach(result => {
                      resultsText += result.token_id + ' ';
                    });
                    history.push('/collections/' + base64.encode(resultsText));
                }
                setLoading(false);
            }}>{buttonText}</Button>
            {disclaimer && <Text status='basic'>{disclaimer}</Text>}
      </Layout>
      <Modal
        visible={modalVisible}
        backdropStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <Card disabled={true}>
            <Text style={{marginBottom: 10, textAlign: 'center'}}>{"Your address is not registered on Immutable X.\nPlease register it using metamask extension on desktop.\n\nThis is only needed once."}</Text>
            <Button onPress={async () => {
                if (Platform.OS === 'web' && (Device.osName === 'Windows' || Device.osName === 'Linux' || Device.osName === 'Mac')) {
                    if (await setupWallet()) {
                        setModalVisible(false);
                    }
                } else {
                    Linking.openURL('https://market.x.immutable.com/');
                    setModalVisible(false);
                }
              }}>
                Registeration Link
            </Button>
          </Card>
      </Modal>
    </>
  );
}