import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6eff9ff',
  },

  // ════════════════════════════════════════════════
  // HEADER
  // ════════════════════════════════════════════════
header: {
  paddingTop: 40,
  paddingBottom: 16,
  backgroundColor: '#1E40AF',

  alignItems: 'center', // 👈 centramos el contenido principal
  justifyContent: 'center',
  position: 'relative', // 👈 permite posicionar el botón atrás dentro
},
backButtonContainer: {
  position: 'absolute',
  left: 16,
  top: 40,
},
backButton: {
  fontSize: 35,
  color: '#E5E7EB',
},
headerCenter: {
  alignItems: 'center',
},
headerTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#FFFFFF',
},
headerSubtitle: {
  fontSize: 14,
  color: '#E0E7FF',
  marginTop: 4,
},


  // ════════════════════════════════════════════════
  // BUSCADOR
  // ════════════════════════════════════════════════
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#111827',
  },

  // ════════════════════════════════════════════════
  // LISTA DE MIEMBROS
  // ════════════════════════════════════════════════
  listContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  membersWrapper: {
    paddingBottom: 80,
  },

  // ════════════════════════════════════════════════
  // LOADING
  // ════════════════════════════════════════════════
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },

  // ════════════════════════════════════════════════
  // TARJETAS DE MIEMBROS
  // ════════════════════════════════════════════════
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 14,
    borderLeftWidth: 6,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  planBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  planText: {
    fontSize: 12,
    color: '#4338CA',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
  },

  // ════════════════════════════════════════════════
  // BADGE DE VENCIMIENTO
  // ════════════════════════════════════════════════
  expirationBadge: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  expirationText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // ════════════════════════════════════════════════
  // EMPTY STATE
  // ════════════════════════════════════════════════
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyStateIcon: {
    fontSize: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 40,
  },
});
 