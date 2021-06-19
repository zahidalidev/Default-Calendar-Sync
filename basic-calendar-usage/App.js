import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Platform, ScrollView, RefreshControl } from 'react-native';
import * as Calendar from 'expo-calendar';
import * as Localization from 'expo-localization';
import AsyncStorage from "@react-native-async-storage/async-storage"
import moment from 'moment';
import RNCalendarEvents from "react-native-calendar-events";

export default function App() {

  const [refreshing, setRefreshing] = useState(false) //refersh

  const [eventIds, setEventIds] = useState([])
  const [calendarIds, setCalendarIds] = useState([])
  const [allEvent, setAllEvent] = useState([])
  const [allCalendars, setAllCalendars] = useState([])
  const [androidEvents, setAndroidEvents] = useState([])
  const [iosEvents, setIosEvents] = useState([])


  async function onRefresh() {
    setRefreshing(true)
    await getCalanderAndroid()
    setRefreshing(false)
  };


  async function getCalanderAndroid() {
    try {
      let allEvents = await AsyncStorage.getItem('Events')
      allEvents = JSON.parse(allEvents);
      let allEventArray = [];

      for (let i = 0; i < allEvents.length; i++) {

        try {
          const res = await Calendar.getEventAsync(allEvents[i].id);

          if (res.title !== allEvents[i].title || res.notes !== allEvents[i].notes) {
            allEvents[i].title = res.title;
            allEvents[i].notes = res.notes;
          }

          allEventArray.push(res);

        } catch (error) {
          allEventArray.splice(i, 1)
        }
      }

      let newIds = [];
      for (let i = 0; i < allEventArray.length; i++) {
        newIds.push(allEventArray[i].id)
      }

      setEventIds(newIds)
      await AsyncStorage.removeItem('Events')
      await AsyncStorage.setItem('Events', JSON.stringify(allEventArray))
      setAllEvent(allEventArray)
      // console.log("hi: ", allEventArray)
    } catch (error) {

    }
  }

  useEffect(() => {
    let i = 0;
    let interval = setInterval(async () => {
      await getCalanderAndroid()
      // console.log(i++);
    }, 2000);


    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (Platform.OS === 'ios') {
        // const res = await Calendar.getDefaultCalendarAsync()
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.REMINDER)
        let newIds = [];
        for (let i = 0; i < calendars.length; i++) {
          newIds.push(calendars[i].id)
        }
        const tes = await Calendar.getEventsAsync(newIds, "2020-11-18T21:07:29.000Z", "2023-06-18T21:07:29.000Z")

        for (let i = 0; i < tes.length; i++) {
          if (tes[i].calendarId == calendarIds[0]) {
            console.log(tes[i])
          } else {
            console.log(tes[i].title)
          }
        }
        console.log("All Events calendarIds: ", calendarIds)

        setIosEvents(tes)

      } else {
        if (status === 'granted') {
          let calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
          console.log('Here are all your calendars:');
          let newIds = [];
          for (let i = 0; i < calendars.length; i++) {
            newIds.push(calendars[i].id)
          }
          const tes = await Calendar.getEventsAsync(newIds, "2020-07-18T21:07:29.000Z", "2023-06-27T21:07:29.000Z")
          console.log("All Events calendarIds: ", calendarIds)
          // console.log("All Events android: ", tes)
          setAndroidEvents(tes)
        }
      }
    })();

    return (() => {
      clearInterval(interval)
    })
  }, []);


  async function getDefaultCalendarSource() {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
    return defaultCalendars[0].source;
  }

  async function createCalendar() {
    const defaultCalendarSource =
      Platform.OS === 'IOS'
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar' };

    const newCalendarID = await Calendar.createCalendarAsync({
      title: 'Sunny raj joy Calendar',
      color: 'blue',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: 'internalCalendarName',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });

    alert(`Your new calendar ID is: ${newCalendarID}`);

    setCalendarIds([...calendarIds, newCalendarID])

    const eventId = await Calendar.createEventAsync(
      newCalendarID,
      {
        title: " a new task...............................................................................",
        notes: "a new task notes",
        startDate: moment(moment().format())
          .add(1, 'm')
          .toDate(),
        endDate: moment(moment().format())
          .add(5, 'm')
          .toDate(),
        timeZone: Localization.timezone,
      });

    alert(`Your new event is created` + eventId);

    const newEvent = await Calendar.getEventAsync(eventId)

    let allEvents = await AsyncStorage.getItem('Events')
    allEvents = JSON.parse(allEvents);
    if (allEvents) {
      allEvents = [...allEvents, newEvent];
      await AsyncStorage.removeItem('Events')
      await AsyncStorage.setItem('Events', JSON.stringify(allEvents))
    } else {
      allEvents = [newEvent];
      await AsyncStorage.removeItem('Events')
      await AsyncStorage.setItem('Events', JSON.stringify(allEvents))
    }

    let allEventIds = [...eventIds, eventId];
    setEventIds(allEventIds)
  }

  async function updateEvent() {
    const defaultCalendarSource =
      Platform.OS === 'IOS'
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar' };

    const updatedEventId = await Calendar.updateEventAsync(
      eventIds[0],
      {
        title: " sunnny raj joy task",
        notes: "sunny raj joy notes",
        // startDate: moment(moment().format())
        //   .add(3, 'days')
        //   .toDate(),
        // endDate: moment(moment().format())
        //   .add(4, 'days')
        //   .toDate(),
        // timeZone: Localization.timezone,
      });


    // async storage
    let allEvents = await AsyncStorage.getItem('Events')
    allEvents = JSON.parse(allEvents);
    if (allEvents) {
      allEvents = allEvents.map(item => {
        if (item.id === eventIds[0]) {                       // update event id: eventIds[0]
          item.title = " sunnny raj joy task"         //update title
          item.notes = " sunnny raj joy notes"        //update notes 
        }
        return item;
      });
      // console.log(allEvents)
      await AsyncStorage.removeItem('Events')
      await AsyncStorage.setItem('Events', JSON.stringify(allEvents))
    }


    alert(`The event is updated`);
  }

  async function deleteEvent() {
    const defaultCalendarSource =
      Platform.OS === 'IOS'
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar' };

    await Calendar.deleteEventAsync(eventIds[0]);
    console.log(eventIds[0])
    // from async storage as well

    let allEvents = await AsyncStorage.getItem('Events')
    allEvents = JSON.parse(allEvents);
    if (allEvents) {
      allEvents = allEvents.filter(item => item.id != eventIds[0]);
      await AsyncStorage.removeItem('Events')
      await AsyncStorage.setItem('Events', JSON.stringify(allEvents))
    }
  }

  async function getEvents() {
    const defaultCalendarSource =
      Platform.OS === 'IOS'
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar' };

    const events = await Calendar.getEventsAsync(
      calendarIds,
      moment(moment().format())
        .add(3, 'days')
        .toDate(),
      moment(moment().format())
        .add(4, 'days')
        .toDate());

    console.log(`All the events getEvent `);
    console.log(events)
  }
  return (
    <View style={styles.container}>
      <Text>Calendar Module Example</Text>

      <View style={{ marginTop: 20 }} >
        <Button title="Create a new calendar" onPress={createCalendar} />
      </View>

      <View style={{ marginTop: 20 }} >
        <Button title="Update Event" onPress={updateEvent} />
      </View>
      {/* <View style={{ marginTop: 20 }} >
        <Button title="Get all Events" onPress={getEvents} />
      </View> */}
      <View style={{ marginTop: 20 }} >
        <Button title="Get all Events" onPress={getCalanderAndroid} />
      </View>
      <View style={{ marginTop: 20 }} >
        <Button title="Delete Events" onPress={deleteEvent} />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
        }
        style={{ marginTop: 50, width: "100%", flex: 1, marginBottom: 20 }} >
        <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }} >
          <Text>All Events title</Text>
        </View>
        {Platform.OS === "android" ?
          androidEvents.map((item, index) =>
            <View key={index} style={{ marginBottom: 10, flexDirection: "row", flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }} >
              <Text style={{ color: calendarIds[0] == item.calendarId ? "green" : "blue" }} >Title: {item.title + index} </Text>
              <Text style={{ color: calendarIds[0] == item.calendarId ? "green" : "red" }} >Date:  {item.calendarId}</Text>
            </View>

          )
          :
          iosEvents.map((item, index) =>
            <View key={index} style={{ marginBottom: 10, flexDirection: "row", flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }} >
              <Text style={{ color: calendarIds[0] == item.calendarId ? "green" : "blue" }} >Title: {item.title + index} </Text>
              <Text style={{ color: calendarIds[0] == item.calendarId ? "green" : "red" }} ></Text>
            </View>

          )
        }
      </ScrollView>
    </View>
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
