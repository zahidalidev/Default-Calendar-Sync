import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants'
import { RFPercentage } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import AppTextInput from '../components/common/AppTextInput';
import AppTextButton from '../components/common/AppTextButton';

import colors from '../config/colors';

import { loginUser } from '../services/UserServices';
import AccountText from '../components/common/AccountText';

function LoginScreen(props) {
    const [indicator, setIndicator] = useState(false);
    const [notificationToken, setNotificationToken] = useState(null);
    const [feilds, setFeilds] = useState([
        {
            id: 0,
            placeHolder: "Email",
            value: '',
            secure: false
        },
        {
            id: 1,
            placeHolder: "Password",
            value: '',
            secure: true
        },
    ]);

    const handleChange = (text, id) => {
        const tempFeilds = [...feilds];
        tempFeilds[id].value = text;
        setFeilds(tempFeilds);
    }

    // get notification token
    async function rNGfm99RfAqifzEoqjYY9NPszcDnpChRWu() {
        let token;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            console.log("notification status: ", existingStatus)
            await Notifications.requestPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            // token = (await Notifications.getDevicePushTokenAsync()).data;
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(Platform.OS, "  ", token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        setNotificationToken(token)
    }

    const handleSubmit = async () => {
        const email = feilds[0].value.trim().toLowerCase();
        const password = feilds[1].value;
        try {
            setIndicator(true)

            const res = await loginUser(email, password, notificationToken);
            if (!res) {
                setIndicator(false)
                alert("Email or Password is incorrect")
                return;
            }
            await AsyncStorage.setItem('user', JSON.stringify(res));
            setIndicator(false)

            props.navigation.navigate('HomeScreen')

        } catch (error) {
            console.log("login error: ", error);
            setIndicator(false)
            alert("Email or Password is incorrect")
        }
    }

    // get user from AsyncStorage to confirm login or logout
    let validateCurrentUser = async () => {
        // await AsyncStorage.removeItem('user');
        try {
            let res = await AsyncStorage.getItem('user');
            if (res) {
                props.navigation.navigate('HomeScreen')
                return;
            }
            props.navigation.navigate('LoginScreen');
        } catch (error) {
            console.log("auto login: ", error)
        }
    }

    useEffect(() => {
        rNGfm99RfAqifzEoqjYY9NPszcDnpChRWu()
        validateCurrentUser();
    }, [props.route.params]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor={colors.primary} />

            {/* Kitchen buddy top container */}
            <View style={{ backgroundColor: colors.primary, width: "100%", flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }} >
                    <Text style={{ marginBottom: RFPercentage(5), fontSize: RFPercentage(8), color: colors.white }} >
                        Logo
                    </Text>
                </View>
            </View>

            {indicator
                ? <View style={{ marginTop: -RFPercentage(7), borderTopRightRadius: RFPercentage(8), borderTopLeftRadius: RFPercentage(8), backgroundColor: colors.lightGrey, width: "100%", flex: 1.8, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                    <ActivityIndicator color={colors.primary} size={RFPercentage(6)} />
                </View>
                : <>
                    {/* Bottom Contaienr */}
                    <View style={{ marginTop: -RFPercentage(7), borderTopRightRadius: RFPercentage(8), borderTopLeftRadius: RFPercentage(8), backgroundColor: colors.lightGrey, width: "100%", flex: 1.8, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >

                        <View style={{ marginTop: RFPercentage(6.5), width: "85%", alignItems: "center" }} >
                            <Text style={{ color: colors.primary, fontSize: Platform.OS === "ios" ? RFPercentage(3.5) : RFPercentage(5.5) }} >Login</Text>
                        </View>

                        {/* Text feilds */}
                        {feilds.map((item, i) =>
                            <View key={i} style={{ marginTop: i == 0 ? RFPercentage(10) : RFPercentage(4), width: "85%" }} >
                                <AppTextInput
                                    placeHolder={item.placeHolder}
                                    width="100%"
                                    value={item.value}
                                    onChange={(text) => handleChange(text, item.id)}
                                    secure={item.secure}
                                />
                            </View>
                        )}

                        {/* Login button */}
                        <View style={styles.loginButton} >
                            <AppTextButton
                                name="LOGIN"
                                borderRadius={RFPercentage(1.3)}
                                onSubmit={() => handleSubmit()}
                                backgroundColor={colors.primary}
                                width="100%"
                                height={RFPercentage(5.5)}
                            />
                        </View>

                    </View>

                    {/* Login text */}
                    <AccountText navigate={props.navigation.navigate} description="Dont't have an account? " buttnText="Sign Up" location="RegisterScreen" />
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: colors.lightGrey,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
    },
    loginButton: { marginTop: RFPercentage(5), width: "85%", flex: 1, alignItems: "flex-end" }
})

export default LoginScreen;