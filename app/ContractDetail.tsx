import { Text, View, Image, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { List, Divider, Card } from 'react-native-paper';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const ContractDetail = () => {
  const route = useRoute();
  const { contract } = route.params;
  const details = JSON.parse(contract.details);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{contract.name}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.subtitle}>Trạng thái: <Text style={styles.bold}>{contract.status}</Text></Text>
          <Text style={styles.subtitle}>Địa điểm: <Text style={styles.bold}>{contract.location}</Text></Text>
          <Text style={styles.subtitle}>Ngày bắt đầu: <Text style={styles.bold}>{formatDate(details.startDate)}</Text></Text>
          <Text style={styles.subtitle}>Số ngày đi: <Text style={styles.bold}>{details.numberOfDays} ngày</Text></Text>
          <Text style={styles.subtitle}>Giá: <Text style={styles.bold}>{details.price} VND</Text></Text>
          <Text style={styles.subtitle}>Số khách đăng ký: <Text style={styles.bold}>{details.registeredGuests}</Text></Text>
          <Text style={styles.subtitle}>Số khách tối đa: <Text style={styles.bold}>{details.maxGuests}</Text></Text>
          <Image source={{ uri: details.tourImage }} style={styles.image} />
          <Text style={styles.subtitle}>Thông tin bổ sung:</Text>
          <Text style={styles.description}>{details.additionalInfo}</Text>
        </Card.Content>
      </Card>

      <List.AccordionGroup>
        {details.itinerary?.$values.map((day, index) => (
          <List.Accordion
            title={`Ngày ${day.day}: ${formatDate(day.date)}`}
            id={index.toString()}
            key={index}
            style={styles.accordion}
            titleStyle={styles.accordionTitle}
          >
            {day.activities?.$values.map((activity, idx) => (
              <Card key={idx} style={styles.activityCard}>
                <Card.Content>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.subtitle}>Thời gian: {activity.startTime} - {activity.endTime}</Text>
                  <Text style={styles.subtitle}>Địa chỉ: {activity.activityAddress}</Text>
                  <Text style={styles.subtitle}>Ghi chú:</Text>
                  <Text style={styles.description}>{activity.note}</Text>
                  <Image source={{ uri: activity.activityImage }} style={styles.image} />
                </Card.Content>
              </Card>
            ))}
          </List.Accordion>
        ))}
      </List.AccordionGroup>

      <View style={styles.costSection}>
        <Text style={styles.sectionTitle}>Chi tiết chi phí</Text>
        {details.costDetails?.$values.map((cost, index) => (
          <Card key={index} style={styles.costCard}>
            <Card.Content>
              <Text style={styles.subtitle}>Chi phí: <Text style={styles.bold}>{cost.title}</Text></Text>
              <Text style={styles.subtitle}>Số tiền: <Text style={styles.bold}>{cost.amount} VND</Text></Text>
              <Text style={styles.subtitle}>Ghi chú:</Text>
              <Text style={styles.description}>{cost.notes}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  bold: {
    fontWeight: '600',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  accordion: {
    backgroundColor: '#e8f5e9',
    borderRadius: 5,
    marginVertical: 5,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c',
  },
  activityCard: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  costSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  costCard: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  divider: {
    marginVertical: 10,
  },
});

export default ContractDetail;
