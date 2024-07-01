import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const animatedValues = tasks.map(() => new Animated.Value(0));

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("tasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = () => {
    if (task.trim()) {
      const newTasks = [...tasks, { id: Date.now().toString(), text: task }];
      setTasks(newTasks);
      saveTasks(newTasks);
      setTask("");
    }
  };

  const removeTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const renderTask = ({ item, index }) => (
    <Animated.View style={[styles.card, { opacity: animatedValues[index] }]}>
      <Text style={styles.cardText}>{item.text}</Text>
      <TouchableOpacity onPress={() => removeTask(item.id)}>
        <Text style={styles.tick}>✔</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  useEffect(() => {
    tasks.forEach((_, index) => {
      Animated.timing(animatedValues[index], {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });
  }, [tasks]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.logo}>✔</Text> Tickit
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Add a new task"
        value={task}
        onChangeText={setTask}
      />
      <TouchableOpacity style={styles.button} onPress={addTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#24566e",
  },
  logo: {
    color: "#c5ff05",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#c5ff05",
    padding: 10,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#c5ff05",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  list: {
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardText: {
    fontSize: 18,
    flex: 1,
  },
  tick: {
    fontSize: 18,
    color: "#c5ff05",
    padding: 10,
  },
});
