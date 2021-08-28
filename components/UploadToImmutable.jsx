import React, { useState } from 'react';
import {Dimensions, Platform, View, Linking} from 'react-native';
import { Button, Input, Icon, Text, TopNavigation, TopNavigationAction, Layout, Spinner, Modal, Card } from '@ui-kitten/components';
import Image from 'react-native-scalable-image';
import { Link } from '@imtbl/imx-link-sdk';

const LoadingIndicator = (props) => (
    <View style={props.style}>
      <Spinner size='small'/>
    </View>
  );

const setupWallet = async () => {
  const link = new Link('https://link.uat.x.immutable.com');

  // Register user, you can persist address to local storage etc.
  try {
    await link.setup({});
  } catch(err) {
    return false
  }
  return true;
}

export default function UploadToImmutable(props) {
  
  const {URI, setURI} = props;

  const [walletAddress, setWalletAddress] = useState();
  const [name, setName] = useState();
  const [isAddress, setIsAddress] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
        <TopNavigation
            accessoryLeft={
                <TopNavigationAction 
                    onPress={()=> {
                        setURI(null);
                    }} 
                    icon={<Icon name="arrow-back"/>} 
                />
            }
        />
        <Layout style={{flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center'}}>
            <Layout>
                <Input style={{width: 350}} onChangeText={value => setName(value)} placeholder="Name" />
            </Layout>
            <Image source={{
                uri: `data:image/png;base64,${URI}`
            }} width={Platform.OS !== 'web' ? Dimensions.get('window').width*4/5 : Dimensions.get('window').width*2/5}/>
            <Layout>
                <Input style={{width: 350}} onChangeText={value => setWalletAddress(value)} placeholder="Wallet Address" />
                {!isAddress && <Text  status='danger'>Invalid Address</Text>}
            </Layout>
            <Button disabled={loading} appearance={loading ? "outline" : "filled"} accessoryLeft={loading ? LoadingIndicator : <Icon name="upload-outline"/>} onPress={async () => {
                if (walletAddress === '' || walletAddress === undefined || walletAddress === null) {
                    setIsAddress(false);
                    return;
                }
                setIsAddress(true);
                setLoading(true);
                const res = await fetch('https://frictionless.eastus.cloudapp.azure.com/mint', { // Your POST endpoint
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        uri: `data:image/png;base64,${URI}`,
                        walletAddress,
                        name,
                    }) // This is your file object
                });
                if (res.status === 400) {
                    const error = await res.text();
                    if (error === "Invalid wallet") {
                        setIsAddress(false);
                    } else if (error === "Wallet not registered") {
                        setModalVisible(true);
                        console.log(error);
                    }
                } else  if (res.status === 200) {
                    console.log(res.status);
                    const {url} = await res.json();
                    console.log(url);
                }
                setLoading(false);
            }}>Mint on ImmutableX</Button>
            <Modal
                visible={modalVisible}
                backdropStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <Card disabled={true}>
                        <Text style={{marginBottom: 10, textAlign: 'center'}}>{"Your address is not registered on Immutable X.\nPlease register it using metamask.\n\nThis is only needed once."}</Text>
                        <Button onPress={async () => {
                            if (Platform.OS === 'web') {
                                if (await setupWallet()) {
                                    setModalVisible(false);
                                }
                            } else {
                                Linking.openURL('https://market.x.immutable.com/');
                                setModalVisible(false);
                            }
                        }}>
                            Register
                        </Button>
                    </Card>
            </Modal>
            <Layout/>
            <Layout/>
            <Layout/>
        </Layout>
    </>
  );
}