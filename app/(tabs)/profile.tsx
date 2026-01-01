import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../services/firebaseConfig';

export default function ProfileScreen() {
  const user = auth.currentUser;

  const openMap = () => Linking.openURL("https://www.google.com/maps/search/?api=1&query=-6.8773,107.5458"); // Lokasi Cimahi
  const openTokopedia = () => Linking.openURL("https://www.tokopedia.com/toko-obat-karya-farma");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color="#bdc3c7" />
        <Text style={styles.emailText}>{user?.email}</Text>
        <Text style={styles.statusBadge}>Pelanggan Aktif</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lokasi & Kontak Toko</Text>
        <Image 
          source={require('../../assets/images/Denah.png')} 
          style={styles.mapImage} 
          resizeMode="contain"
        />
        <Text style={styles.addressText}>
          Jl. Pasir Kiara No.8, RT.01/RW.16, Cipageran, Cimahi Utara.{"\n"}
          Buka: 07.00 - 22.00 WIB
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4285F4' }]} onPress={openMap}>
            <Ionicons name="map" size={18} color="#fff" />
            <Text style={styles.actionText}>Google Maps</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#03AC0E' }]} onPress={openTokopedia}>
            <Ionicons name="cart" size={18} color="#fff" />
            <Text style={styles.actionText}>Tokopedia</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => signOut(auth)}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Keluar dari Akun</Text>
      </TouchableOpacity>
      
      <Text style={styles.footer}>© 2025 Toko Obat Karya Farma</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 50 },
  header: { alignItems: 'center', padding: 40, backgroundColor: '#f9f9f9', paddingTop: 60 },
  emailText: { fontSize: 18, fontWeight: 'bold', marginTop: 10, color: '#2c3e50' },
  statusBadge: { color: '#27ae60', marginTop: 5, fontWeight: '600' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50' },
  mapImage: { width: '100%', height: 250, borderRadius: 12, backgroundColor: '#eee' },
  addressText: { marginTop: 15, color: '#666', lineHeight: 22, fontSize: 14 },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  actionButton: { flex: 1, flexDirection: 'row', gap: 8, padding: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  logoutButton: { margin: 20, backgroundColor: '#e74c3c', flexDirection: 'row', gap: 10, padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  footer: { textAlign: 'center', color: '#ccc', fontSize: 12, marginBottom: 20 }
});