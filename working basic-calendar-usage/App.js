import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, LogBox, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"

import CreateEventTask from "./app/screens/CreateEvent"

import CreateEvent from './app/components/CreateEvent';
import GetCustomEvents from './app/components/GetCustomEvents';
import DeleteEvent from './app/components/DeleteEvent';
import UpdateEvent from './app/components/UpdateEvent';
import GetDefaultEvents from './app/components/GetDefaultEvents';
import CreateCalendar from './app/components/CreateCalendar';

LogBox.ignoreAllLogs()

export default function App() {

  const [refreshing, setRefreshing] = useState(false) //refersh

  const [calendarId, setCalendarId] = useState('')
  const [allEvent, setAllEvent] = useState([])
  const [allDefaultEvents, setAllDefaultEvents] = useState([])


  async function onRefresh() {
    setRefreshing(true)
    const res = await GetCustomEvents()
    setAllEvent(res)
    setRefreshing(false)
  };

  const createNewEvent = async () => {



    // provide event title and notes to create note.
    await CreateEvent(".............................This is  jhjkhjk jbkj  title of even by zahid...................", 'notes')
  }

  const updateEvent = async () => {
    // provide event id, title and notes to update
    await UpdateEvent(allEvent[0].id, "this is updated title", "This is updated note")
  }

  const deleteEvent = async () => {
    // provide event id to delete
    await DeleteEvent(allEvent[0].id)
  }

  const getCalendarId = async () => {
    // if calander id is not set then get from async storage

    if (!calendarId) {
      let calenId = await AsyncStorage.getItem("calendarId")
      calenId = JSON.parse(calenId);
      if (!calenId) {
        calenId = await CreateCalendar()
      }
      setCalendarId(calenId)
    }
  }

  useEffect(() => {
    getCalendarId()

    //updating events every two seconds
    let interval = setInterval(async () => {
      const allCustomEvents = await GetCustomEvents()
      const allDefaultEvents = await GetDefaultEvents();

      if (allCustomEvents !== undefined) {
        setAllEvent(allCustomEvents)
      }

      if (allDefaultEvents != undefined) {
        setAllDefaultEvents(allDefaultEvents)
      }

    }, 2000);

    return (() => {
      clearInterval(interval)
    })
  }, []);


  return (
    // <View style={styles.container}>

    //   <View style={{ marginTop: 20 }} >
    //     <Button title="Create a new Event" onPress={() => createNewEvent()} />
    //   </View>

    //   <View style={{ marginTop: 20 }} >
    //     <Button title="Update Event" onPress={updateEvent} />
    //   </View>

    //   <View style={{ marginTop: 20 }} >
    //     <Button title="Get all Events" onPress={GetCustomEvents} />
    //   </View>

    //   <View style={{ marginTop: 20 }} >
    //     <Button title="Delete Events" onPress={deleteEvent} />
    //   </View>

    //   <ScrollView
    //     refreshControl={
    //       <RefreshControl
    //         refreshing={refreshing}
    //         onRefresh={() => onRefresh()}
    //       />
    //     }
    //     style={{ marginTop: 50, width: "100%", flex: 1, marginBottom: 20 }} >
    //     <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }} >
    //       <Text>All Events title</Text>
    //     </View>
    //     <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }} >
    //       {allEvent.map((item, index) =>
    //         <Text key={index} >{item.title}</Text>
    //       )}
    //     </View>
    //     {
    //       allDefaultEvents.map((item, index) =>
    //         <View key={index} style={{ marginBottom: 10, flexDirection: "row", flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }} >
    //           <Text style={{ color: calendarId == item.calendarId ? "green" : "blue" }} >Title: {item.title + item.calendarId} </Text>
    //         </View>

    //       )}

    //   </ScrollView>
    // </View>
    <CreateEventTask />
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
