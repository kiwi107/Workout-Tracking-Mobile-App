import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

//for each weight take the first date

const TrackProgressScreen = () => {
  const db = SQLite.useSQLiteContext();
  const [graphData, setGraphData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const getdata = async () => {
    const exercises = await db.getAllAsync('SELECT exercise_name from set_done group by exercise_name');

    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      const allRows = await db.getAllAsync(`
        SELECT weight, MIN(date) AS earliest_date 
        FROM set_done 
        JOIN workout_instance ON set_done.workout_instance_id = workout_instance.id 
        WHERE exercise_name = '${exercise.exercise_name}' 
        GROUP BY weight 
        ORDER BY earliest_date ASC;
      `);
      console.log(exercise.exercise_name);

      setGraphData(prevGraphData => [
        ...prevGraphData,
        { exercise_name: exercise.exercise_name, data: allRows },
      ]);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  useEffect(() => {
    // Prepare the data for the chart
    const updatedChartData = graphData.map(exercise => {
      const weights = exercise.data.map(data => data.weight);
      const labels = exercise.data.map(data => 
        new Date(data.earliest_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    );
     // Format the date

      return {
        labels: labels,
        datasets: [
          {
            data: weights,
            strokeWidth: 2,
          },
        ],
        exercise_name: exercise.exercise_name,
      };
    });

    setChartData(updatedChartData);
  }, [graphData]);

  return (
    <ScrollView>
      <Text style={styles.header}>Track Progress</Text>
      {chartData.map((exercise, index) => (
        <View key={index} style={styles.chartContainer}>
          <Text style={styles.exerciseName}>{exercise.exercise_name}</Text>
          <LineChart
            data={{
              labels: exercise.labels,
              datasets: exercise.datasets,
            }}
            width={Dimensions.get('window').width - 40} // Adjust width for your design
            height={220}
            yAxisLabel=""
            yAxisSuffix=" kg"
            yAxisInterval={1} // optional
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 2, // optional, defaults to 2
              color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default TrackProgressScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 40,
  },
  chartContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
