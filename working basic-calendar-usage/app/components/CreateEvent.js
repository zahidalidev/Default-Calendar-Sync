import AsyncStorage from "@react-native-async-storage/async-storage"
import moment from 'moment';
import * as Calendar from 'expo-calendar';
import * as Localization from 'expo-localization';

import CreateCalendar from "./CreateCalendar"

async function CreateEvent(title, notes, alarmTime) {

  let calanderId = await AsyncStorage.getItem("calendarId");
  calanderId = JSON.parse(calanderId);

  if (!calanderId) {
    calanderId = await CreateCalendar()
  }

  const eventId = await Calendar.createEventAsync(
    calanderId,
    {
      title,
      notes,
      startDate: moment(alarmTime)
        .add(1, 'm')
        .toDate(),
      endDate: moment(alarmTime)
        .add(5, 'm')
        .toDate(),
      timeZone: Localization.timezone,
    });

  alert(`New Event is Created`);

  const newEvent = await Calendar.getEventAsync(eventId)

  let allEvents = await AsyncStorage.getItem('Events')
  allEvents = JSON.parse(allEvents);

  // if there are old events then store new and old in async storage
  if (allEvents) {
    allEvents = [...allEvents, newEvent];
    await AsyncStorage.removeItem('Events')
    await AsyncStorage.setItem('Events', JSON.stringify(allEvents))
  } else {  //if no old events then store only new one in async storage
    allEvents = [newEvent];
    await AsyncStorage.removeItem('Events')
    await AsyncStorage.setItem('Events', JSON.stringify(allEvents))
  }
}

export default CreateEvent