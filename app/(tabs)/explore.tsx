import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import { auth, db } from '../../services/firebaseConfig';
import { doc, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const primaryBlue = '#3498db'; 

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        setCartItems(doc.data().cart || []);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const deleteItem = async (item: any) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        cart: arrayRemove(item)
      });
    } catch (error) {
      Alert.alert("Gagal", "Gagal menghapus produk.");
    }
  };

  const sendToWA = () => {
    let message = "Halo Apoteker, saya ingin konsultasi mengenai:\n";
    cartItems.forEach((item: any) => { message += `\n- ${item.name}`; });
    Linking.openURL(`https://wa.me/6289694176828?text=${encodeURIComponent(message)}`);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={primaryBlue} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keranjang Konsultasi</Text>
        <Text style={styles.headerSubtitle}>{cartItems.length} Produk terpilih</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemIcon}>
              <Ionicons name="medical" size={20} color={primaryBlue} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
            {/* TOMBOL HAPUS */}
            <TouchableOpacity onPress={() => deleteItem(item)} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={22} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={80} color="#d1d9e6" />
            <Text style={styles.emptyText}>Keranjang Anda masih kosong.</Text>
          </View>
        }
      />

      {cartItems.length > 0 && (
        <TouchableOpacity style={[styles.btn, { backgroundColor: primaryBlue }]} onPress={sendToWA}>
          <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          <Text style={styles.btnText}>Konsultasi via WhatsApp</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 25, paddingTop: 60, backgroundColor: '#fff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 2 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  headerSubtitle: { fontSize: 14, color: '#95a5a6', marginTop: 5 },
  itemCard: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', marginHorizontal: 20, marginTop: 15, borderRadius: 15, alignItems: 'center', elevation: 1 },
  itemIcon: { width: 40, height: 40, backgroundColor: '#e3f2fd', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#34495e' },
  itemPrice: { fontSize: 14, color: '#3498db', marginTop: 2 },
  deleteButton: { padding: 10 },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, color: '#bdc3c7', fontSize: 16 },
  btn: { margin: 20, flexDirection: 'row', gap: 10, padding: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});