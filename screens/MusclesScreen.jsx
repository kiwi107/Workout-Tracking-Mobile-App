import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Button } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import MuscleBox from '../components/MuscleBox';
import { ClickedContext } from '../contexts/ClickedContext';
import ExerciseBox from '../components/ExerciseBox';
import { useVideoPlayer, VideoView } from 'expo-video'; // Import video player components
import * as SQLite from 'expo-sqlite';

const videoSource = require('../assets/loading.mp4');

const MusclesScreen = ({ navigation }) => {
  const db = SQLite.useSQLiteContext();
  const [clickedMuscle, setClickedMuscle] = useState('All');
  const [exercise, setExercise] = useState(null);

;


  useEffect(() => {
    const getExercises = async () => {
  
      if (clickedMuscle === 'All') {
        const allRows = await db.getAllAsync(`SELECT * FROM exercise order by name asc;`);
        setExercise(allRows);
      } else {
        const allRows = await db.getAllAsync(`SELECT * FROM exercise WHERE muscle_group = '${clickedMuscle}';`);
        setExercise(allRows);
      }

    };
    getExercises();
  }, [clickedMuscle]);

  return (
    <ClickedContext.Provider value={{ clickedMuscle, setClickedMuscle }}>

          <ScrollView horizontal={true} style={{ height: 170 }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                backgroundColor: 'white',
                borderColor: clickedMuscle === 'All' ? 'navy' : 'white',
                borderStyle: 'solid',
                borderWidth: 2,
                padding: 10,
                borderRadius: 50,
                width: 100,
                height: 100,
                margin: 5,
              }}
              onPress={() => {
                setClickedMuscle('All');
              }}
            >
              <Text style={{ flexDirection: 'row', fontSize: 20, color: '#2b2e63', textAlign: 'center' }}>All</Text>
              <Text style={{ flexDirection: 'row', fontSize: 20, color: '#2b2e63', textAlign: 'center' }}>Muscles</Text>
            </TouchableOpacity>
            <MuscleBox name="Biceps" />
            <MuscleBox name="Chest" />
            <MuscleBox name="Triceps" />
            <MuscleBox name="Back" />
            <MuscleBox name="Legs" />
            <MuscleBox name="Shoulders" />
            <MuscleBox name="Forearms" />
            <MuscleBox name="Core" />
          </ScrollView>

          <ScrollView>
            {exercise &&
              exercise.map((exercise, index) => (
                <ExerciseBox key={index} exercise={exercise} navigation={navigation} />
              ))}
          </ScrollView>
  
      
    </ClickedContext.Provider>
  );
};

export default MusclesScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
});
