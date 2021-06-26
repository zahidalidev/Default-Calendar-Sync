import React, { useState, useEffect } from 'react';
import { Modal, Text, View, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import moment from 'moment';
import Constants from 'expo-constants';
import { CalendarList } from 'react-native-calendars';
import { MaterialCommunityIcons, Icon } from "@expo/vector-icons"
import { RFPercentage } from 'react-native-responsive-fontsize';

// components
import EventCard from "../components/cards/EventCard"
import UpdateCard from "../components/cards/UpdateCard"
import CreateCalendar from '../components/CreateCalendar';
import GetDefaultEvents from '../components/GetDefaultEvents';
import DeleteEvent from '../components/DeleteEvent';

// config
import Colors from '../config/Colors';
import UpdateEvent from '../components/UpdateEvent';

function HomeScreen(props) {
    const [currentDay, setCurrentDay] = useState(`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`)
    const [modalVisible, setModalVisible] = useState(false)
    const [calendarId, setCalendarId] = useState(null)
    const [allDefaultOldEvents, setAllDefaultOldEvents] = useState([])
    const [allDefaultEvents, setAllDefaultEvents] = useState([])
    const [eventsAvailableDated, setEventsAvailableDated] = useState({ [currentDay]: { selected: true, selectedColor: '#486ae2' } })
    const [updateModalVisible, setUpdateModalVisible] = useState(false)
    const [eventToUpdate, setEventToUpdate] = useState({})


    const gettingAllEvents = async () => {

        let calId = await getCalendarId();
        let allDefaultEventsTemp = await GetDefaultEvents();

        // to differentiate between public and other events in Android
        if (Platform.OS === 'android') {
            allDefaultEventsTemp = allDefaultEventsTemp.filter(event => event.accessLevel !== 'public')  // (android) filter public holidays base on accessLevel
        } else {
            allDefaultEventsTemp = allDefaultEventsTemp.filter(event => event.creationDate)     // (ios) filter public holidays base on creationDate
        }

        let allDates = [];
        if (allDefaultEventsTemp != undefined) {
            for (let i = 0; i < allDefaultEventsTemp.length; i++) {
                let stDate = allDefaultEventsTemp[i].startDate
                let endDate = allDefaultEventsTemp[i].endDate

                allDefaultEventsTemp[i].alarmTime = stDate;
                stDate = `${moment(stDate).format('YYYY')}-${moment(stDate).format('MM')}-${moment(stDate).format('DD')}`

                allDefaultEventsTemp[i].startDate = stDate;
                allDefaultEventsTemp[i].endDate = `${moment(endDate).format('YYYY')}-${moment(endDate).format('MM')}-${moment(endDate).format('DD')}`;

                // all dates that has events

                if (allDefaultEventsTemp[i].calendarId == calId) {
                    allDates = { ...allDates, [stDate]: { selected: true, selectedColor: Colors.green } };
                    allDefaultEventsTemp[i].editable = true;
                } else {
                    allDates = { ...allDates, [stDate]: { selected: true, selectedColor: "#ef6464" } };
                }
            }
            setAllDefaultOldEvents(allDefaultEventsTemp);
            setEventsAvailableDated(allDates);
        }
    }

    useEffect(() => {
        //updating events every two seconds
        gettingAllEvents();
        let interval = setInterval(
            async () => {
                await gettingAllEvents()
            }, 100000);

        return (() => {
            clearInterval(interval)
        })
    }, []);

    // if calander id is not set then get from async storage
    const getCalendarId = async () => {
        let calenId = await CreateCalendar();
        setCalendarId(calenId);
        return calenId;
    }

    // Filtering events by dates
    const handleEvents = async (day) => {
        setModalVisible(false)
        setCurrentDay(day.dateString)

        let tempEvent = [...allDefaultOldEvents]
        tempEvent = tempEvent.filter(item => item.startDate == day.dateString);
        setAllDefaultEvents(tempEvent)
    }

    // update card
    const handleUpdateEvent = (eve) => {
        setEventToUpdate(eve)
        setUpdateModalVisible(true);
    }

    // update event
    const handleUpdate = async (eventBody) => {
        setUpdateModalVisible(false);

        try {
            await UpdateEvent(eventBody)
            await gettingAllEvents()       //Updating event after updating
            let d = await refereshCurrentDate()
            await handleEventsUpdate(d)    //Filtiring event after updating
            alert("Event Updated")
        } catch (error) {
            alert("Event Updation Error!")
        }
    }

    // delete event
    const handleDelete = async (id) => {
        setUpdateModalVisible(false);

        try {
            await DeleteEvent(id)
            await gettingAllEvents()   //Updating event after deleting
            let d = await refereshCurrentDate()
            await handleEventsUpdate(d)    //Filtiring event after deleting
            alert("Event Deleted")
        } catch (error) {
            alert("Event Deletion Error!")
        }
    }

    const refereshCurrentDate = async () => {
        const selectedDate = `${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`;
        setCurrentDay(selectedDate)
        return selectedDate;
    }

    const handleEventsUpdate = async (day) => {
        setModalVisible(false)
        setCurrentDay(day)

        let tempEvent = [...allDefaultOldEvents]
        tempEvent = tempEvent.filter(item => item.startDate == day);
        setAllDefaultEvents(tempEvent)
    }

    return (
        <View onPress={() => setModalVisible(false)} style={styles.container}>

            {/* Calendar */}
            <View style={{ marginTop: RFPercentage(5), width: "100%", justifyContent: "center", alignItems: "center" }} >
                <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.7} style={{ justifyContent: "space-between", flexDirection: "row", borderRadius: 5, width: "84%", borderColor: "grey", borderWidth: 0.5 }} >
                    <Text style={{ margin: RFPercentage(1.2), color: "grey", fontSize: RFPercentage(2.2) }} >{currentDay}</Text>
                    <MaterialCommunityIcons style={{ margin: RFPercentage(0.5) }} name="calendar-month" color={Colors.green} size={RFPercentage(3.7)} />
                </TouchableOpacity>
                <Modal transparent={true} visible={modalVisible} animationType="fade" style={{ borderRadius: 20, elevation: 20 }}>
                    <View style={styles.calenderContainer}>
                        <CalendarList style={{ marginTop: RFPercentage(10), borderRadius: 20, backgroundColor: "white", elevation: 10, width: 350, height: 350 }}
                            current={currentDay}
                            // minDate={moment().format()}
                            horizontal
                            // pastScrollRange={0}
                            pagingEnabled
                            calendarWidth={350}
                            onDayPress={day => handleEvents(day)}
                            monthFormat="yyyy MMMM"
                            hideArrows
                            // markingType="period"
                            theme={{
                                selectedDayBackgroundColor: '#40aa95',
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#2E66E7',
                                backgroundColor: 'white',
                                calendarBackground: 'white',
                                textDisabledColor: '#d9dbe0',
                            }}
                            markedDates={eventsAvailableDated}
                        />
                    </View>
                </Modal>
            </View>

            {/* events ScrollView */}
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {
                    allDefaultEvents.map((eve, index) =>
                        <EventCard key={index} onSubmit={() => eve.editable ? handleUpdateEvent(eve) : null} edit={eve.editable} title={eve.title} startDate={eve.startDate} desciption={eve.notes} />
                    )
                }
            </ScrollView>

            {/* Update Card Modal */}
            <UpdateCard event={eventToUpdate} handleDelete={(id) => handleDelete(id)} handleUpdate={(eventBody) => handleUpdate(eventBody)} handleCancel={() => setUpdateModalVisible(false)} modalVisible={updateModalVisible} />

            {/* reate event button */}
            <TouchableOpacity style={[styles.circleButton, styles.shadowEffect]} onPress={() => console.log("create task")}>
                <MaterialCommunityIcons name="plus" size={RFPercentage(4.5)} color={Colors.green} />
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'white',
        justifyContent: "flex-start",
        alignItems: "center"
    },

    calenderContainer: {
        marginTop: RFPercentage(1),
        width: 350,
        height: 350,
        alignSelf: 'center',
    },
    circleButton: {
        position: "absolute",
        bottom: RFPercentage(4),
        right: RFPercentage(4),
        borderWidth: 1,
        borderColor: Colors.green,
        alignItems: 'center',
        justifyContent: 'center',
        width: RFPercentage(9),
        height: RFPercentage(9),
        backgroundColor: '#fff',
        borderRadius: RFPercentage(5.5),
    },
    shadowEffect: {
        shadowColor: 'rgba(0 ,0 ,0 , .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android
    }
});

export default HomeScreen;