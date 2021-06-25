import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Dimensions, ScrollView, TextInput, StyleSheet } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import Constants from 'expo-constants';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import CreateNewEvent from "../components/CreateEvent"
import { RFPercentage } from 'react-native-responsive-fontsize';

const { width: vw } = Dimensions.get('window');

function CreateEvent(props) {

    const [selectedDay, setSelectedDay] = useState({
        [`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format(
            'DD'
        )}`]: {
            selected: true,
            selectedColor: '#2E66E7',
        },
    })

    const [taskText, setTaskText] = useState('')
    const [notesText, setNotesText] = useState('')
    const [currentDay, setCurrentDay] = useState(moment().format())
    const [alarmTime, setAlarmTime] = useState(moment().format())
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)


    const handleDatePicked = date => {
        const selectedDatePicked = currentDay;
        const hour = moment(date).hour();
        const minute = moment(date).minute();
        const newModifiedDay = moment(selectedDatePicked).hour(hour).minute(minute);

        setAlarmTime(newModifiedDay)
        setIsDateTimePickerVisible(false);
    };


    const addEventsToCalendar = async calendarId => {
        try {
            await CreateNewEvent(taskText, notesText, alarmTime)
        } catch (error) {
            console.log("Create Event Error: ", error);
        }
    };

    return (
        <>
            <DateTimePicker
                isVisible={isDateTimePickerVisible}
                onConfirm={(date) => handleDatePicked(date)}
                onCancel={() => setIsDateTimePickerVisible(false)}
                mode="time"
            />

            <View style={styles.container}>
                <View style={{ height: Dimensions.get('window').height }}>
                    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                        <View style={styles.backButton}>
                            <TouchableOpacity
                                onPress={() => alert("Home screen is not prepared yet")}
                                style={{ marginRight: vw / 2 - 120, marginLeft: 20 }}
                            >
                                <MaterialCommunityIcons name="chevron-left" size={30} />
                            </TouchableOpacity>

                            <Text style={styles.newTask}>New Event</Text>
                        </View>
                        <View style={styles.calenderContainer}>
                            <CalendarList style={{ width: 350, height: 350 }}
                                current={currentDay}
                                minDate={moment().format()}
                                horizontal
                                pastScrollRange={0}
                                pagingEnabled
                                calendarWidth={350}
                                onDayPress={day => {
                                    setSelectedDay({
                                        [day.dateString]: {
                                            selected: true,
                                            selectedColor: '#2E66E7',
                                        },
                                    })
                                    setCurrentDay(day.dateString)
                                    setAlarmTime(day.dateString)
                                }}
                                monthFormat="yyyy MMMM"
                                hideArrows
                                // markingType="period"
                                theme={{
                                    selectedDayBackgroundColor: '#40aa95',
                                    selectedDayTextColor: '#ffffff',
                                    todayTextColor: '#2E66E7',
                                    backgroundColor: '#eaeef7',
                                    calendarBackground: '#eaeef7',
                                    textDisabledColor: '#d9dbe0',
                                }}
                                markedDates={selectedDay}
                            />
                        </View>

                        {/* Task Container */}
                        <View style={styles.taskContainer}>
                            {/* add title */}
                            <TextInput
                                style={styles.title}
                                onChangeText={text => setTaskText(text)}
                                value={taskText}
                                placeholder="Event Name"
                            />

                            <View style={styles.notesContent} />
                            <View>
                                <Text style={styles.notes}>Description</Text>
                                <TextInput style={{ height: 25, fontSize: 19, marginTop: 3 }}
                                    onChangeText={text => setNotesText(text)}
                                    value={notesText}
                                    placeholder="Description of the event"
                                />
                            </View>

                            <View style={styles.seperator} />

                            {/* Add Peaople */}
                            <View>
                                <Text style={styles.notes}>People</Text>
                                <TextInput style={{ height: 25, fontSize: 19, marginTop: 3, }}
                                    onChangeText={text => setNotesText(text)}
                                    value={notesText}
                                    placeholder="Add People"
                                />
                            </View>

                            <View style={styles.seperator} />

                            {/* Add Location */}
                            <View>
                                <Text style={styles.notes}>Location</Text>
                                <TextInput style={{ height: 25, fontSize: 19, marginTop: 3 }}
                                    onChangeText={text => setNotesText(text)}
                                    value={notesText}
                                    placeholder="Add Location"
                                />
                            </View>

                            {/* add time */}
                            <View style={styles.seperator} />
                            <View>
                                <Text style={{ color: '#9CAAC4', fontSize: 16, fontWeight: '600' }}>
                                    Times
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setIsDateTimePickerVisible(true)} style={{ height: 25, marginTop: 3 }}>
                                    <Text style={{ fontSize: 19 }}>
                                        {moment(alarmTime).format('h:mm A')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Add Event button */}
                        <TouchableOpacity
                            disabled={taskText === ''}
                            style={[styles.createTaskButton, { backgroundColor: taskText === '' ? 'rgba(46, 102, 231,0.5)' : '#2E66E7' }]}
                            onPress={() => addEventsToCalendar()}
                        >
                            <Text style={{ fontSize: 18, textAlign: 'center', color: '#fff' }}>
                                ADD YOUR EVENT
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    createTaskButton: {
        width: 252,
        height: 48,
        alignSelf: 'center',
        marginTop: 40,
        borderRadius: 5,
        justifyContent: 'center',
    },
    seperator: {
        height: 0.5,
        width: '100%',
        backgroundColor: '#979797',
        alignSelf: 'center',
        marginVertical: 20,
    },
    notes: {
        color: '#9CAAC4',
        fontSize: 16,
        fontWeight: '600',
    },
    notesContent: {
        height: 0.5,
        width: '100%',
        backgroundColor: '#979797',
        alignSelf: 'center',
        marginVertical: 20,
    },
    learn: {
        height: 23,
        width: 51,
        backgroundColor: '#F8D557',
        justifyContent: 'center',
        borderRadius: 5,
    },
    design: {
        height: 23,
        width: 59,
        backgroundColor: '#62CCFB',
        justifyContent: 'center',
        borderRadius: 5,
        marginRight: 7,
    },
    readBook: {
        height: 23,
        width: 83,
        backgroundColor: '#4CD565',
        justifyContent: 'center',
        borderRadius: 5,
        marginRight: 7,
    },
    title: {
        height: 25,
        borderColor: '#5DD976',
        borderLeftWidth: 1,
        paddingLeft: 8,
        fontSize: 19,
    },
    taskContainer: {
        height: 410,
        width: 327,
        alignSelf: 'center',
        borderRadius: 20,
        shadowColor: '#2E66E7',
        backgroundColor: '#ffffff',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowRadius: 20,
        shadowOpacity: 0.2,
        elevation: 5,
        padding: 22,
    },
    calenderContainer: {
        marginTop: RFPercentage(1),
        width: 350,
        height: 350,
        alignSelf: 'center',
    },
    newTask: {
        alignSelf: 'center',
        // fontWeight: "bold",
        fontSize: 22,
        fontFamily: "sans-serif-medium",
        width: 120,
        height: 25,
        textAlign: 'center',
    },
    backButton: {
        flexDirection: 'row',
        marginTop: RFPercentage(3),
        width: '100%',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#eaeef7',
    },
});


export default CreateEvent;