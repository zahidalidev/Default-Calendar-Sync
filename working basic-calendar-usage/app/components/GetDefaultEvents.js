import { Platform } from "react-native";
import * as Calendar from 'expo-calendar';


const GetDefaultEvents = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    let newIds = [];

    if (Platform.OS === 'ios') {
        // const res = await Calendar.getDefaultCalendarAsync()
        let reminderStatus = await Calendar.requestRemindersPermissionsAsync()

        if (reminderStatus.status == "granted") {
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.REMINDER)
            for (let i = 0; i < calendars.length; i++) {
                newIds.push(calendars[i].id)
            }

            const allEvents = await Calendar.getEventsAsync(newIds, "2020-11-18T21:07:29.000Z", "2023-06-18T21:07:29.000Z")
            // console.log("allEvents: ", allEvents)
            return allEvents
        }

    } else {
        if (status === 'granted') {
            let calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            for (let i = 0; i < calendars.length; i++) {
                newIds.push(calendars[i].id)
            }

            const allEvents = await Calendar.getEventsAsync(newIds, "2020-11-18T21:07:29.000Z", "2023-06-18T21:07:29.000Z")
            // console.log("allEvents: ", allEvents)
            // console.log("newIds: ", newIds)

            return allEvents
        }
    }

}

export default GetDefaultEvents;