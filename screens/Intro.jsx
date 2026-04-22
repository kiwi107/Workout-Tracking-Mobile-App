import { View, Text, Image, StyleSheet } from 'react-native'
import {useEffect} from 'react'

const Intro = ({navigation}) => {

    useEffect(() => {
        setTimeout(() => {
            navigation.replace('Home')
        }, 2000)
    }, [])
    return (
        <>
            <View style={styles.container}>
                <Image style={styles.image} source={require('../assets/kiwi.png')} />
                <Text style={styles.text}>KiwiFit</Text>

            </View>
            <Text style={{ bottom: 80,textAlign:'center' }} >Brought to you by the one and only kiwi</Text>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100,
    },
    image: {
        height: 100,
        width: 100,
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'navy',
        marginTop: 10, // Add some space between the image and text
    },
});
export default Intro