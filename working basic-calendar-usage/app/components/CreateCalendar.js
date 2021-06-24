import { Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import AsyncStorage from "@react-native-async-storage/async-storage"

async function CreateCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'IOS'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Expo Calendar' };

  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Custom Event Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });

  await AsyncStorage.setItem("calendarId", JSON.stringify(newCalendarID))
  alert(`New Calendar Id: `, newCalendarID);
  return newCalendarID;
}

export default CreateCalendar;