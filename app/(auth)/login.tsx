import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, Image, Platform, ActivityIndicator } from 'react-native';
import { auth, db } from '../../services/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const primaryBlue = '#3498db';

  // Fungsi Universal untuk Pesan Error (Web + Mobile)
  const notify = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const validateInput = () => {
    if (!email || !password) {
      notify("Input Kosong", "Harap isi Email dan Password terlebih dahulu.");
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validateInput()) return;
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.replace('/(tabs)');
      })
      .catch(error => {
        setLoading(false);
        notify("Login Gagal", "Email atau Password salah.");
      });
  };

  const handleSignUp = () => {
    if (!validateInput()) return;
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date().toISOString(),
          cart: []
        }, { merge: true });
        notify("Sukses", "Akun berhasil dibuat! Silakan login.");
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        notify("Registrasi Gagal", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/splash-screen.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Toko Obat{"\n"}Karya Farma</Text>
      
      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder="Email Anda" 
          value={email} 
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />

        {loading ? (
          <ActivityIndicator size="large" color={primaryBlue} style={{ marginTop: 20 }} />
        ) : (
          <>
            <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
              <Text style={styles.buttonText}>Masuk Ke Aplikasi</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonRegister} onPress={handleSignUp}>
              <Text style={styles.buttonTextRegister}>Belum punya akun? Daftar Sekarang</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#EBF5FF' },
  logo: { width: 120, height: 120, alignSelf: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#2c3e50' },
  form: { backgroundColor: '#fff', padding: 25, borderRadius: 25, elevation: 5, shadowColor: '#3498db', shadowOpacity: 0.1, shadowRadius: 10 },
  input: { backgroundColor: '#f8f9fa', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#e1e5e9' },
  buttonLogin: { backgroundColor: '#3498db', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  buttonRegister: { marginTop: 20, alignItems: 'center' },
  buttonTextRegister: { color: '#3498db', fontWeight: '600' }
});