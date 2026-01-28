/** Dog card component */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Dog } from '@/types/dog';

interface Props {
  dog: Dog;
  onPress?: () => void;
}

export default function DogCard({ dog, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={
          dog.avatar
            ? { uri: dog.avatar }
            : require('@/assets/images/dog-placeholder.png')
        }
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{dog.name}</Text>
        <Text style={styles.breed}>{dog.breed}</Text>
        <View style={styles.tags}>
          <Text style={styles.tag}>
            {dog.gender === 'male' ? '弟弟' : '妹妹'}
          </Text>
          <Text style={styles.tag}>{dog.age_months}个月</Text>
          {dog.mbti && <Text style={[styles.tag, styles.mbtiTag]}>{dog.mbti}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  breed: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 2,
  },
  tags: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 6,
  },
  tag: {
    fontSize: 12,
    color: '#636E72',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mbtiTag: {
    backgroundColor: '#FFEAA7',
    color: '#2D3436',
  },
});
