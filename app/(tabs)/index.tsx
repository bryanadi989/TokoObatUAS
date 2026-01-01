import React, { useEffect, useState, useCallback } from 'react';
import { 
  StyleSheet, View, Text, FlatList, Image, TextInput, 
  TouchableOpacity, RefreshControl, Alert, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../services/firebaseConfig';
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { useRouter } from 'expo-router';

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <Image source={require('../../assets/images/splash-screen.png')} style={styles.loadingLogo} resizeMode="contain" />
    <Text style={styles.loadingText}>Memuat Katalog...</Text>
  </View>
);

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const router = useRouter();

  const primaryBlue = '#3498db';
  const categories = ['Semua', 'Suplemen', 'Obat Bebas', 'Obat Keras', 'Alat Kesehatan'];

  const loadData = async () => {
    try {
      const response = await fetch('https://us-central1-toko-obat-karyafarma.cloudfunctions.net/getProducts');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // buat cari dan kategori (user friendly jadi gampang nyari gosah ngetik terus)
  const applyFilter = (text: string, cat: string) => {
    let filtered = products;
    if (cat !== 'Semua') {
      filtered = filtered.filter((item: any) => item.category === cat);
    }
    if (text) {
      filtered = filtered.filter((item: any) => item.name.toLowerCase().includes(text.toLowerCase()));
    }
    setFilteredProducts(filtered);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    applyFilter(text, selectedCategory);
  };

  const handleCategoryPress = (cat: string) => {
    setSelectedCategory(cat);
    applyFilter(search, cat);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const addToConsultation = async (product: any) => {
    const user = auth.currentUser;
    if (!user) return Alert.alert("Error", "Silakan login.");
    try {
      await setDoc(doc(db, "users", user.uid), {
        cart: arrayUnion({ name: product.name, price: product.price, image: product.image, addedAt: new Date().toISOString() })
      }, { merge: true });
      Alert.alert("Berhasil", "Masuk keranjang.");
    } catch (error) {
      Alert.alert("Gagal", "Error simpan.");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Toko Obat Karya Farma</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#bdc3c7" />
          <TextInput style={styles.searchInput} placeholder="Cari obat..." value={search} onChangeText={handleSearch} />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => {setSearch(''); applyFilter('', selectedCategory);}}>
              <Ionicons name="close-circle" size={20} color="#bdc3c7" />
            </TouchableOpacity>
          )}
        </View>

        {/* FITUR BARU: FILTER KATEGORI PRODUK */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={{ paddingRight: 20 }}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => handleCategoryPress(cat)}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item: any, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity style={styles.touchArea} onPress={() => router.push({ pathname: '/product-detail', params: { productName: item.name } })}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.cat}>{item.category}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={() => addToConsultation(item)}>
              <Text style={styles.addBtnText}>+ Konsultasi</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[primaryBlue]} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EBF5FF' },
  loadingContainer: { flex: 1, backgroundColor: '#EBF5FF', justifyContent: 'center', alignItems: 'center' },
  loadingLogo: { width: 150, height: 150 },
  loadingText: { marginTop: 20, fontSize: 16, color: '#3498db', fontWeight: 'bold' },
  header: { padding: 25, backgroundColor: '#fff', paddingTop: 60, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f3f6', borderRadius: 15, paddingHorizontal: 15, marginTop: 15 },
  searchInput: { flex: 1, paddingVertical: 12, marginLeft: 10 },
  categoryScroll: { marginTop: 15, flexDirection: 'row' },
  categoryChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f3f6', marginRight: 10, borderWidth: 1, borderColor: '#eee' },
  categoryChipActive: { backgroundColor: '#3498db', borderColor: '#3498db' },
  categoryText: { color: '#7f8c8d', fontSize: 13, fontWeight: '600' },
  categoryTextActive: { color: '#fff' },
  list: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 20, padding: 15, elevation: 3 },
  touchArea: { flexDirection: 'row', marginBottom: 12 },
  image: { width: 80, height: 80, borderRadius: 15, backgroundColor: '#f9f9f9' },
  info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  name: { fontSize: 17, fontWeight: 'bold' },
  cat: { fontSize: 13, color: '#95a5a6' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#3498db', marginTop: 3 },
  addBtn: { backgroundColor: '#3498db', padding: 12, borderRadius: 12, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold' }
});