import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Post {
    id: number;
    user: string;
    avatar: string;
    content: string;
    images: string[];
}

interface PostsProps {
    posts: Post[];
}

const Posts: React.FC<PostsProps> = ({ posts }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [currentImages, setCurrentImages] = useState<string[]>([]);

    const renderImages = (images: string[]) => {
        if (images.length === 1) {
            return (
                <Image source={{ uri: images[0] }} style={styles.fullWidthImage} />
            );
        } else if (images.length === 3) {
            return (
                <View>
                    <View style={styles.imageRow}>
                        {images.slice(0, 2).map((img, index) => (
                            <Image key={index} source={{ uri: img }} style={styles.halfImage} />
                        ))}
                    </View>
                    <Image source={{ uri: images[2] }} style={styles.fullWidthImage} />
                </View>
            );
        } else if (images.length <= 4) {
            return (
                <View>
                    <View style={styles.imageRow}>
                        {images.slice(0, 2).map((img, index) => (
                            <Image key={index} source={{ uri: img }} style={styles.halfImage} />
                        ))}
                    </View>
                    {images.length > 2 && (
                        <View style={styles.imageRow}>
                            {images.slice(2).map((img, index) => (
                                <Image key={index} source={{ uri: img }} style={styles.halfImage} />
                            ))}
                        </View>
                    )}
                </View>
            );
        } else {
            return (
                <View>
                    <View style={styles.imageRow}>
                        {images.slice(0, 2).map((img, index) => (
                            <Image key={index} source={{ uri: img }} style={styles.halfImage} />
                        ))}
                    </View>
                    <View style={styles.imageRow}>
                        {images.slice(2, 4).map((img, index) => (
                            <Image key={index} source={{ uri: img }} style={styles.halfImage} />
                        ))}
                    </View>
                    <TouchableOpacity
                        style={styles.moreButton}
                        onPress={() => {
                            setCurrentImages(images);
                            setModalVisible(true);
                        }}
                    >
                        <Text style={styles.moreText}>+{images.length - 4} more</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    return (
        <View>
            <View style={styles.postsSection}>
                <Text style={styles.sectionTitle}>Bài viết mới nhất</Text>
                {posts.map((post) => (
                    <View key={post.id} style={styles.postCard}>
                        <View style={styles.postHeader}>
                            <Image source={{ uri: post.avatar }} style={styles.avatar} />
                            <Text style={styles.postUser}>{post.user}</Text>
                        </View>
                        <Text style={styles.postContent}>{post.content}</Text>
                        {renderImages(post.images)}
                    </View>
                ))}
            </View>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        {currentImages.map((img, index) => (
                            <Image key={index} source={{ uri: img }} style={styles.modalImage} />
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    postsSection: {
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    postCard: {
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 3,
        padding: 10,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    postUser: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postContent: {
        fontSize: 14,
        marginBottom: 10,
    },
    singleImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    halfImage: {
        width: '48%',
        height: 150,
        borderRadius: 10,
    },
    moreButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0e0',
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    moreText: {
        fontSize: 14,
        color: '#007BFF',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        alignItems: 'center',
    },
    modalImage: {
        width: 300,
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    closeButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    closeText: {
        color: '#007BFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fullWidthImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginTop: 10,
    },
});

export default Posts;