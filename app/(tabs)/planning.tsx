import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Keyboard, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker component
import { useRouter } from 'expo-router'; // Import the router hook from Expo Router

export default function PlanTripScreen() {
    const [destination, setDestination] = useState('');
    const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
    const [days, setDays] = useState(''); // State for number of days
    const [companions, setCompanions] = useState('Gia Đình'); // State for "Đi cùng"
    const [budget, setBudget] = useState('Tiết kiệm'); // State for "Kinh phí"

    const router = useRouter();
    const locations = ['Paris', 'Papas', 'Hawaii', 'Japan', 'New York', 'London', 'Los Angeles'];

    const handleDestinationChange = (text: string) => {
        setDestination(text);
        if (text.length > 0) {
            const filtered = locations.filter((location) =>
                location.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredLocations(filtered);
        } else {
            setFilteredLocations([]);
        }
    };

    const handleSelectLocation = (location: string) => {
        setDestination(location);
        setFilteredLocations([]);
        Keyboard.dismiss();
    };

    const handleStartPlanning = () => {
        const nights = days ? (parseInt(days) - 1).toString() : ''; // Calculate nights

        if (!destination || !days || !companions || !budget) {
            alert('Vui lòng điền đầy đủ thông tin và đảm bảo rằng ngày kết thúc lớn hơn ngày bắt đầu.');
            return;
        }

        router.push({
            pathname: '../TripDetailsScreen',
            params: {
                destination,
                days,
                nights,
                companions,
                budget,
            },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Bạn muốn đi đâu?"
                        value={destination}
                        onChangeText={handleDestinationChange}
                        placeholderTextColor="#aaa"
                    />
                    {filteredLocations.length > 0 && (
                        <FlatList
                            data={filteredLocations}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectLocation(item)}>
                                    <Text style={styles.suggestionItem}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            style={styles.suggestionList}
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps="handled"
                        />
                    )}
                </View>

                {/* Input for Days */}
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Số ngày"
                        keyboardType="numeric"
                        value={days}
                        onChangeText={(text) => setDays(text)}
                        placeholderTextColor="#aaa"
                    />
                </View>

                {/* Dropdown for "Đi cùng" */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Đi cùng</Text>
                    <Picker
                        selectedValue={companions}
                        onValueChange={(itemValue) => setCompanions(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Gia đình" value="Gia đình" />
                        <Picker.Item label="Cặp đôi" value="Cặp đôi" />
                        <Picker.Item label="Bạn bè" value="Bạn bè" />
                        <Picker.Item label="Một mình" value="Một mình" />
                    </Picker>
                </View>

                {/* Dropdown for "Kinh phí" */}
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Kinh phí</Text>
                    <Picker
                        selectedValue={budget}
                        onValueChange={(itemValue) => setBudget(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Tiết kiệm" value="Tiết kiệm" />
                        <Picker.Item label="Vừa phải" value="Vừa phải" />
                        <Picker.Item label="Xa hoa" value="Xa hoa" />
                    </Picker>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleStartPlanning}>
                    <Text style={styles.buttonText}>Tạo kế hoạch</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonAI} onPress={handleStartPlanning}>
                    <Text style={styles.buttonText}>Tạo bằng AI</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 10,
    },
    formContainer: {
        marginTop: 15,
    },
    inputWrapper: {
        position: 'relative',
        marginBottom: 20,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    suggestionList: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        maxHeight: 150,
        marginTop: 5,
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    suggestionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        fontSize: 16,
        color: '#555',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonAI: {
        backgroundColor: '#3b5998',
        padding: 15,
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 8,
    },
    picker: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
});
