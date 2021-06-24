import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Calendar from 'expo-calendar';
import * as Localization from 'expo-localization';
import moment from 'moment';

import CreateCalendar from "./CreateCalendar"

async function CreateEvent(title, notes) {

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
      startDate: moment(moment().format())
        .add(1, 'm')
        .toDate(),
      endDate: moment(moment().format())
        .add(5, 'm')
        .toDate(),
      timeZone: Localization.timezone,
    });

  alert(`New event iD: ${eventId}`);

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