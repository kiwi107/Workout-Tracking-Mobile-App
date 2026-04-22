import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProgressIcon from 'react-native-vector-icons/AntDesign';
import StartIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PastIcon from 'react-native-vector-icons/MaterialIcons';
import { WorkoutContext } from '../contexts/WorkoutContext';
import * as SQLite from 'expo-sqlite';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import ProfileIcon from 'react-native-vector-icons/FontAwesome';
import SettingsIcon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({ navigation }) => {
    const db = SQLite.useSQLiteContext();
    // db.closeAsync();
    // SQLite.deleteDatabaseAsync('kiwifit');
    const { workouts, set_workouts } = useContext(WorkoutContext);
    const [in_progress_workout, set_in_progress_workout] = useState(null);

    // Get past workouts from the database
    const getPastWorkouts = async () => {
        const allRows = await db.getAllAsync(`SELECT * from workout_instance where in_progress = true;`);
        //delete all  
        // await db.runAsync(`DELETE FROM workout_instance;`);
        // await db.runAsync(`DELETE FROM set_done;`);
        // await db.runAsync(`DELETE FROM workout_exercise;`);
        if (allRows.length > 0) {
            set_in_progress_workout(allRows[0]);
        } else {
            set_in_progress_workout(null);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getPastWorkouts();
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', marginTop: 30, marginStart: 10, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 30, color: "#2b2e63", padding: 10 }}>KiwiFit</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <ProfileIcon name="user-circle" size={35} color="#2b2e63" style={{ alignSelf: 'center', padding: 10 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <SettingsIcon name="cog" size={35} color="#2b2e63" style={{ alignSelf: 'center', padding: 10 }} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView >
                <Image source={require('../assets/mako_homepage.png')} style={{ width: 360, height: 200, alignSelf: 'center' }} />
                <View style={[{ backgroundColor: '#2b2e63', borderRadius: 30, margin: 10, padding: 5 }, styles.shadow]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('StartWorkout')}>
                            <LinearGradient
                                colors={['#57ADBF', '#3D9DA7']}
                                style={styles.gradientBox}
                            >
                                <View style={{ flexDirection: 'row' }}>

                                    <StartIcon name="weight-lifter" size={35} color="white" style={{ alignSelf: 'center' }} />
                                </View>


                            </LinearGradient>
                            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                <Text style={styles.textUnderBox}>Start</Text>
                                <Text style={styles.textUnderBox}>Workout</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('AddWorkout')}>
                            <LinearGradient
                                colors={['#CED1da', '#A0A3AC']}
                                style={styles.gradientBox}
                            >
                                <View style={{ flexDirection: 'row' }}>

                                    <Icon name="add-circle-outline" size={35} color="white" style={{ alignSelf: 'center' }} />
                                </View>
                            </LinearGradient>
                            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                <Text style={styles.textUnderBox}>Add</Text>
                                <Text style={styles.textUnderBox}>Workout</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('PastWorkouts')}>
                            <LinearGradient
                                colors={['#798DC5', '#5E72AA']}
                                style={styles.gradientBox}
                            >
                                <PastIcon name="storage" size={35} color="white" style={{ alignSelf: 'center' }} />
                            </LinearGradient>
                            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                <Text style={styles.textUnderBox}>Past</Text>
                                <Text style={styles.textUnderBox}>Workouts</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('TrackProgress')}>
                            <LinearGradient
                                colors={['#00b4d8', '#0097c9']}
                                style={styles.gradientBox}
                            >
                                <View style={{ flexDirection: 'row' }}>

                                    <ProgressIcon name="linechart" size={35} color="white" style={{ alignSelf: 'center' }} />
                                </View>

                            </LinearGradient>
                            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                <Text style={styles.textUnderBox}>Track</Text>
                                <Text style={styles.textUnderBox}>Progress</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text style={{ fontSize: 20, color: "#2b2e63", paddingTop: 20, paddingLeft: 20 }}>Today's Activity</Text>
                </View>
                {/* steps, calories, distance, flights climbed */}
                <View style={[{ backgroundColor: '#57ADBF', margin: 10, borderRadius: 30 }, styles.shadow]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, margin: 10 }}>
                        <View style={{ padding: 5, width: 150 }}>
                            <Text style={{ fontSize: 20, color: "white", alignSelf: 'center', fontWeight: 'bold' }}>Steps</Text>
                            <Text style={{ fontSize: 15, color: "white", alignSelf: 'center' }}>500</Text>
                        </View>
                        <View style={{ padding: 5, width: 150 }}>
                            <Text style={{ fontSize: 20, color: "white", alignSelf: 'center', fontWeight: 'bold' }}>Calories</Text>
                            <Text style={{ fontSize: 15, color: "white", alignSelf: 'center' }}>200</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, margin: 10 }}>
                        <View style={{ width: 150 }}>
                            <Text style={{ fontSize: 20, color: "white", alignSelf: 'center', fontWeight: 'bold' }}>Distance</Text>
                            <Text style={{ fontSize: 15, color: "white", alignSelf: 'center' }}>2 km</Text>
                        </View>
                        <View style={{ width: 150 }}>
                            <Text style={{ fontSize: 20, color: "white", alignSelf: 'center', fontWeight: 'bold' }}>Flights Climbed</Text>
                            <Text style={{ fontSize: 15, color: "white", alignSelf: 'center' }}>5</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {in_progress_workout && <TouchableOpacity style={[{ backgroundColor: '#2b2e63', borderTopStartRadius: 40, borderTopEndRadius: 40 }, styles.shadow]} onPress={() => navigation.navigate('WorkoutInstance', { workout_name: in_progress_workout.workout_name })}>
                <Text style={{ fontSize: 20, color: "white", padding: 30 }}>In Progress: {in_progress_workout.workout_name}</Text>
            </TouchableOpacity>}
        </View >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientBox: {
        borderRadius: 10,
        height: 60,
        width: 60,
        margin: 10,
        padding: 10,
        justifyContent: 'center', // horizontal alignment
        alignItems: 'center', // vertical alignment

    },
    textUnderBox: { fontSize: 15, color: "white", alignSelf: 'center' },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    }
});

export default HomeScreen;
