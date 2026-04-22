import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, Button } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import * as SQLite from 'expo-sqlite';
import Exercise_Images from '../Exercise_Images';
import BiggerThanIcon from 'react-native-vector-icons/Entypo';
import SmallerThanIcon from 'react-native-vector-icons/Entypo';

const WorkoutScreen = ({ navigation, route }) => {
  const { workout_name, exercises, workout_instance_id } = route.params;
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [rest, setRest] = useState('');
  const [sets_done, setSetsDone] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [timerVisible, setTimerVisible] = useState(false); // Timer Modal Visibility
  const [counter, setCounter] = useState(0);
  const [timer, setTimer] = useState(0); // Timer for countdown
  const db = SQLite.useSQLiteContext();
  const scrollViewRef = useRef(null); // For auto-scrolling

  const handleAddSet = async () => {
    const allRows = await db.getAllAsync(`SELECT * FROM set_done WHERE workout_instance_id = '${workout_instance_id}' AND exercise_name = '${exercises[counter].exercise_name}';`);
    const set_no = allRows.length + 1;
    await db.runAsync(`INSERT INTO set_done (set_no, workout_instance_id, exercise_name, reps, weight, rest) VALUES ('${set_no}', '${workout_instance_id}', '${exercises[counter].exercise_name}', '${reps}', '${weight}','${rest}');`);
    getSetsDone();
    setSets('');
    setReps('');
    setWeight('');
    setRest('');
    setModalVisible(false); // Close modal after submission
    // Start the timer modal
    setTimer(parseInt(rest)); // Set the timer to the rest duration
    setTimerVisible(true); // Show timer modal
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const updateRest = async (rest) => {

  };

  const getSetsDone = async () => {
    const allRows = await db.getAllAsync(`SELECT * FROM set_done WHERE workout_instance_id = '${workout_instance_id}' AND exercise_name = '${exercises[counter].exercise_name}';`);
    setSetsDone(allRows);
    // console.log(allRows)
  };

  useEffect(() => {
    
    getSetsDone();
  }, [counter]);

  // Countdown Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0 && timerVisible) {
      setTimerVisible(false); // Close the timer modal when it reaches 0
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <View style={styles.container}>
      {exercises.length > 0 && exercises[counter] && (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <SmallerThanIcon name="chevron-thin-left" size={25} color="black" />
            </TouchableOpacity>

            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'navy' }}>
              {exercises[counter].exercise_name}
            </Text>

            <View style={{ width: 25 }} />
          </View>
          <Image
            source={Exercise_Images[exercises[counter].exercise_name]}
            style={{ width: '100%', height: '40%', borderRadius: 10 }}
          />
        </>
      )}

      <View style={styles.navigationButtons}>
        {counter > 0 && (
          <TouchableOpacity onPress={() => setCounter(counter - 1)} style={styles.navButton}>
            <SmallerThanIcon name="chevron-thin-left" size={25} color="white" />
          </TouchableOpacity>
        )}
        {counter < exercises.length - 1 && (
          <TouchableOpacity onPress={() => setCounter(counter + 1)} style={[styles.navButton, styles.navButtonRight]}>
            <BiggerThanIcon name="chevron-thin-right" size={25} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Set No</Text>
          <Text style={styles.tableCell}>Reps</Text>
          <Text style={styles.tableCell}>Weight</Text>
          <Text style={styles.tableCell}>Rest</Text>
        </View>
        <ScrollView ref={scrollViewRef}>
          {sets_done.length > 0 ? (
            sets_done.map((set) => (
              <View key={set.set_no} style={styles.tableRow}>
                <Text style={styles.tableCell}>{set.set_no}</Text>
                <Text style={styles.tableCell}>{set.reps}</Text>
                <Text style={styles.tableCell}>{set.weight}</Text>
                <Text style={styles.tableCell}>{set.rest}</Text>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 30 }}>No sets done yet</Text>
          )}
        </ScrollView>


        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addSetButton}>
          <Text style={styles.addSetText}>Add Set</Text>
        </TouchableOpacity>
      </View>


      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Set</Text>

            <View style={styles.inputRow}>
              <Text>Reps:</Text>
              <TextInput
                style={styles.input}
                value={reps}
                onChangeText={text => setReps(text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputRow}>
              <Text>Weight:</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={text => setWeight(text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputRow}>
              <Text>Rest:</Text>
              <TextInput
                style={styles.input}
                value={rest}
                onChangeText={text => setRest(text)}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity onPress={handleAddSet} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Add Set</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, { backgroundColor: 'grey' }]}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <Modal visible={timerVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.timerModalContent}>
            <Text style={styles.modalTitle}>Rest Time</Text>
            <Text style={styles.timerText}>{timer}s</Text>

            <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '80%' }}>
              <Button title="-10s" onPress={() => setTimer(timer - 10)} />

              <Button title="-5s" onPress={() => setTimer(timer - 5)} />

              <Button title="Skip" onPress={() => setTimerVisible(false)} />

              <Button title="+5s" onPress={() => { setTimer(timer + 5) }

              } />
              <Button title="+10s" onPress={() => setTimer(timer + 10)} />


            </View>

          </View>

        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#57ADBF',
    padding: 15,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  navButtonRight: {
    marginLeft: 'auto',
  },
  table: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    height: '40%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  tableHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
  },
  addSetButton: {
    backgroundColor: '#57ADBF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addSetText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 120,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    width: '60%',
  },
  modalButton: {
    backgroundColor: '#57ADBF',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    width: '80%',

  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  timerModalContent: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'navy',
  },
});

export default WorkoutScreen;
