import React, { useState } from 'react';
import {Dimensions, Platform, View, Linking, } from 'react-native';
import * as Device from 'expo-device';
import * as WebBrowser from 'expo-web-browser';
import { Button, Input, Icon, Text, TopNavigation, TopNavigationAction, Layout, Spinner, Modal, Card } from '@ui-kitten/components';
import Image from 'react-native-scalable-image';
import { Link } from '@imtbl/imx-link-sdk';

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

export default function UploadToImmutable(props) {
  
  const {URI, setURI} = props;

  const [walletAddress, setWalletAddress] = useState();
  const [name, setName] = useState();
  const [isError, setIsError] = useState(true);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState("Mint on ImmutableX");
  const [imxURL, setImxURL] = useState();
  const [disclaimer, setDisclaimer] = useState();

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
                <Input disabled={loading || imxURL} style={{width: 350}} onChangeText={value => setName(value)} placeholder="Name" />
            </Layout>
            <Image source={{
                uri: `data:image/png;base64,${URI}`
            }} width={Platform.OS !== 'web' ? Dimensions.get('window').width*4/5 : Dimensions.get('window').width*2/5}/>
            <Layout>
                <Input disabled={loading || imxURL} style={{width: 350}} onChangeText={value => setWalletAddress(value)} placeholder="Wallet Address" />
                {isError && <Text status='danger'>{error}</Text>}
            </Layout>
            <Button disabled={loading} appearance={loading ? "outline" : "filled"} accessoryLeft={imxURL ? <Icon name="eye-outline"/> : (loading ? LoadingIndicator : <Icon name="upload-outline"/>)} onPress={async () => {
                if (imxURL) {
                    await WebBrowser.openBrowserAsync(imxURL);
                    return;
                }
                if (name === '' || name === undefined || name === null) {
                    setError("Name can not be empty");
                    setIsError(true);
                    return;
                }
                if (walletAddress === '' || walletAddress === undefined || walletAddress === null) {
                    setError("Invalid wallet");
                    setIsError(true);
                    return;
                }
                setIsError(false);
                setLoading(true);
                const res = await fetch('https://frictionless.eastus.cloudapp.azure.com/mint', { // Your POST endpoint
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                        uri: `data:image/png;base64,${URI}`,
                        walletAddress,
                        name,
                    }) // This is your file object
                });
                if (res.status === 400) {
                    const error = await res.text();
                    if (error === "Invalid wallet") {
                        setError(error);
                        setIsError(true);
                    } else if (error === "Wallet not registered") {
                        setModalVisible(true);
                        console.log(error);
                    }
                } else if (res.status === 524) {
                    setError("IPFS timed out. Try again in a second")
                    setIsError(true);
                } else  if (res.status === 200) {
                    console.log(res.status);
                    const {url} = await res.json();
                    setButtonText("View on ImmutableX");
                    setDisclaimer("(Metadata takes a few seconds to show up)");
                    setImxURL(url);
                }
                setLoading(false);
            }}>{buttonText}</Button>
            {disclaimer && <Text status='basic'>{disclaimer}</Text>}
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
            <Layout/>
            <Layout/>
            <Layout/>
        </Layout>
    </>
  );
}