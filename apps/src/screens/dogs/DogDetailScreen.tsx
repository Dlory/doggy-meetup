/** Dog detail screen */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDogStore } from '@/stores/dogStore';
import { dogsService } from '@/services/dogs';
import { Dog, SIZE_LABELS, GENDER_LABELS } from '@/types/dog';

interface Props {
  navigation: any;
  route: {
    params: {
      dogId: string;
    };
  };
}

export default function DogDetailScreen({ navigation, route }: Props) {
  const { dogId } = route.params;
  const { deleteDog } = useDogStore();
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDog();
  }, [dogId]);

  const loadDog = async () => {
    try {
      const res = await dogsService.getDog(dogId);
      setDog(res.data);
    } catch (error) {
      console.error('Failed to load dog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('删除狗狗', '确定要删除这只狗狗吗？此操作不可恢复。', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDog(dogId);
            navigation.goBack();
          } catch (error) {
            Alert.alert('删除失败', '请稍后重试');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!dog) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>狗狗不存在</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {dog.avatar ? (
            <Image source={{ uri: dog.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarEmoji}>🐕</Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{dog.name}</Text>
        <Text style={styles.breed}>{dog.breed}</Text>
      </View>

      {/* Info cards */}
      <View style={styles.section}>
        <InfoRow label="性别" value={GENDER_LABELS[dog.gender]} />
        <InfoRow label="体型" value={SIZE_LABELS[dog.size]} />
        <InfoRow label="年龄" value={`${dog.age_months} 个月`} />
        {dog.mbti && <InfoRow label="性格" value={dog.mbti} />}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate('DogForm', {
              dog,
            })
          }
        >
          <Text style={styles.actionButtonText}>编辑信息</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>删除</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#636E72',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  breed: {
    fontSize: 16,
    color: '#636E72',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#636E72',
  },
  infoValue: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '500',
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DFE6E9',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '600',
  },
  deleteButton: {
    borderColor: '#FF7675',
  },
  deleteButtonText: {
    color: '#FF7675',
  },
});
