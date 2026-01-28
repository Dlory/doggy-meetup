/** Register screen */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuthStore } from '@/stores/authStore';

interface Props {
  navigation: any;
}

export default function RegisterScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [nickname, setNickname] = useState('');
  const [code, setCode] = useState('');
  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    try {
      await register(phone, nickname, code || '1234');
      navigation.replace('Main');
    } catch (error) {
      console.error('Register failed:', error);
    }
  };

  const handleSendCode = () => {
    console.log('SMS code: 1234');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>创建账号</Text>

      <View style={styles.form}>
        <Text style={styles.label}>手机号</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入手机号"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={11}
        />

        <Text style={styles.label}>昵称</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入昵称"
          value={nickname}
          onChangeText={setNickname}
          maxLength={20}
        />

        <Text style={styles.label}>验证码</Text>
        <View style={styles.codeRow}>
          <TextInput
            style={styles.input}
            placeholder="请输入验证码"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity style={styles.codeButton} onPress={handleSendCode}>
            <Text style={styles.codeButtonText}>获取验证码</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>注册</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>已有账号？返回登录</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#2D3436',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DFE6E9',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    flex: 1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeButton: {
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  codeButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 16,
  },
});
