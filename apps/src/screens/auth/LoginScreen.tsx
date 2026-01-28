/** Login screen */
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

export default function LoginScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login(phone, code || '1234'); // MVP: use default code
      navigation.replace('Main');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSendCode = () => {
    // MVP: Just show the code
    console.log('SMS code: 1234');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>狗狗拼团</Text>
      <Text style={styles.subtitle}>连接狗狗主人的社交平台</Text>

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
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>登录</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>还没有账号？立即注册</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
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
