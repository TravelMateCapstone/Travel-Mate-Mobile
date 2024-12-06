import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, ScrollView, View, Text, Dimensions, TouchableOpacity } from "react-native";
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import axios from 'axios'; // Add axios for API calls

// Define types for user and post
interface User {
  UserId: number;
  FullName: string;
  Profile?: {
    Avatar?: string;
  };
}

interface Post {
  id: number;
  title: string;
  content: string;
}

const carouselItems = [
  { id: 1, image: "https://t2.ex-cdn.com/crystalbay.com/resize/1860x570/files/news/2024/09/16/top-10-diem-den-dep-nhat-ha-giang-di-de-thay-thien-nhien-viet-nam-dep-dieu-ky-213528.jpg", caption: "Hà Giang" },
  { id: 2, image: "https://file1.dangcongsan.vn/data/0/images/2022/06/11/oanhvh/6f6a69d3f924397a6035.jpg", caption: "TP Huế" },
  { id: 3, image: "https://vcdn1-dulich.vnecdn.net/2022/05/12/Hanoi2-1652338755-3632-1652338809.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=NxMN93PTvOTnHNryMx3xJw", caption: "TP Hà Nội" },
];

const posts: Post[] = [
  { id: 1, title: "Bài viết 1", content: "Nội dung bài viết 1" },
  { id: 2, title: "Bài viết 2", content: "Nội dung bài viết 2" },
  { id: 3, title: "Bài viết 3", content: "Nội dung bài viết 3" },
];

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]); // Ensure initial state is an empty array
  const carouselRef = useRef<ScrollView>(null);
  const router = useRouter();

  // Fetch users from API
  useEffect(() => {
    axios.get('https://travelmateapp.azurewebsites.net/odata/ApplicationUsers')
      .then((response) => {
        const data = response.data as { value: User[] };
        setUsers(data.value || []); // Ensure response is always an array
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Function to automatically scroll to next item in the carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carouselItems.length; // Ensure infinite loop
        if (carouselRef.current) {
          carouselRef.current.scrollTo({ x: nextIndex * Dimensions.get("window").width, animated: true });
        }
        return nextIndex;
      });
    }, 5000); // Change image every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleViewUser = (id: number) => {
    router.push({
      pathname: '../Local/LocalDetail',
      params: {
        id
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Carousel */}
      <ScrollView
        ref={carouselRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      >
        {carouselItems.map(item => (
          <View key={item.id} style={styles.carouselItem}>
            <Image source={{ uri: item.image }} style={styles.carouselImage} />
            <View style={styles.overlay}>
              <Text style={styles.carouselCaption}>{item.caption}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* User List */}
      <ScrollView horizontal pagingEnabled>
        {users.length > 0 ? (
          users.map(user => (
            <TouchableOpacity key={user.UserId} style={styles.userContainer} onPress={() => handleViewUser(user.UserId)}>
              <Image source={{ uri: user.Profile?.Avatar || 'default-avatar-url' }} style={styles.avatar} />
              <Text style={styles.username}>{user.FullName}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No users available</Text>
        )}
      </ScrollView>

      {/* Post List */}
      <View style={styles.postList}>
        {posts.map(post => (
          <View key={post.id} style={styles.postContainer}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  carousel: {
    marginBottom: 20,
  },
  carouselItem: {
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
  },
  carouselImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    left: 30,
    bottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselCaption: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  userContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
  },
  postList: {
    padding: 10,
  },
  postContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postContent: {
    fontSize: 16,
  },
});
