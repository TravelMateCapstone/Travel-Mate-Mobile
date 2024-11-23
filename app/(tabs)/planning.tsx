import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Keyboard, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function PlanTripScreen() {
    const [destination, setDestination] = useState('');
    const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
    const [days, setDays] = useState('');
    const [companions, setCompanions] = useState('Gia Đình');
    const [budget, setBudget] = useState('Tiết kiệm');
    const [locations, setLocations] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/')
            .then(response => response.json())
            .then(data => {
                const locationNames = data.map((location: any) => location.name);
                setLocations(locationNames);
            })
            .catch(error => console.error('Error fetching locations:', error));
    }, []);

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
        const nights = days ? (parseInt(days) - 1).toString() : '';

        if (!destination || !days || !companions || !budget) {
            alert('Vui lòng điền đầy đủ thông tin.');
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
            <View style={styles.card}>
                {/* Input for Destination */}
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Bạn muốn đi đâu?"
                        value={destination}
                        onChangeText={handleDestinationChange}
                        placeholderTextColor="#bbb"
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
                        placeholderTextColor="#bbb"
                    />
                </View>

                {/* Dropdown for Companions */}
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

                {/* Dropdown for Budget */}
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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eef2f3',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    suggestionList: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        maxHeight: 150,
        marginTop: 5,
        backgroundColor: '#fff',
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        fontSize: 16,
        color: '#555',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 5,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
