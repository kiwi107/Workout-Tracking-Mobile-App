import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import StartIcon from 'react-native-vector-icons/Octicons';
import { ScrollView } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite';

const StartWorkoutScreen = ({ navigation }) => {
    const db = SQLite.useSQLiteContext();
    const [workouts, set_workouts] = useState([]);

    // Get past workouts from the database
    const getPastWorkouts = async () => {
        const allRows = await db.getAllAsync(`SELECT workout_name, count(exercise_name) as exercises_count FROM workout_exercise GROUP BY workout_name;`);
        set_workouts(allRows);
    }

    useEffect(() => {
        getPastWorkouts();
    }
        , []);
    return (
        <View style={{ flex: 1 }}>
            <Image source={require('../assets/mako_start.jpg')} style={{ width: '100%', height: 350, alignSelf: 'center', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }} />
            <ScrollView>
                {workouts.length > 0 ? workouts.map((workout, index) => (
                    <TouchableOpacity key={index}
                        onPress={() => navigation.navigate('WorkoutInstance', { workout_name: workout.workout_name })}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10, padding: 10, backgroundColor: 'white', height: 100, borderRadius: 20 }}>
                            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 25, color: "#57ADBF", margin: 2}}>{workout.workout_name}</Text>
                                <Text style={{ fontSize: 15, color: "grey", margin:2 }}>{workout.exercises_count} exercises</Text>
                            </View>
                            <StartIcon name="play" size={35} color="#57ADBF" style={{ alignSelf: 'center' }} />
                        </View>
                    </TouchableOpacity>

                )) : (
                    <Text style={{ alignSelf: 'center', marginTop: 50, fontSize: 15 }}>no workouts created yet</Text>
                )}

            </ScrollView>
        </View>
    )
}

export default StartWorkoutScreen