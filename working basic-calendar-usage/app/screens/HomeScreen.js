import React, { useState, useEffect } from 'react';
import { Modal, Text, View, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { RFPercentage } from 'react-native-responsive-fontsize';

// components
import EventCard from "../components/cards/EventCard"
import UpdateCard from "../components/cards/UpdateCard"
import CreateCalendar from '../components/CreateCalendar';
import GetCustomEvents from '../components/GetCustomEvents';
import GetDefaultEvents from '../components/GetDefaultEvents';
import DeleteEvent from '../components/DeleteEvent';

// config
import Colors from '../config/Colors';

function HomeScreen(props) {

    const [selectedDay, setSelectedDay] = useState({
        [`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format(
            'DD'
        )}`]: {
            selected: true,
            selectedColor: '#2E66E7',
        },
    })

    const [currentDay, setCurrentDay] = useState(`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`)
    const [modalVisible, setModalVisible] = useState(false)
    const [calendarId, setCalendarId] = useState(null)
    const [allCustomEvent, setAllCustomEvent] = useState([])
    const [allDefaultOldEvents, setAllDefaultOldEvents] = useState([])
    const [allDefaultEvents, setAllDefaultEvents] = useState([])
    const [eventsAvailableDated, setEventsAvailableDated] = useState([])
    const [updateModalVisible, setUpdateModalVisible] = useState(false)
    const [eventToUpdate, setEventToUpdate] = useState({})


    const gettingAllEvents = async () => {
        let calId = await getCalendarId();
        // const allCustomEventsTemp = await GetCustomEvents()
        let allDefaultEventsTemp = await GetDefaultEvents();

        // if (allCustomEventsTemp !== undefined) {
        //     setAllCustomEvent(allCustomEventsTemp)
        //     console.log("allCustomEventsTemp: ", allCustomEventsTemp)
        // }

        // to differentiate between public and other events in Android
        if (Platform.OS === 'android') {
            allDefaultEventsTemp = allDefaultEventsTemp.filter(event => event.accessLevel !== 'public')
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
                allDates = { ...allDates, [stDate]: { selected: true, selectedColor: Colors.green } };
                // console.log("stDate: ", allDates)

                // console.log(allDefaultEventsTemp[i].calendarId, calendarId, calId)
                if (allDefaultEventsTemp[i].calendarId == calId) {
                    allDefaultEventsTemp[i].editable = true;
                    // console.log("calendar event new: ", allDefaultEventsTemp[i])
                }
            }
            // setAllDefaultEvents(allDefaultEventsTemp)
            setAllDefaultOldEvents(allDefaultEventsTemp);
            setEventsAvailableDated(allDates);
        }
    }

    useEffect(() => {
        //updating events every two seconds
        let interval = setInterval(
            async () => {
                await gettingAllEvents()
            }, 4000);

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
        setSelectedDay({ [day.dateString]: { selected: true, selectedColor: '#2E66E7' } })
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
    const handleUpdate = () => {
        setUpdateModalVisible(false);
    }

    // delete event
    const handleDelete = async (id) => {
        setUpdateModalVisible(false);

        try {
            await DeleteEvent(id)
            await gettingAllEvents()   //updating event after deleting
            alert("Event Deleted")
        } catch (error) {
            alert("Event Deletion Error!")
        }
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

            <UpdateCard event={eventToUpdate} handleDelete={(id) => handleDelete(id)} handleUpdate={() => handleUpdate()} handleCancel={() => setUpdateModalVisible(false)} modalVisible={updateModalVisible} />
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

});

export default HomeScreen;