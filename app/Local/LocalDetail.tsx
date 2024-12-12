import { View, Text, ActivityIndicator, Image, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

interface ProfileData {
    address: string;
    city: string;
    description: string;
    hostingAvailability: string;
    imageUser: string;
    musicMoviesBooks: string;
    profileId: number;
    user: {
        email: string;
        fullName: string;
        id: number;
        userName: string;
        accessFailedCount: number;
        concurrencyStamp: string;
        emailConfirmed: boolean;
        lockoutEnabled: boolean;
        normalizedEmail: string;
        normalizedUserName: string;
        passwordHash: string;
        phoneNumberConfirmed: boolean;
        registrationTime: string;
        securityStamp: string;
        twoFactorEnabled: boolean;
    };
    userId: number;
    whyUseTravelMate: string;
}

interface HomeData {
    allowedSmoking: string;
    amenities: string;
    applicationUser: {
        email: string;
        fullName: string;
        id: number;
        userName: string;
        accessFailedCount: number;
        concurrencyStamp: string;
        emailConfirmed: boolean;
        lockoutEnabled: boolean;
        normalizedEmail: string;
        normalizedUserName: string;
        passwordHash: string;
        phoneNumberConfirmed: boolean;
        registrationTime: string;
        securityStamp: string;
        twoFactorEnabled: boolean;
    };
    guestPreferences: string;
    homePhotos: { $id: string; $values: any[] };
    maxGuests: number;
    overallDescription: string;
    roomDescription: string;
    roomMateInfo: string;
    roomType: string;
    transportation: string;
    userHomeId: number;
    userId: number;
}

interface ActivitiesData {
    $id: string;
    $values: {
        activityId: number;
        activityName: string;
        description: string;
    }[];
}

interface FriendsData {
    $id: string;
    $values: {
        friendId: number;
        friendName: string;
        friendEmail: string;
    }[];
}

interface LocationData {
    $id: string;
    $values: {
        locationId: number;
        locationName: string;
        latitude: number;
        longitude: number;
    }[];
}

interface EducationData {
    $id: string;
    $values: any[];
}

interface LanguagesData {
    $id: string;
    $values: any[];
}

interface TourData {
    $id: string;
    $values: any[];
}

interface CombinedData {
    profile: ProfileData;
    home: HomeData;
    activities: ActivitiesData;
    friends: FriendsData;
    location: LocationData;
    education: EducationData;
    languages: LanguagesData;
    tour: TourData;
}

const LocalDetail: React.FC = () => {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<CombinedData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = id as string; // Get the userId from route params

                // Define the API requests
                const requests = {
                    profile: () => axios.get(`https://travelmateapp.azurewebsites.net/api/Profile/${userId}`),
                    home: () => axios.get(`https://travelmateapp.azurewebsites.net/api/UserHome/user/${userId}`),
                    activities: () => axios.get(`https://travelmateapp.azurewebsites.net/api/UserActivitiesWOO/user/${userId}`),
                    friends: () => axios.get(`https://travelmateapp.azurewebsites.net/api/Friendship/List-friends/${userId}`),
                    location: () => axios.get(`https://travelmateapp.azurewebsites.net/api/UserLocationsWOO/user/${userId}`),
                    education: () => axios.get(`https://travelmateapp.azurewebsites.net/api/UserEducation/user/${userId}`),
                    languages: () => axios.get(`https://travelmateapp.azurewebsites.net/api/SpokenLanguages/user/${userId}`),
                    tour: () => axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/local`),
                };

                // Make all requests in parallel
                const response = await Promise.all(Object.values(requests).map(req => req()));

                // Combine all responses into a single object
                const combinedData: CombinedData = response.reduce((acc, res, idx) => {
                    const key = Object.keys(requests)[idx]; // Get the corresponding key for each API
                    acc[key] = res.data; // Store the response data by the API name
                    return acc;
                }, {} as CombinedData);

                setData(combinedData); // Set the combined data
                setLoading(false); // Set loading to false after data is fetched
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching data");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.title}>Profile</Text>
                <View style={styles.card}>
                    <Image source={{ uri: data?.profile.imageUser }} style={styles.profileImage} />
                    <Text><Text style={styles.bold}>Name:</Text> {data?.profile.user.fullName}</Text>
                    <Text><Text style={styles.bold}>Location:</Text> {data?.profile.city}, {data?.profile.address}</Text>
                    <Text><Text style={styles.bold}>Description:</Text> {data?.profile.description}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.title}>Home Information</Text>
                <View style={styles.card}>
                    <Text><Text style={styles.bold}>Room Description:</Text> {data?.home.roomDescription}</Text>
                    <Text><Text style={styles.bold}>Max Guests:</Text> {data?.home.maxGuests}</Text>
                    <Text><Text style={styles.bold}>Allowed Smoking:</Text> {data?.home.allowedSmoking}</Text>
                    <Text><Text style={styles.bold}>Transportation:</Text> {data?.home.transportation}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.title}>Activities</Text>
                {data?.activities.$values.map(activity => (
                    <View key={activity.activityId} style={styles.card}>
                        <Text><Text style={styles.bold}>Activity:</Text> {activity.activityName}</Text>
                        <Text>{activity.description}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.title}>Friends</Text>
                {data?.friends.$values.map(friend => (
                    <View key={friend.friendId} style={styles.card}>
                        <Text><Text style={styles.bold}>Name:</Text> {friend.friendName}</Text>
                        <Text><Text style={styles.bold}>Email:</Text> {friend.friendEmail}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default LocalDetail;
