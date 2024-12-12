import React, { useState, useEffect } from 'react';
import { View, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { List } from 'react-native-paper';

// Bật LayoutAnimation cho Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Infomation() {
  const [expanded, setExpanded] = useState(null);

  const handlePress = (section) => {
    // Áp dụng hiệu ứng khi mở/đóng Accordion
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === section ? null : section);
  };

  return (
    <View style={styles.container}>
      <List.Accordion
        title="Giới thiệu"
        expanded={expanded === 'introduction'}
        onPress={() => handlePress('introduction')}
        left={(props) => <List.Icon {...props} icon="account" />}
        style={styles.accordion}>
        <List.Item title="Thông tin cá nhân" />
        <List.Item title="Sở thích và đam mê" />
      </List.Accordion>

      <List.Accordion
        title="Nhà của tôi"
        expanded={expanded === 'home'}
        onPress={() => handlePress('home')}
        left={(props) => <List.Icon {...props} icon="home" />}
        style={styles.accordion}>
        <List.Item title="Địa chỉ hiện tại" />
        <List.Item title="Thông tin gia đình" />
      </List.Accordion>

      <List.Accordion
        title="Chuyến đi"
        expanded={expanded === 'trip'}
        onPress={() => handlePress('trip')}
        left={(props) => <List.Icon {...props} icon="map" />}
        style={styles.accordion}>
        <List.Item title="Chuyến đi gần đây" />
        <List.Item title="Kế hoạch tương lai" />
      </List.Accordion>

      <List.Accordion
        title="Bạn bè"
        expanded={expanded === 'friends'}
        onPress={() => handlePress('friends')}
        left={(props) => <List.Icon {...props} icon="account-group" />}
        style={styles.accordion}>
        <List.Item title="Danh sách bạn bè" />
        <List.Item title="Bạn bè gợi ý" />
      </List.Accordion>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  accordion: {
    backgroundColor: '#C8E6C9',
    marginVertical: 5,
    borderRadius: 8,
  },
});