import { useEffect, useState, createContext } from 'react';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import MusclesScreen from './screens/MusclesScreen';
import AddWorkoutScreen from './screens/AddWorkoutScreen';
import Intro from './screens/Intro';
import StartWorkoutScreen from './screens/StartWorkoutScreen';
import PastWorkoutScreen from './screens/PastWorkoutsScreen';
import WorkoutInstanceScreen from './screens/WorkoutInstanceScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import TrackProgressScreen from './screens/TrackProgressScreen';

import { GestureHandlerRootView } from 'react-native-gesture-handler';


import { ExercisesContext } from './contexts/ExerciseContext';
import { WorkoutContext } from './contexts/WorkoutContext';




const Stack = createNativeStackNavigator();




export default function App() {
  const [add_workout_exercises, set_add_workout_exercises] = useState([]);
  const [workouts, set_workouts] = useState([]);


  return (

    <NavigationContainer>
      <SQLiteProvider databaseName="kiwifitDB" assetSource={{ assetId: require('./assets/kiwifit.db') }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <WorkoutContext.Provider value={{ workouts, set_workouts }}>
            <ExercisesContext.Provider value={{ add_workout_exercises, set_add_workout_exercises }}>
              <Stack.Navigator initialRouteName="Intro">
                <Stack.Screen
                  name="Intro"
                  component={Intro}
                  options={{ title: 'KiwiFit', headerShown: false }}
                />

                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ title: 'KiwiFit', headerShown: false }}
                />
 

                <Stack.Screen
                  name="Muscles"
                  component={MusclesScreen}
                  options={{ title: 'Add Exercises' }}
                />
                <Stack.Screen
                  name="AddWorkout"
                  component={AddWorkoutScreen}
                  options={{ title: 'Add Workout' }}
                />

                <Stack.Screen
                  name="StartWorkout"
                  component={StartWorkoutScreen}
                  options={{ title: 'Start Workout', headerShown: false }}
                />
                <Stack.Screen
                  name="PastWorkouts"
                  component={PastWorkoutScreen}
                  options={{ title: 'Past Workouts', headerShown: false }}
                />

                <Stack.Screen
                  name="WorkoutInstance"
                  component={WorkoutInstanceScreen}
                  options={{ title: 'Workout Plan', headerShown: false }}
                />
                <Stack.Screen
                  name="Workout"
                  component={WorkoutScreen}
                  options={{ title: 'Workout', headerShown: false }}
                />
                <Stack.Screen
                  name="TrackProgress"
                  component={TrackProgressScreen}
                  options={{ title: 'Track Progress', headerShown: false }}
                />


              </Stack.Navigator>
            </ExercisesContext.Provider>
          </WorkoutContext.Provider>
        </GestureHandlerRootView>
      </SQLiteProvider>
    </NavigationContainer>

  );
}

