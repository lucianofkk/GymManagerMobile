// src/app/(clients)/membersList.tsx
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { MemberCard } from '../../components/membersCard';
import { ProfileModal } from '../../components/profileModal';
import { Client } from '../../types/type';


const mockMembers: Client[] = [
    { id: '1', firstName: 'Luciano', lastName: 'Frias-Klein', gender: 'Masculino', phoneNumber: '3644719299', isActive: true },
    { id: '2', firstName: 'Lucia', lastName: 'Asselborn', gender: 'Femenino', phoneNumber: null, isActive: false },
    { id: '3', firstName: 'Delmiro', lastName: 'Obregon', gender: 'Masculino', phoneNumber: '003', isActive: true },
    { id: '4', firstName: 'Delmiro', lastName: 'Obregon', gender: 'Masculino', phoneNumber: '004', isActive: true },
];

export default function MembersListScreen() {
    const [searchText, setSearchText] = useState('');
    const [selectedMember, setSelectedMember] = useState<Client | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleMemberPress = (member: Client) => {
        setSelectedMember(member);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedMember(null);
    };
const filteredMembers = mockMembers.filter((m) =>
    (m.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
    m.lastName?.toLowerCase().includes(searchText.toLowerCase()))
);

    return (
        <SafeAreaView style={styles.container}>
            {/* header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuText}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>MEMBERS LIST</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Text style={styles.moreText}>⋮</Text>
                </TouchableOpacity>
            </View>

            {/* search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar un cliente"
                        placeholderTextColor="#6B7280"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </View>

            {/* lista */}
            <ScrollView style={styles.membersList} showsVerticalScrollIndicator={false}>
                <View style={styles.membersContainer}>
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map((m) => (
                            <MemberCard key={m.id} member={m} onPress={handleMemberPress} />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateIcon}>👤</Text>
                            <Text style={styles.emptyStateText}>No se encontraron miembros</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <ProfileModal
                member={selectedMember}
                isVisible={isModalVisible}
                onClose={handleCloseModal}
            />

            {/* Bottom Navigation */}
            <View style={styles.bottomNavigation}>
                {[...Array(5)].map((_, i) => (
                    <TouchableOpacity key={i} style={styles.navItem}>
                        <Text style={styles.navText}>{['□', 'T', '■', '✕', '↗'][i]}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1E3A8A',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    menuButton: { padding: 8 },
    menuText: { color: '#FFFFFF', fontSize: 20 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 0.5 },
    moreButton: { padding: 8 },
    moreText: { color: '#FFFFFF', fontSize: 20 },
    searchContainer: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: { marginRight: 8, fontSize: 16 },
    searchInput: { flex: 1, fontSize: 16, color: '#374151', paddingVertical: 12 },
    membersList: { flex: 1, backgroundColor: '#F9FAFB' },
    membersContainer: { padding: 16 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32 },
    emptyStateIcon: { fontSize: 48, opacity: 0.5, marginBottom: 8 },
    emptyStateText: { fontSize: 14, color: '#6B7280' },
    bottomNavigation: {
        flexDirection: 'row',
        backgroundColor: '#1F2937',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    navItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
    navText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});