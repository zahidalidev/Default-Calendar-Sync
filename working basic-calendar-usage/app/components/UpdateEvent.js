import AsyncStorage from "@react-native-async-storage/async-storage"
import moment from 'moment';
import * as Calendar from 'expo-calendar';
import * as Localization from 'expo-localization';

async function UpdateEvent(eventBody) {
  const { eventId, title, notes, alarmTime } = eventBody;

  // const defaultCalendarSource =
  //   Platform.OS === 'IOS'
  //     ? await getDefaultCalendarSource()
  //     : { isLocalAccount: true, name: 'Expo Calendar' };
  const event = {
    title,
    notes,
    startDate: moment(alarmTime)
      .add(1, 'm')
      .toDate(),
    endDate: moment(alarmTime)
      .add(5, 'm')
      .toDate(),
    timeZone: Localization.timezone,
  };

  await Calendar.updateEventAsync(
    eventId,
    event
  );

  // Updating Event in async storage
  let allEvents = await AsyncStorage.getItem('Events')
  allEvents = JSON.parse(allEvents);
  if (allEvents) {
    allEvents = allEvents.map(item => {
      if (item.id === eventId) {                       // update event id: eventId
        item.title = title;        //update title
        item.notes = notes;       //update notes 
      }
      return item;
    });
    // console.log(allEvents)
    await AsyncStorage.removeItem('Events')
    await AsyncStorage.setItem('Events', JSON.stringify(allEvents))
  }
}

export default UpdateEvent
