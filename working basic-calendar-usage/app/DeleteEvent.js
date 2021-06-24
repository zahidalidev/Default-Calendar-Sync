import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Calendar from 'expo-calendar';

async function DeleteEvent(eventId) {
    await Calendar.deleteEventAsync(eventId);

    // Removing from async storage
    let allEvents = await AsyncStorage.getItem('Events')
    allEvents = JSON.parse(allEvents);
    if (allEvents) {
        allEvents = allEvents.filter(item => item.id != eventId);
        await AsyncStorage.removeItem('Events')
        await AsyncStorage.setItem('Events', JSON.stringify(allEvents))
    }
}

export default DeleteEvent