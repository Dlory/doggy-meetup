/** My dogs screen */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDogStore } from '@/stores/dogStore';
import { useAuthStore } from '@/stores/authStore';
import DogCard from '@/components/DogCard';

interface Props {
  navigation: any;
}

export default function MyDogsScreen({ navigation }: Props) {
  const { dogs, loading, fetchDogs, error, clearError } = useDogStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchDogs();
    }
  }, [user]);

  const handleAddDog = () => {
    if (!dogs.length || dogs.length < 10) {
      navigation.navigate('DogForm');
    } else {
      // Show max dogs reached warning
    }
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🐕</Text>
      <Text style={styles.emptyTitle}>还没有添加狗狗</Text>
      <Text style={styles.emptyText}>点击下方按钮添加你的第一只狗狗</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>我的狗狗 ({dogs.length})</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && dogs.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <FlatList
          data={dogs}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          renderItem={({ item }) => (
            <DogCard
              dog={item}
              onPress={() => navigation.navigate('DogDetail', { dogId: item.id })}
            />
          )}
          contentContainerStyle={dogs.length === 0 ? styles.emptyListContent : undefined}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleAddDog}>
        <Text style={styles.fabText}>+ 添加</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
