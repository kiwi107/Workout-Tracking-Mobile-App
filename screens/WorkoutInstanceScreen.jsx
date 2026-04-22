import { View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import CheckCircleIcon from 'react-native-vector-icons/AntDesign';
import CircleIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment/moment';
import Exercise_Images from '../Exercise_Images';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const WorkoutInstanceScreen = ({ navigation, route }) => {
    const db = SQLite.useSQLiteContext();
    const { workout_name } = route.params;
    const [exercises, setExercises] = useState([]);
    const [exerciseDoneStatus, setExerciseDoneStatus] = useState({});
    const [workout_instance_id, setWorkoutInstanceId] = useState(null);
    const [error_message, set_error_message] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
    const [in_progress, set_in_progress_workout] = useState(false);

    // Function to fetch exercises from the database
    const getWorkoutExercises = async () => {
        const allRows = await db.getAllAsync(`SELECT * FROM workout_exercise WHERE workout_name = '${workout_name}';`);
        setExercises(allRows);
    };


    const finishWorkout = async () => {
        await db.runAsync(`UPDATE workout_instance SET in_progress = false WHERE id = '${workout_instance_id}';`);
        navigation.navigate('Home');
    };


    const checkIfWorkoutInProgress = async () => {
        const allRows = await db.getAllAsync(`SELECT * from workout_instance where in_progress = true;`);
        if (allRows.length > 0) { // If there's a workout in progress
            if (workout_name === allRows[0].workout_name) { // the workout in progress is the same as the current one
                setWorkoutInstanceId(allRows[0].id)
                set_in_progress_workout(true);
            } else {
                set_error_message('You already have a workout in progress, finish it before starting a new one');
                setModalVisible(true);

            }

        }
    }

    // Function to check if an exercise is done for the current workout instance
    const checkIfExerciseDone = async (exercise_name) => {
        const allRows = await db.getAllAsync(`SELECT * FROM set_done WHERE workout_instance_id = '${workout_instance_id}' AND exercise_name = '${exercise_name}';`);
        return allRows.length > 0;
    };

    // Function to retrieve the last workout instance ID
    const getLastWorkoutInstance = async () => {
        const allRows = await db.getAllAsync(`SELECT * FROM sqlite_sequence WHERE name = 'workout_instance';`);
        const workout_instance_id = allRows[0].seq;

        setWorkoutInstanceId(workout_instance_id);
        return workout_instance_id;
    };

    // Function to create a new workout instance if none is in progress
    const createWorkoutInstance = async () => {
        const date = moment().format('DD-MM-YYYY');
        await db.runAsync(`INSERT INTO workout_instance (workout_name, date, in_progress) VALUES ('${workout_name}', '${date}', true);`);
        return await getLastWorkoutInstance();
    };

    // Check the done status for all exercises once they are loaded and the workout instance is set
    useEffect(() => {
        const checkExercisesStatus = async () => {
            if (exercises.length > 0 && workout_instance_id) {
                const status = {};
                for (const exercise of exercises) {
                    const isDone = await checkIfExerciseDone(exercise.exercise_name);
                    status[exercise.exercise_name] = isDone;
                }
                setExerciseDoneStatus(status);
            }
        };
        checkExercisesStatus();
    }, [exercises, workout_instance_id]);

    // useEffect(() => {
    //     checkIfWorkoutInProgress();
    //     getWorkoutExercises();
    // }, []);

    useFocusEffect(useCallback(() => {
        checkIfWorkoutInProgress();
        getWorkoutExercises();
    }, []));

    const startWorkout = async () => {
        const id = await createWorkoutInstance();
        navigation.navigate('Workout', { workout_name: workout_name, exercises: exercises, workout_instance_id: id });
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 30, color: "#2b2e63", padding: 10, alignSelf: 'center' }}>{workout_name}</Text>
            <ScrollView style={{ marginTop: 0, flex: 1 }}>
                {exercises.map((exercise, index) => (
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', borderRadius: 10, width: '95%', justifyContent: 'center', margin: 10 }} key={index}>
                        <Image source={Exercise_Images[exercise.exercise_name]} style={{ width: 80, height: 80, borderRadius: 10 }} />
                        <Text style={{ color: 'navy', fontSize: 18 }}>{exercise.exercise_name}</Text>

                        {exerciseDoneStatus[exercise.exercise_name] ?
                            <View style={{ marginLeft: 'auto', marginRight: 15 }}>
                                <CheckCircleIcon name="checkcircle" size={28} color="green" />
                            </View> :
                            <View style={{ marginLeft: 'auto', marginRight: 15 }}>
                                <CircleIcon name="circle-thin" size={30} color="grey" />
                            </View>

                        }
                    </View>
                ))}
            </ScrollView>
            <View style={{ position: 'relative', alignItems: 'center' }}>

                {in_progress ? <><TouchableOpacity onPress={() => navigation.navigate('Workout', { workout_instance_id: workout_instance_id, workout_name: workout_name, exercises: exercises })} style={styles.continueButton}>
                    <Text style={styles.buttonText}>Continue Workout</Text>

                </TouchableOpacity>

                    <TouchableOpacity style={styles.finishButton} onPress={finishWorkout}>
                        <Text style={styles.buttonText}>Finish Workout</Text>
                    </TouchableOpacity>
                </>
                    :

                    <TouchableOpacity onPress={startWorkout} style={styles.startButton}>
                        <Text style={styles.buttonText}>Start Workout</Text>
                    </TouchableOpacity>}
            </View>

            {/* Modal for error messages */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{error_message}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                navigation.navigate("Home")
                                setModalVisible(!modalVisible)
                            }}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default WorkoutInstanceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,

    },
    startButton: {
        borderRadius: 10,
        width: '90%',
        backgroundColor: 'navy',
        padding: 15,
        marginBottom: 20,
    },

    continueButton: {
        borderRadius: 10,
        width: '90%',
        backgroundColor: 'navy',
        padding: 15,

    },
    finishButton: {
        backgroundColor: '#FF4136',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        marginTop: 5,
        marginBottom: 20,
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        backgroundColor: 'navy',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },

});
