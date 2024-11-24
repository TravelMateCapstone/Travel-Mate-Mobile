import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';



const apiKey = 'AIzaSyAIOvxOaXgZDntnkNVTuIIpyew3bpfE4qE';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

function TripDetailsScreen() {
  const { destination, days, nights, companions, budget } = useLocalSearchParams();
  const currentDate = new Date();

  const headerImages = [
    'https://citc.edu.vn/wp-content/uploads/2020/03/dai-hoc-nganh-du-lich.png',
    'https://bizflyportal.mediacdn.vn/bizflyportal/1263/307/2021/03/13/00/01/pha16155468749150.jpg',
    'https://duhoctrungquocriba.com/wp-content/uploads/2020/12/Quan-tri-du-lich-khach-san-nganh-hoc-khong-bao-gio-loi-thoi-1-1024x683-1.png',
  ];

  const randomHeaderImage = headerImages[Math.floor(Math.random() * headerImages.length)];


  interface TravelPlan {
    location: string;
    duration: string;
    budget: string;
    travelers: string;
    flights: {
      airline: string;
      flightNumber: string;
      departureCity: string;
      arrivalCity: string;
      departureDate: string;
      departureTime: string;
      arrivalDate: string;
      arrivalTime: string;
      price: string;
      bookingUrl: string;
    }[];
    hotel: {
      hotelName: string;
      hotelAddress: string;
      price: string;
      hotelImageUri: string;
      geoCoordinates: {
        latitude: number;
        longitude: number;
      };
      rating: number;
      description: string;
      nearbyPlaces: {
        placeName: string;
        placeDetails: string;
        placeImageURL: string;
        geoCoordinates: {
          latitude: number;
          longitude: number;
        };
        ticketPrice: string;
        travelTime: string;
      }[];
    }[];
    itinerary: {
      day: string;
      plan: {
        time: string;
        activity: string;
        details: string;
      }[];
      bestTime: string;
    }[];
  }

  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [routes] = useState([
    { key: 'flights', title: 'Chuyến bay' },
    { key: 'hotels', title: 'Khách sạn' },
    { key: 'itinerary', title: 'Lịch trình' },
  ]);

  const generateTravelPlan = async () => {
    setLoading(true);
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              { text: "key ought to use English and value ought use Vietnamese.Use Vietnamese Create a Travel Plan for Location: Ha Noi Viet Nam, for 3 Days 2 Nights for Family on Luxury Budget with Flight Details, Flight Price with Booking URL, Hotel options list with HotelName, Hotel Address, Price, hotel image uri, geo coordinates, rating, description and Nearby Places to Visit with placeName, Place Details, Place Image URL, Geo Coordinates, Ticket Price, Travel Time per location for 3 days 3 nights with plan for each day with best time to visit in JSON format \n" },
            ],
          },
          {
            role: "model",
            parts: [
              { text: "```json\n{\"trip\": {\"location\": \"Hà Nội, Việt Nam\", \"duration\": \"3 ngày 2 đêm\", \"budget\": \"Luxury\", \"travelers\": \"Gia đình\", \"bestTimetoVisit\": \"Tháng 10 - Tháng 4 (mùa thu đông)\", \"flights\": [{\"airline\": \"Vietnam Airlines\", \"flightNumber\": \"VN123\", \"departure\": \"Sân bay quốc tế Tân Sơn Nhất (SGN)\", \"arrival\": \"Sân bay quốc tế Nội Bài (HAN)\", \"departureTime\": \"07:00\", \"arrivalTime\": \"08:30\", \"price\": \"5.000.000 VND\", \"bookingURL\": \"https://www.vietnamairlines.com/vn/en\"}], \"hotels\": [{\"hotelName\": \"Sofitel Legend Metropole Hanoi\", \"address\": \"15 Ngô Quyền, Hàng Bồ, Hoàn Kiếm, Hà Nội, Việt Nam\", \"price\": \"10.000.000 VND/đêm\", \"imageURI\": \"https://example.com/sofitel.jpg\", \"geoCoordinates\": {\"latitude\": \"21.0278° N\", \"longitude\": \"105.8533° E\"}, \"rating\": \"4.8\", \"description\": \"Khách sạn 5 sao sang trọng, nằm ở vị trí trung tâm thành phố.\", \"nearbyPlaces\": [{\"placeName\": \"Hồ Hoàn Kiếm\", \"placeDetails\": \"Hồ nước ngọt nằm ở trung tâm Hà Nội\", \"placeImageURL\": \"https://example.com/hoankiem.jpg\", \"geoCoordinates\": {\"latitude\": \"21.0278° N\", \"longitude\": \"105.8533° E\"}, \"ticketPrice\": \"Miễn phí\", \"travelTime\": \"10 phút\"}, {\"placeName\": \"Nhà hát lớn Hà Nội\", \"placeDetails\": \"Nhà hát được xây dựng từ thời Pháp thuộc\", \"placeImageURL\": \"https://example.com/nhahatlon.jpg\", \"geoCoordinates\": {\"latitude\": \"21.0278° N\", \"longitude\": \"105.8533° E\"}, \"ticketPrice\": \"50.000 VND\", \"travelTime\": \"15 phút\"}]}, {\"hotelName\": \"Four Seasons Hotel Hanoi\", \"address\": \"101 Bà Triệu, Tràng Tiền, Hoàn Kiếm, Hà Nội, Việt Nam\", \"price\": \"12.000.000 VND/đêm\", \"imageURI\": \"https://example.com/fourseasons.jpg\", \"geoCoordinates\": {\"latitude\": \"21.0278° N\", \"longitude\": \"105.8533° E\"}, \"rating\": \"4.9\", \"description\": \"Khách sạn 5 sao sang trọng, dịch vụ đẳng cấp.\", \"nearbyPlaces\": [{\"placeName\": \"Chợ Đồng Xuân\", \"placeDetails\": \"Chợ truyền thống lớn nhất Hà Nội\", \"placeImageURL\": \"https://example.com/chodongxuan.jpg\", \"geoCoordinates\": {\"latitude\": \"21.0278° N\", \"longitude\": \"105.8533° E\"}, \"ticketPrice\": \"Miễn phí\", \"travelTime\": \"20 phút\"}, {\"placeName\": \"Lăng Chủ tịch Hồ Chí Minh\", \"placeDetails\": \"Nơi an nghỉ của Chủ tịch Hồ Chí Minh\", \"placeImageURL\": \"https://example.com/langbac.jpg\", \"geoCoordinates\": {\"latitude\": \"21.0278° N\", \"longitude\": \"105.8533° E\"}, \"ticketPrice\": \"Miễn phí\", \"travelTime\": \"30 phút\"}]}], \"dailyPlan\": [{\"day\": \"Ngày 1\", \"activities\": [{\"time\": \"Sáng\", \"activity\": \"Ăn sáng tại khách sạn, làm thủ tục nhận phòng\"}, {\"time\": \"Chiều\", \"activity\": \"Tham quan Hồ Hoàn Kiếm, đền Ngọc Sơn\"}, {\"time\": \"Tối\", \"activity\": \"Ăn tối tại nhà hàng, thưởng thức biểu diễn nghệ thuật truyền thống\"}]}, {\"day\": \"Ngày 2\", \"activities\": [{\"time\": \"Sáng\", \"activity\": \"Tham quan Văn Miếu Quốc Tử Giám\"}, {\"time\": \"Chiều\", \"activity\": \"Mua sắm tại phố cổ Hà Nội\"}, {\"time\": \"Tối\", \"activity\": \"Thưởng thức ẩm thực đường phố Hà Nội\"}]}, {\"day\": \"Ngày 3\", \"activities\": [{\"time\": \"Sáng\", \"activity\": \"Tham quan Lăng Bác, Bảo tàng Hồ Chí Minh\"}, {\"time\": \"Chiều\", \"activity\": \"Làm thủ tục trả phòng, khởi hành về\"}]}]}}\n```" },
            ],
          },
        ],
      });
      const result = await chatSession.sendMessage(`key ought to use English and value ought to use Vietnamese. Use Vietnamese to create a travel plan for Location: ${destination}, for ${days} Days ${nights} Nights for ${companions} on ${budget} budget with Flight Details, Flight Price with Booking URL, Hotel options list with HotelName, Hotel Address, Price, hotel image uri, geo coordinates, rating, description and Nearby Places to Visit with placeName, Place Details, Place Image URL, Geo Coordinates, Ticket Price, Travel Time per location for ${days} days ${nights} nights with plan for each day with best time to visit in JSON format.`);
      try {
        const travelData = JSON.parse(await result.response.text());

        setTravelPlan(travelData.trip);
        console.log("Travel Plan:", travelData.trip);
        
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError, result.response.text());
      }


    } catch (error) {
      console.error("Error generating travel plan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateTravelPlan();
  }, []);

  const handleSaveButtonPress = () => {
    // Implement your save functionality here
    console.log("Save button pressed");
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!travelPlan) {
    return <Text>No travel plan available.</Text>;
  }

  const renderFlights = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Chuyến bay</Text>
      {travelPlan.flights.map((flight, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text>Hãng: {flight.airline}</Text>
          <Text>Flight: {flight.flightNumber}</Text>
          <Text>Departure: {flight.departure} at {flight.departureTime}</Text>
          <Text>Arrival: {flight.arrival} at {flight.arrivalTime}</Text>
          <Text>Price: {flight.price}</Text>
          <Text>Booking URL: {flight.bookingURL}</Text>
        </View>
      ))}
    </View>
  );

  const renderHotels = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Khách sạn</Text>
      {travelPlan.hotels.map((hotel, index) => (
        <View key={index} style={styles.hotelContainer}>
          <Image source={{ uri: hotel.imageURI }} style={styles.hotelImage} />
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName}>{hotel.hotelName}</Text>
            <Text style={styles.hotelDetails}>{hotel.address}</Text>
            <Text style={styles.hotelPrice}>{hotel.price}</Text>
            <Text style={styles.hotelRating}>Rating: {hotel.rating}⭐</Text>
            <Text style={styles.hotelDescription}>{hotel.description}</Text>
            <Text style={styles.hotelNearby}>Nearby:</Text>
            {hotel.nearbyPlaces.map((place, placeIndex) => (
              <Text key={placeIndex} style={styles.nearbyPlace}>
                • {place.placeName}: {place.placeDetails}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderItinerary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Lịch trình</Text>
      {travelPlan.dailyPlan.map((dayPlan, index) => (
        <View key={index} style={styles.itineraryContainer}>
          <Text style={styles.itineraryDay}>{dayPlan.day}</Text>
          {dayPlan.activities.map((activity, activityIndex) => (
            <View key={activityIndex} style={styles.itineraryItem}>
              <Text style={styles.itineraryTime}>{activity.time}</Text>
              <Text style={styles.itineraryActivity}>{activity.activity}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: randomHeaderImage }}
          style={styles.headerImage}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveButtonPress}>
          <Ionicons name="bookmark-outline" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.tripTitle}>Kế hoạch đi {destination || 'Unknown'}</Text>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} style={styles.tripIcon} color="white" />
            <Text style={styles.dateText}>{currentDate.toLocaleDateString()}</Text>
          </View>
        </View>

      </View>

      <ScrollView style={styles.contentContainer}>
        {renderFlights()}
        {renderHotels()}
        {renderItinerary()}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
  },
  headerContainer: {
    position: 'relative',
  },
  saveButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 8,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  headerContent: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
  },
  tripIcon: {
    color: 'black',
    fontSize: 20,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  dateText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  hotelContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  hotelImage: {
    width: 120,
    height: 120,
  },
  hotelInfo: {
    flex: 1,
    padding: 10,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  hotelDetails: {
    fontSize: 14,
    color: 'black',
  },
  hotelPrice: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  hotelRating: {
    fontSize: 14,
    color: 'black',
  },
  hotelDescription: {
    fontSize: 14,
    color: 'black',
    marginTop: 5,
  },
  hotelNearby: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  nearbyPlace: {
    fontSize: 12,
    color: 'black',
  },
  itineraryContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  itineraryDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 6,
  },
  itineraryItem: {
    marginVertical: 6,
  },
  itineraryTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  itineraryActivity: {
    fontSize: 14,
    color: 'black',
  },
  itineraryDetails: {
    fontSize: 12,
    color: 'black',
  },
});

export default TripDetailsScreen;
