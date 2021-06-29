import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"

// config
import Colors from '../../config/colors';
import { RFPercentage } from 'react-native-responsive-fontsize';

function EventCard({ title, startDate, desciption, onSubmit, edit }) {
    return (
        <TouchableOpacity activeOpacity={edit ? 0.8 : 1} onPress={() => onSubmit()} style={styles.taskListContent}>
            <View style={{ marginLeft: 13, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: Colors.green, marginRight: 8, }} />
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
            {
                edit ? <View style={{ position: "absolute", top: RFPercentage(1), right: RFPercentage(2) }} >
                    <MaterialCommunityIcons name="square-edit-outline" color={Colors.green} size={RFPercentage(3.7)} />
                </View> : <View style={{ position: "absolute", top: RFPercentage(1), right: RFPercentage(2) }} >
                    <MaterialIcons name="edit-off" color="#fc6f6f" size={RFPercentage(3)} />
                </View>
            }
            <View
                style={{
                    height: 80,
                    width: 5,
                    backgroundColor: Colors.green,
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