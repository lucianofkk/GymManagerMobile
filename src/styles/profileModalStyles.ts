import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // este conviene dejarlo asi
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: '100%',
    maxWidth: 320,
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 8,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  modalContent: { padding: 24 },
  profileSection: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  modalAvatarContainer: { marginRight: 16 },
  modalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  avatarText: { fontSize: 24, color: COLORS.text },
  memberInfoModal: { flex: 1 },
  memberNameModal: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  memberNumberModal: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  //  Agregado para mostrar el plan del miembro
memberPlanInfo: {
  fontSize: 14,
  color: COLORS.text,
  marginBottom: 12,
  fontWeight: '500',
},
expirationInfo: {
  fontSize: 12,
  color: COLORS.textSecondary,
  marginTop: 8,
},
  quotaContainerModal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quotaLabelModal: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
    marginRight: 8,
  },
  statusBadgeModal: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusTextModal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  editButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  editDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  // Agregar al final del archivo:
actionsContainer: {
  marginVertical: 16,
  gap: 12,
},
actionButton: {
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
},
primaryButton: {
  backgroundColor: '#1E40AF',
},
successButton: {
  backgroundColor: '#10B981',
},
warningButton: {
  backgroundColor: '#F59E0B',
},
actionButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '700',
},
planInfoContainer: {
  marginBottom: 12,
},
memberPlanPrice: {
  fontSize: 13,
  color: '#6B7280',
  marginTop: 2,
},
noPlanText: {
  fontSize: 14,
  color: '#92400E',
  marginBottom: 12,
},
infoSection: {
  marginTop: 16,
  paddingTop: 16,
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
},
infoTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#111827',
  marginBottom: 12,
},
infoRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
},
infoLabel: {
  fontSize: 14,
  color: '#6B7280',
},
infoValue: {
  fontSize: 14,
  fontWeight: '600',
  color: '#111827',
},
});
