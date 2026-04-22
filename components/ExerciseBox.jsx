import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useRef } from 'react'
import { useRoute } from '@react-navigation/native';
import PlusIcon from 'react-native-vector-icons/AntDesign';
import BarsIcon from 'react-native-vector-icons/FontAwesome';
import { useContext } from 'react';
import { ExercisesContext } from '../contexts/ExerciseContext';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import Exercise_Images from '../Exercise_Images';

const ExerciseBox = ({ exercise, navigation }) => {
    const { add_workout_exercises, set_add_workout_exercises } = useContext(ExercisesContext);



    const route = useRoute();

    // Ref for the Swipeable component
    const swipeableRef = useRef(null);

    const add_exercise = () => {
        set_add_workout_exercises([...add_workout_exercises, exercise]);
        navigation.navigate('AddWorkout');
    }

    // Function to handle deletion of exercises
    const handleDelete = () => {
        // Filter out the deleted exercise
        const exerciseName = exercise.name;
        const updatedExercises = add_workout_exercises.filter((exercise) => exercise.name !== exerciseName);
        set_add_workout_exercises(updatedExercises);

        // Close the swipeable after deletion
        if (swipeableRef.current) {
            swipeableRef.current.close();
        }
    };

    const renderRightActions = (progress, dragX) => {
        return (
            <View style={styles.rightAction}>
                <TouchableOpacity style={styles.deleteButton} onPressOut={() => handleDelete()}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.button}>
            {route.name === 'Muscles' && (
                <TouchableOpacity onPress={() => add_exercise()} style={styles.button}>
                    <Image source={Exercise_Images[exercise.name]} style={styles.image}  />
                    <Text style={styles.buttonText}>{exercise.name}</Text>
                    <View style={{ position: 'absolute', right: 20, paddingLeft: 50 }}>
                    <PlusIcon name="plus" size={30} color="navy"  />
                    </View>
                </TouchableOpacity>
            )}

            {route.name === 'AddWorkout' && (
                <GestureHandlerRootView>
                    <Swipeable
                        ref={swipeableRef} // Attach the ref to the Swipeable component
                        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX)}
                        rightOpenValue={-120} // Increased to make the swipe more complete
                    >
                        <View style={styles.button}>
                            <Image source={Exercise_Images[exercise.name]} style={styles.image} />
                            <Text style={styles.buttonText}>{exercise.name}</Text>
                            <BarsIcon name="bars" size={30} color="grey" style={{ position: 'absolute', right: 20}} />
                        </View>
                    </Swipeable>
                </GestureHandlerRootView>
            )}
        </View>
    );
}

export default ExerciseBox

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '95%',
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    buttonText: {
        color: 'navy',
        fontSize: 18,
        flexShrink: 1,
        flexWrap: 'wrap',
        width: 180,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 10,
        margin: 5,
    },

    rightAction: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100, // Adjusted width for the swipe action
        marginVertical: 10, // To match the margin of each row
        height: 100,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,

    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        padding: 20,
    },
});
