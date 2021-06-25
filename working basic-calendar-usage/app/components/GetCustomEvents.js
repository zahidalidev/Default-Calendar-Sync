import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Calendar from 'expo-calendar';

async function GetCustomEvents() {
    try {
        let allEvents = await AsyncStorage.getItem('Events')
        allEvents = JSON.parse(allEvents);
        let allEventArray = [];

        // updating the event in async storage by comparing them with app calander
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

        // console.log("allEventArray: ", newIds)

        await AsyncStorage.removeItem('Events')
        await AsyncStorage.setItem('Events', JSON.stringify(allEventArray))
        return allEventArray;
    } catch (error) {
        // console.log("get events Error: ", error)
    }
}

export default GetCustomEvents;