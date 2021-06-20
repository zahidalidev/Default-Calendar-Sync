import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Calendar from 'expo-calendar';

async function UpdateEvent(eventId, title, notes) {
  // const defaultCalendarSource =
  //   Platform.OS === 'IOS'
  //     ? await getDefaultCalendarSource()
  //     : { isLocalAccount: true, name: 'Expo Calendar' };

  await Calendar.updateEventAsync(
    eventId,
    {
      title,
      notes,
    });

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

  alert(`The event is updated`);
}

export default UpdateEvent
