import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Button, Icon, Input, Layout, Text, List} from '@ui-kitten/components';

import * as eva from '@eva-design/eva';
import Constants from 'expo-constants';
import ImageView from './ImageView';

export default function UploadView(props) {
  const {setURI, setTheme, theme} = props;
  const [collectionName, setCollectionName] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [items, setItems] = useState([{uri: "+", name: ""}]);
  console.log(items);

  return (
    <>
      <Layout style={{flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center'}}>
        <Text style={{textAlign: 'center', padding: 25}} category="h1">Mint NFTs for free on Ethereum</Text>

        <Layout>
          <Input style={{width: Dimensions.get('window').width - 50 > 350 ? 350 : Dimensions.get('window').width - 50}} onChangeText={value => setCollectionName(value)} placeholder="Collection Name (optional)" />
        </Layout>
        <View style={{height: Dimensions.get('window').height/3, alignSelf: 'stretch'}}>
          <List showsHorizontalScrollIndicator={false} horizontal data={items} renderItem={(elem) => <ImageView elem={elem} items={items} setItems={setItems} />}/>
        </View>
        <Layout>
          <Input style={{width: Dimensions.get('window').width - 50 > 350 ? 350 : Dimensions.get('window').width - 50}} onChangeText={value => setWalletAddress(value)} placeholder="Wallet Address" />
          {<Text status='danger'></Text>}
        </Layout>
        <Button>Mint on ImmutableX</Button>
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