import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetail() {
  const { productName } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const primaryBlue = '#3498db';

  useEffect(() => {
    fetch('https://us-central1-toko-obat-karyafarma.cloudfunctions.net/getProducts')
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => p.name === productName);
        setProduct(found);
        
        // LOGIKA REKOMENDASI: Ambil produk dengan kategori sama tapi nama berbeda
        const recs = data.filter((p: any) => p.category === found.category && p.name !== found.name);
        setRecommendations(recs);
        
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productName]);

  // SPLASH LOADING
  if (loading) return (
    <View style={styles.splashLoad}>
      <Image source={require('../assets/images/splash-screen.png')} style={styles.loadImg} resizeMode="contain" />
      <Text style={styles.loadTxt}>Menyiapkan Detail Obat...</Text>
    </View>
  );

  if (!product) return <View style={styles.center}><Text>Produk tidak ditemukan.</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Detail Produk', headerShown: true }} />
      
      <View style={styles.imgBg}>
        <Image source={{ uri: product.image }} style={styles.mainImg} resizeMode="contain" />
      </View>

      <View style={styles.card}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.price}</Text>
        <View style={styles.badge}><Text style={styles.badgeTxt}>{product.category}</Text></View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Komposisi</Text>
          <Text style={styles.val}>{product.komposisi || "-"}</Text>
          
          <Text style={styles.label}>Cara Pakai</Text>
          <Text style={styles.val}>{product.cara_pakai || "-"}</Text>

          <Text style={styles.label}>Efek Samping</Text>
          <Text style={styles.val}>{product.efek_samping || "-"}</Text>

          <Text style={styles.label}>Penyimpanan</Text>
          <Text style={styles.val}>{product.penyimpanan || "-"}</Text>
        </View>

        <TouchableOpacity 
          style={styles.waBtn}
          onPress={() => Linking.openURL(`https://wa.me/6289694176828?text=Halo, tanya tentang ${product.name}`)}
        >
          <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          <Text style={styles.waBtnTxt}>Konsultasi Sekarang</Text>
        </TouchableOpacity>

        {/* REKOMENDASI PRODUK SERUPA */}
        {recommendations.length > 0 && (
          <View style={{ marginTop: 30 }}>
            <Text style={styles.recTitle}>Produk Serupa ({product.category})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recList}>
              {recommendations.map((item: any) => (
                <TouchableOpacity 
                  key={item.name} 
                  style={styles.recCard}
                  onPress={() => router.push({ pathname: '/product-detail', params: { productName: item.name } })}
                >
                  <Image source={{ uri: item.image }} style={styles.recImg} />
                  <Text numberOfLines={1} style={styles.recName}>{item.name}</Text>
                  <Text style={styles.recPrice}>{item.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EBF5FF' },
  splashLoad: { flex: 1, backgroundColor: '#EBF5FF', justifyContent: 'center', alignItems: 'center' },
  loadImg: { width: 120, height: 120 },
  loadTxt: { marginTop: 15, color: '#3498db', fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imgBg: { backgroundColor: '#fff', padding: 20, alignItems: 'center' },
  mainImg: { width: '100%', height: 280 },
  card: { backgroundColor: '#fff', borderTopLeftRadius: 35, borderTopRightRadius: 35, marginTop: -30, padding: 30, elevation: 10 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  price: { fontSize: 22, color: '#3498db', fontWeight: 'bold', marginVertical: 5 },
  badge: { backgroundColor: '#EBF5FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 20 },
  badgeTxt: { color: '#3498db', fontSize: 12, fontWeight: 'bold' },
  infoSection: { borderTopWidth: 1, borderTopColor: '#f1f3f6', paddingTop: 10 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginTop: 15 },
  val: { fontSize: 14, color: '#7f8c8d', lineHeight: 22, marginTop: 4 },
  waBtn: { backgroundColor: '#3498db', flexDirection: 'row', gap: 10, padding: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 25 },
  waBtnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  recTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50' },
  recList: { marginBottom: 20 },
  recCard: { width: 140, marginRight: 15, backgroundColor: '#fff', borderRadius: 15, padding: 10, borderWidth: 1, borderColor: '#eee' },
  recImg: { width: '100%', height: 100, borderRadius: 10 },
  recName: { fontSize: 13, fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
  recPrice: { fontSize: 12, color: '#3498db', textAlign: 'center', marginTop: 2 }
});