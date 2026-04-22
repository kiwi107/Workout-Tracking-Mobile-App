import React, { useState, useContext } from 'react';
import { TextInput, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ExercisesContext } from '../contexts/ExerciseContext';
import { WorkoutContext } from '../contexts/WorkoutContext';
import * as SQLite from 'expo-sqlite';
import moment from 'moment';
import { NestableScrollContainer, NestableDraggableFlatList } from "react-native-draggable-flatlist";
import ErrorIcon from 'react-native-vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ExerciseBox from '../components/ExerciseBox';

const AddWorkoutScreen = ({ navigation }) => {
    const db = SQLite.useSQLiteContext();
    const [name, setName] = useState('');
    const { add_workout_exercises, set_add_workout_exercises } = useContext(ExercisesContext);
    const { workouts, set_workouts } = useContext(WorkoutContext);
    const [name_border_color, set_name_border_color] = useState('#ccc');
    const [error_message, set_error_message] = useState('');
    const [activationDistance, setActivationDistance] = useState(100); // New state for activation distance

    const saveWorkout = async () => {
        if (!name) {
            set_name_border_color('red');
            set_error_message('Workout name cannot be empty');
            return;
        }

        const date = moment().format('YYYY-MM-DD');
        const workout = {
            name: name,
            date: date,
        };

        set_workouts([...workouts, workout]);

        const checkname = await db.getAllAsync('SELECT name FROM workout WHERE name = ?', [name]);

        if (checkname.length > 0) {
            set_error_message('Workout name already exists');
            return;
        }

        await db.runAsync(`INSERT INTO workout (name) VALUES ('${name}');`);

        for (let i = 0; i < add_workout_exercises.length; i++) {
            await db.runAsync(`INSERT INTO workout_exercise (exercise_name, workout_name) VALUES ('${add_workout_exercises[i].name}', '${name}');`);
        }

        set_add_workout_exercises([]);
        set_error_message('');
        navigation.navigate('Home');
    };

    const renderItem = ({ item, drag, isActive }) => (
        <TouchableOpacity
            onLongPress={drag} // Initiates drag when long pressed
            disabled={isActive} // Prevent other interactions while dragging
            style={{ width: '100%' }}
        >
            <ExerciseBox exercise={item} navigation={navigation} />
        </TouchableOpacity>
    );

    const keyExtractor = (item, index) => `exercise-${index}`;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        input: {
            height: 40,
            borderColor: name_border_color,
            borderWidth: 1,
            borderRadius: 5,
            margin: 10,
            width: '95%',
            padding: 10,
        },
        scrollViewContent: {

        },
     
        name: {
            fontSize: 20,
            color: 'navy',
            margin: 10,
        },
        addButton: {
            borderRadius: 10,
            width: '90%',
            backgroundColor: '#0074d9',
            padding: 15,
  
        },

        saveButton: {
            borderRadius: 10,
            width: '90%',
            backgroundColor: 'navy',
            padding: 15,
            marginTop: 5,
        },
        ButtonText: {

            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',

        },
        buttonsView: {
            alignItems: 'center',
            position: 'relative',
            bottom: 15,
            width: '100%',
            paddingTop: 15,
            
    

        },
        empty: {
            textAlign: 'center',
            marginTop: 20,
        },
        error: {
            color: 'red',
            marginVertical: 10,
            textAlign: 'center',
            marginStart: 5,
        },
    });

    return (
        <GestureHandlerRootView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Add a name for your workout"
                onChangeText={newText => setName(newText)}
            />
            {error_message && (
                <View style={{ flexDirection: 'row', marginStart: 10 }}>
                    <ErrorIcon name="exclamation-circle" size={20} color="red" style={{ alignSelf: 'center' }} />
                    <Text style={styles.error}>{error_message}</Text>
                </View>
            )}

            <Text style={styles.name}>Exercises</Text>
            <View style={{ flex: 4 }}>

                <NestableScrollContainer style={styles.scrollViewContent}>
                    {add_workout_exercises && add_workout_exercises.length > 0 ? (
                        <NestableDraggableFlatList
                            data={add_workout_exercises}
                            renderItem={renderItem}
                            keyExtractor={keyExtractor}
                            onDragBegin={({ data }) => {
                                setActivationDistance(1); // Reset activation distance after drag
                            }}
                            onDragEnd={({ data }) => {
                                // setActivationDistance(0); // Reset activation distance after drag

                                set_add_workout_exercises(data);
                                setActivationDistance(100); // Reset activation distance after drag
                            }}
                            activationDistance={activationDistance}
                            nestedScrollEnabled={true}

                        />
                    ) : (
                        <Text style={styles.empty}>No exercises added yet</Text>
                    )}
                </NestableScrollContainer>
            </View>


            <View style={styles.buttonsView}>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Muscles')}>
                    <Text style={styles.ButtonText}>Add Exercise</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
                    <Text style={styles.ButtonText}>Save Workout</Text>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
};

export default AddWorkoutScreen;
