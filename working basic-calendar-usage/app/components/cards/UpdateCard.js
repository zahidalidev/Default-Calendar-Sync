import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Modal, Text, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { RFPercentage } from 'react-native-responsive-fontsize';
import moment from 'moment';

// config
import Colors from '../../config/Colors';

function UpdateCard({ event, modalVisible = false, handleUpdate, handleDelete, handleCancel }) {

    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)
    const [currentDay, setCurrentDay] = useState(moment().format())
    const [alarmTime, setAlarmTime] = useState(moment().format())
    const [taskText, setTaskText] = useState('')
    const [notesText, setNotesText] = useState('')

    useEffect(() => {
        setAlarmTime(moment(event.alarmTime).format());
        setCurrentDay(moment(event.alarmTime).format());
        setTaskText(event.title)
        setNotesText(event.notes)
    }, [event])

    const handleDatePicked = date => {
        const selectedDatePicked = currentDay;
        const hour = moment(date).hour();
        const minute = moment(date).minute();
        const newModifiedDay = moment(selectedDatePicked).hour(hour).minute(minute);

        setAlarmTime(newModifiedDay)

        setIsDateTimePickerVisible(false);
    };

    return (
        <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
            onRequestClose={() => null}
        >
            <DateTimePicker
                style={{ zIndex: 200 }}
                isVisible={isDateTimePickerVisible}
                onConfirm={(date) => handleDatePicked(date)}
                onCancel={() => setIsDateTimePickerVisible(false)}
                mode="time"
            />

            <View style={styles.containerTask}>
                <View style={styles.cardMain}>
                    <View style={styles.taskContainer}>
                        <TextInput
                            style={styles.title}
                            onChangeText={text => setTaskText(text)}
                            value={taskText}
                            placeholder="Event Name"
                        />

                        <View style={styles.notesContent} />
                        <View>
                            <Text style={{ color: '#9CAAC4', fontSize: 16, fontWeight: '600', }}>
                                Description
                            </Text>
                            <TextInput style={{ height: 25, fontSize: 19, marginTop: 3, }}
                                onChangeText={text => setNotesText(text)}
                                value={notesText}
                                placeholder="Description of the event"
                            />
                        </View>
                        <View style={styles.sepeerator} />
                        <View>
                            <Text style={{ color: '#9CAAC4', fontSize: 16, fontWeight: '600', }}>
                                Times
                            </Text>
                            <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)} style={{ height: 25, marginTop: 3 }}>
                                <Text style={{ fontSize: 19 }}>
                                    {moment(alarmTime).format('h:mm A')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.sepeerator} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', }}>
                            <TouchableOpacity onPress={() => handleUpdate({
                                eventId: event.id,
                                title: taskText,
                                notes: notesText,
                                alarmTime: alarmTime
                            })}>
                                <Text style={{ fontSize: 18, textAlign: 'center', color: Colors.green, }}>
                                    UPDATE
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(event.id)}>
                                <Text style={{ fontSize: 18, textAlign: 'center', color: 'tomato', }}>
                                    DELETE
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleCancel()}>
                                <Text style={{ fontSize: 18, textAlign: 'center', color: 'orange', }}>
                                    CANCEL
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    cardMain: {
        position: 'absolute',
        top: 100,
        width: RFPercentage(40),
        borderRadius: 20,
        backgroundColor: '#ffffff',
        alignSelf: 'center',
    },
    containerTask: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sepeerator: {
        height: 0.5,
        width: '100%',
        backgroundColor: '#979797',
        alignSelf: 'center',
        marginVertical: 20,
    },
    notesContent: {
        height: 0.5,
        width: '100%',
        backgroundColor: '#979797',
        alignSelf: 'center',
        marginVertical: 20,
    },
    title: {
        marginTop: RFPercentage(2),
        height: 25,
        borderColor: '#5DD976',
        borderLeftWidth: 1,
        paddingLeft: 8,
        fontSize: 19,
    },
    taskContainer: {
        height: RFPercentage(40),
        width: RFPercentage(40),
        alignSelf: 'center',
        borderRadius: RFPercentage(1.3),
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
})

export default UpdateCard;