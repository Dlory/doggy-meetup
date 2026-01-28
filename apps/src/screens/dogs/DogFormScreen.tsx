/** Dog form screen (create/edit) */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDogStore } from '@/stores/dogStore';
import { Dog, DogCreate, DogUpdate, DogSize, DogGender, SIZE_LABELS, GENDER_LABELS } from '@/types/dog';

interface Props {
  navigation: any;
  route: {
    params?: {
      dog?: Dog;
    };
  };
}

export default function DogFormScreen({ navigation, route }: Props) {
  const { createDog, updateDog, loading } = useDogStore();
  const editingDog = route.params?.dog;

  const [name, setName] = useState(editingDog?.name || '');
  const [breed, setBreed] = useState(editingDog?.breed || '');
  const [size, setSize] = useState<DogSize>(editingDog?.size || DogSize.medium);
  const [gender, setGender] = useState<DogGender>(editingDog?.gender || DogGender.male);
  const [ageMonths, setAgeMonths] = useState(
    editingDog?.age_months?.toString() || '12'
  );

  const handleSubmit = async () => {
    if (!name.trim() || !breed.trim()) {
      return;
    }

    const data = {
      name: name.trim(),
      breed: breed.trim(),
      size,
      gender,
      age_months: parseInt(ageMonths) || 0,
    };

    try {
      if (editingDog) {
        await updateDog(editingDog.id, data);
      } else {
        await createDog(data);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Save dog failed:', error);
    }
  };

  const SizeSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorLabel}>体型</Text>
      <View style={styles.options}>
        {Object.values(DogSize).map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.option, size === s && styles.optionSelected]}
            onPress={() => setSize(s)}
          >
            <Text style={[styles.optionText, size === s && styles.optionTextSelected]}>
              {SIZE_LABELS[s]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const GenderSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorLabel}>性别</Text>
      <View style={styles.options}>
        {Object.values(DogGender).map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.option, gender === g && styles.optionSelected]}
            onPress={() => setGender(g)}
          >
            <Text style={[styles.optionText, gender === g && styles.optionTextSelected]}>
              {GENDER_LABELS[g]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>
          {editingDog ? '编辑狗狗信息' : '添加狗狗'}
        </Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>狗狗名字 *</Text>
            <TextInput
              style={styles.input}
              placeholder="如：旺财"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>品种 *</Text>
            <TextInput
              style={styles.input}
              placeholder="如：金毛"
              value={breed}
              onChangeText={setBreed}
            />
          </View>

          <SizeSelector />
          <GenderSelector />

          <View style={styles.field}>
            <Text style={styles.label}>年龄（月）</Text>
            <TextInput
              style={styles.input}
              placeholder="如：12"
              value={ageMonths}
              onChangeText={setAgeMonths}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>保存</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DFE6E9',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  selectorContainer: {
    gap: 8,
  },
  selectorLabel: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  options: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DFE6E9',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  optionText: {
    fontSize: 14,
    color: '#636E72',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
