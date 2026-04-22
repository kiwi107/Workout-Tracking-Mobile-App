import { View, Text, Image } from 'react-native'
import React from 'react'
import StartIcon from 'react-native-vector-icons/Octicons';
import { ScrollView } from 'react-native-gesture-handler';

const PastWorkoutScreen = () => {
    return (
        <View>
            <Image source={require('../assets/mako_past.jpg')} style={{ width: '100%', height: 350, alignSelf: 'center', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }} />
            <ScrollView>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10, padding: 10, backgroundColor: 'white', height: 100, borderRadius: 20 }}>
                    <Text style={{ fontSize: 25, color: "#57ADBF", marginEnd: 5, alignSelf: 'center'}}>Chest + Triceps</Text>
                    <StartIcon name="play" size={35} color="#57ADBF" style={{ alignSelf: 'center' }} />

                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10, padding: 10, backgroundColor: 'white', height: 100, borderRadius: 20 }}>
                    <Text style={{ fontSize: 25, color: "#57ADBF", marginEnd: 5, alignSelf: 'center' }}>Legs</Text>
                    <StartIcon name="play" size={35} color="#57ADBF" style={{ alignSelf: 'center' }} />

                </View>

            </ScrollView>
        </View>
    )
}

export default PastWorkoutScreen