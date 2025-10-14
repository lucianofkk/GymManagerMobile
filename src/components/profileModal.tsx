import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/profileModalStyles';
import { Client } from '../types/type';

interface ProfileModalProps {
  member: Client | null; 
  isVisible: boolean;
  onClose: () => void;
}

/**
 * Modal que muestra el perfil completo de un miembro.
 * Se cierra al presionar el botón de cierre o al hacer clic fuera.
 */
export const ProfileModal: React.FC<ProfileModalProps> = ({
  member,
  isVisible,
  onClose,
}) => {
  if (!member) return null;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.profileSection}>
              <View style={styles.modalAvatarContainer}>
                <View style={styles.modalAvatar}>
                  <Text style={styles.avatarText}>👤</Text>
                </View>
              </View>

              <View style={styles.memberInfoModal}>
                <Text style={styles.memberNameModal}>{member.firstName} {member.lastName}</Text>
                <Text style={styles.memberNumberModal}>Número: {member.phoneNumber}</Text>
                <View style={styles.quotaContainerModal}>
                  <Text style={styles.quotaLabelModal}>CUOTA</Text>
                  <View
                    // La propiedad 'statusColor' no está en la interfaz 'Client', debes agregarla si quieres usarla.
                    // style={[styles.statusBadgeModal, { backgroundColor: member.statusColor }]}
                    style={styles.statusBadgeModal} // Se quita el color para evitar el error de tipado
                  >
                    {/* La propiedad 'status' no está en la interfaz 'Client', debes agregarla. */}
                    {/* <Text style={styles.statusTextModal}>{member.status}</Text> */}
                    <Text style={styles.statusTextModal}>Estado no disponible</Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}> EDITAR PERFIL</Text>
            </TouchableOpacity>
            <Text style={styles.editDescription}>
              Haz click para editar la información
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};