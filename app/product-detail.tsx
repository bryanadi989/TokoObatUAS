import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProductDetail() {
  const { productName } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://us-central1-toko-obat-karyafarma.cloudfunctions.net/getProducts')
      .then(res => res.json())
      .then(data => {
        setProduct(data.find((p: any) => p.name === productName));
        setLoading(false);
      });
  }, [productName]);

  // SPLASH LOADING
  if (loading) return (
    <View style={styles.splashLoad}>
      <Image source={require('../assets/images/splash-screen.png')} style={styles.loadImg} resizeMode="contain" />
      <Text style={styles.loadTxt}>Menyiapkan Detail...</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Info Produk', headerShown: true }} />
      <View style={styles.imgBg}><Image source={{ uri: product.image }} style={styles.mainImg} resizeMode="contain" /></View>
      <View style={styles.card}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.price}</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.label}>Cara Pakai</Text>
          <Text style={styles.val}>{product.cara_pakai || "-"}</Text>
          <Text style={styles.label}>Efek Samping</Text>
          <Text style={styles.val}>{product.efek_samping || "-"}</Text>
          <Text style={styles.label}>Penyimpanan</Text>
          <Text style={styles.val}>{product.penyimpanan || "-"}</Text>
        </View>

        <TouchableOpacity style={styles.waBtn} onPress={() => Linking.openURL(`https://wa.me/6289694176828`)}>
          <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          <Text style={styles.waBtnTxt}>Konsultasi Sekarang</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  splashLoad: { flex: 1, backgroundColor: '#EBF5FF', justifyContent: 'center', alignItems: 'center' },
  loadImg: { width: 120, height: 120 },
  loadTxt: { marginTop: 15, color: '#3498db', fontWeight: 'bold' },
  imgBg: { backgroundColor: '#f9f9f9', padding: 20 },
  mainImg: { width: '100%', height: 280 },
  card: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, padding: 30, elevation: 10 },
  name: { fontSize: 24, fontWeight: 'bold' },
  price: { fontSize: 22, color: '#3498db', fontWeight: 'bold', marginVertical: 10 },
  infoSection: { marginTop: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginTop: 15 },
  val: { fontSize: 14, color: '#7f8c8d', lineHeight: 22 },
  waBtn: { backgroundColor: '#3498db', flexDirection: 'row', gap: 10, padding: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 30 },
  waBtnTxt: { color: '#fff', fontWeight: 'bold' }
});