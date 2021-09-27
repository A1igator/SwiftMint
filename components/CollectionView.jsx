import React, { useState } from 'react';
import {Linking, Dimensions, View, ScrollView} from 'react-native';
import * as Device from 'expo-device';
import { Button, Icon, Input, Layout, Text, Modal, Card, Spinner } from '@ui-kitten/components';
import base64 from 'react-native-base64'
import Image from 'react-native-scalable-image';
import * as Sharing from 'expo-sharing';

export default function CollectionView({route}) {
    const [itemsMetadatas, setItemsMetadatas] = useState();
    const [error, setError] = useState();
    const [shareText, setShareText] = useState('Share');
    if (shareText !== 'Copy link') {
        Sharing.isAvailableAsync().then(res => {
            if (!res) {
                setShareText('Copy link');
            }
        });
    }
    const {params} = route;
    const base64Decoded = base64.decode(decodeURIComponent(params.id));
    const itemsMinted = base64Decoded.split(' ');
    itemsMinted.pop();
    if (itemsMinted.length === 0 && !error) {
        setError('Collection doesn\'t exist')
    }
    const getMetadatas = async () => {
        setItemsMetadatas(await Promise.all(itemsMinted.map(async item => {
            let metadata;
            while (metadata === undefined || metadata === null) {
                const res = await fetch('https://api.x.immutable.com/v1/assets/0x41ff943a5a31652a33cb23fb942769abb3dbaf97/' + item);
                const itemData = await res.json();
                metadata = itemData.metadata;
            }
            console.log(metadata);
            return {
                id: item,
                metadata
            };
        })));
    }
    if (!itemsMetadatas) {
        getMetadatas();
    }
    
    return (
        <Layout style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
            {error && <Text category='h1' style={{paddingTop: 20}}>{error}</Text>}
            {!itemsMetadatas && <Spinner style={{paddingTop: 20}} size='giant'/>}
            {/* <Layout style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center'}}> */}
            {itemsMetadatas && <View style={{alignSelf: 'stretch'}}>
                <ScrollView horizontal> 
                    {itemsMetadatas.map(({id, metadata}) => <Card  onPress={() => {
                        Linking.openURL('https://market.x.immutable.com/assets/0x41ff943a5a31652a33cb23fb942769abb3dbaf97/' + id);
                    }} key={id}>
                        <Text style={{textAlign: 'center', paddingBottom: 10}}>{metadata.name}</Text>
                        <Image height={Dimensions.get('window').height/3} source={{uri: metadata.image}}/>
                    </Card>)}
                </ScrollView>
                <Layout>
                    <Button onPress={async () => {
                        if (await Sharing.isAvailableAsync()) {
                            await Sharing.shareAsync(window.location.href);
                        } else {
                            await navigator.clipboard.writeText(window.location.href);
                        }
                    }}>{shareText}</Button>
                </Layout>
            </View>}
            {/* </Layout> */}
        </Layout>
    )
}