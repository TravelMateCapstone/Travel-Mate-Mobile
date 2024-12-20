import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';


const Login = () => {
    const router = useRouter();

    return (
        <View>
            <View>
                <Image
                    source={require('../assets/images/backgroundImage.png')}
                    style={styles.image}
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>TravelMate</Text>
                <Text style={styles.paragaph}>Khám phá Việt Nam qua góc nhìn người địa phương. Trải nghiệm chân thật, kỷ niệm đáng nhớ!
                </Text>
                <View style={styles.containerButton}>
                    <TouchableOpacity onPress={() => router.push('auth/login')}
                        style={styles.buttonAction}>
                        <Text style={styles.buttonText}>Đăng nhập</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonAction} onPress={() => router.push('auth/register')}
                    >
                        <Text style={styles.buttonText}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: '100%',
        marginTop: -20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25
    },
    image: {
        width: '100%',
        height: 520,
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginTop: 10
    },
    paragaph: {
        fontSize: 17,
        textAlign: 'center',
        color: Colors.gray,
        marginTop: 20
    },
    containerButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20
    },
    buttonAction: {
        backgroundColor: Colors.dark.background,
        padding: 15,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: Colors.light.background,
        fontSize: 17,
        fontWeight: 'bold'
    }
});

export default Login;