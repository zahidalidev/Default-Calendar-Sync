import React, { useState } from 'react';
import { Modal, Text, View, TouchableOpacity, Dimensions, ScrollView, TextInput, StyleSheet } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import Constants from 'expo-constants';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import CreateNewEvent from "../components/CreateEvent"
import { RFPercentage } from 'react-native-responsive-fontsize';


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


    return (
        <View onPress={() => setModalVisible(false)} style={styles.container}>

            {/* Calendar */}
            <View style={{ marginTop: RFPercentage(5), width: "100%", justifyContent: "center", alignItems: "center" }} >
                <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.7} style={{ justifyContent: "space-between", flexDirection: "row", borderRadius: 5, width: "84%", borderColor: "grey", borderWidth: 0.5 }} >
                    <Text style={{ margin: RFPercentage(1.2), color: "grey", fontSize: RFPercentage(2.2) }} >{currentDay}</Text>
                    <MaterialCommunityIcons style={{ margin: RFPercentage(0.5) }} name="calendar-month" color="#5caead" size={RFPercentage(3.7)} />
                </TouchableOpacity>
                <Modal transparent={true} visible={modalVisible} animationType="fade" style={{ borderRadius: 20, elevation: 20 }}>
                    <View style={styles.calenderContainer}>
                        <CalendarList style={{ marginTop: RFPercentage(10), borderRadius: 20, backgroundColor: "white", elevation: 10, width: 350, height: 350 }}
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
                                setModalVisible(false)
                                setCurrentDay(day.dateString)
                            }}
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
                            markedDates={{
                                ['2021-06-25']: {
                                    selected: true,
                                    selectedColor: '#2E66E7',
                                }, ['2021-06-26']: {
                                    selected: true,
                                    selectedColor: '#2E66E7',
                                }
                            }}
                        />
                    </View>
                </Modal>
            </View>
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