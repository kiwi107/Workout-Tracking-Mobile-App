import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { ClickedContext } from '../contexts/ClickedContext'; // Adjust the path as necessary

const MuscleBox = ({ name }) => {
  const muscleImages = {
    Biceps: require('../assets/Muscles_images/Biceps.png'),
    Core: require('../assets/Muscles_images/Core.png'),
    Chest: require('../assets/Muscles_images/Chest.png'),
    Triceps: require('../assets/Muscles_images/Triceps.png'),
    Back: require('../assets/Muscles_images/Back.png'),
    // Quadriceps: require('../assets/Muscles_images/Quadriceps.png'),
    Hamstrings: require('../assets/Muscles_images/Hamstrings.png'),
    Calves: require('../assets/Muscles_images/Calves.png'),
    Glutes: require('../assets/Muscles_images/Glutes.png'),
    Shoulders: require('../assets/Muscles_images/Shoulders.png'),
    Forearms: require('../assets/Muscles_images/Forearms.png'),
    Legs: require('../assets/Muscles_images/Legs.png'),
  
  };

  const { clickedMuscle, setClickedMuscle } = useContext(ClickedContext);

  const handlePress = () => {
    setClickedMuscle(name); // Set the clicked muscle name
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{}}>
      <View style={{
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderColor: clickedMuscle === name ? 'navy' : 'white',
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 50,
        width: 100,
        height:100,
        margin: 5,
      }}>
        <Image source={muscleImages[name]} style={{ width: 70, height: 70,padding:2 }} />
      </View>
      <Text style={{ fontSize: 20, alignSelf: 'center' }}>{name}</Text>
    </TouchableOpacity>
  );
};

export default MuscleBox;
