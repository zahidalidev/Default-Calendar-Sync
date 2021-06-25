import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import moment from 'moment';

function EventCard(props) {
    return (
        <TouchableOpacity style={styles.taskListContent}>
            <View style={{ marginLeft: 13, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "red", marginRight: 8, }} />
                    <Text style={{ color: '#554A4C', fontSize: 20, fontWeight: '700', }}>
                        Item Title
                    </Text>
                </View>
                <View><View style={{ flexDirection: 'row', marginLeft: 20, }}><Text style={{ color: '#BBBBBB', fontSize: 14, marginRight: 5, }}>
                    {`${moment().format('YYYY')}/${moment().format('MM')}/${moment().format('DD')}`}
                </Text>
                    <Text style={{ color: '#BBBBBB', fontSize: 14, }}>
                        Item notes
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