import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import moment from 'moment';

function EventCard({ title, startDate, desciption, onSubmit }) {
    return (
        <TouchableOpacity onPress={() => onSubmit()} style={styles.taskListContent}>
            <View style={{ marginLeft: 13, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "red", marginRight: 8, }} />
                    <Text numberOfLines={1} style={{ width: "80%", color: '#554A4C', fontSize: 20, fontWeight: '700', }}>
                        {title}
                    </Text>
                </View>
                <View>
                    <View style={{ width: "60%", flexDirection: 'row', marginLeft: 20, }}>
                        <Text style={{ color: '#BBBBBB', fontSize: 14, marginRight: 5, }}>
                            {startDate}
                        </Text>
                        <Text numberOfLines={2} style={{ color: '#BBBBBB', fontSize: 14, }}>
                            {desciption}
                        </Text>
                    </View>
                </View>
            </View>
            <View
                style={{
                    height: 80,
                    width: 5,
                    backgroundColor: "green",
                    borderRadius: 5,
                }}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    taskListContent: {
        height: 100,
        width: 327,
        alignSelf: 'center',
        borderRadius: 10,
        shadowColor: '#2E66E7',
        backgroundColor: '#ffffff',
        marginTop: 10,
        marginBottom: 10,
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})

export default EventCard;