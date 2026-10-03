/**
 * Carte de gestion de course active pour livreur (DriverActiveDeliveryCard).
 * Bouton d'appel direct natif, itinéraire GPS, saisie du code PIN client et validation sécurisée.
 */

import React, { useState } from 'react';
import { Phone, Navigation, CheckCircle, Package, MapPin, Banknote, KeyRound } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { getOrderStatusLabel, getOrderStatusStyle } from '../../../constants/statusLabels';

export const DriverActiveDeliveryCard = ({ delivery, onAction, onOpenNavigation }) => {
  const [pin, setPin] = useState('');
  const isAssigned = delivery.status === 'ASSIGNED';
  const isPickedUp = delivery.status === 'PICKED_UP';
  const isOutForDelivery = delivery.status === 'OUT_FOR_DELIVERY';
  const badgeStyle = getOrderStatusStyle(delivery.status);

  return (
    <div className="card-surface" style={cardStyle}>
      {/* En-tête : Numéro de commande et statut */}
      <div style={headerRowStyle}>
        <div>
          <span style={orderNumberStyle}>#{delivery.orderNumber}</span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>
            {delivery.items?.length || 0} article(s) commandé(s)
          </span>
        </div>
        <span style={{ ...statusBadgeStyle, backgroundColor: badgeStyle.bg, color: badgeStyle.color, borderColor: badgeStyle.border }}>
          {getOrderStatusLabel(delivery.status)}
        </span>
      </div>

      {/* Détails du client et adresse de livraison */}
      <div style={clientSectionStyle}>
        <div style={infoRowStyle}>
          <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{delivery.customer?.name}</strong>
          {delivery.customer?.phone && (
            <a href={`tel:${delivery.customer.phone}`} style={directCallButtonStyle} aria-label={`Appeler ${delivery.customer.name}`}>
              <Phone size={14} /> Appeler {delivery.customer.phone}
            </a>
          )}
        </div>

        <div style={addressRowStyle}>
          <MapPin size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <span style={addressTextStyle}>{delivery.delivery?.address}</span>
            {delivery.delivery?.note && <span style={noteTextStyle}>Note : {delivery.delivery.note}</span>}
          </div>
        </div>
      </div>

      {/* Montant total à encaisser en espèces */}
      <div style={cashBoxStyle}>
        <div style={cashInfoStyle}>
          <Banknote size={20} color="var(--color-primary)" />
          <div>
            <span style={cashLabelStyle}>Montant à encaisser (Cash)</span>
            <strong style={cashAmountStyle}>{(delivery.total || 0).toLocaleString('fr-FR')} FCFA</strong>
          </div>
        </div>
        {delivery.delivery?.location?.coordinates && (
          <Button variant="outline" size="sm" icon={Navigation} onClick={() => onOpenNavigation(delivery.delivery.location.coordinates)}>
            Itinéraire GPS
          </Button>
        )}
      </div>

      {/* Actions séquentielles du cycle de livraison */}
      <div style={actionButtonsContainerStyle}>
        {isAssigned && (
          <Button variant="primary" size="md" fullWidth icon={Package} onClick={() => onAction(delivery._id, 'picked-up', 'Repas récupéré en cuisine !')}>
            Repas récupéré au restaurant
          </Button>
        )}

        {isPickedUp && (
          <Button variant="primary" size="md" fullWidth icon={Navigation} onClick={() => onAction(delivery._id, 'out-for-delivery', 'En route vers le client !')}>
            En route vers le client
          </Button>
        )}

        {isOutForDelivery && (
          <div style={pinDeliveryBoxStyle}>
            <div style={pinInputHeaderStyle}>
              <KeyRound size={15} color="var(--color-primary)" />
              <span style={pinInputLabelStyle}>Code PIN client (4 chiffres)</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Code à 4 chiffres du client"
              style={pinInputFieldStyle}
            />
            <Button
              variant="accent"
              size="md"
              fullWidth
              icon={CheckCircle}
              disabled={pin.length !== 4}
              onClick={() => onAction(delivery._id, 'delivered', 'Course terminée et validée avec succès !', { deliveryPin: pin })}
            >
              Valider la livraison & l'encaissement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const cardStyle = { padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', border: '1px solid var(--border-color)', borderRadius: '14px' };
const headerRowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const orderNumberStyle = { fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' };
const statusBadgeStyle = { fontSize: '0.74rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', border: '1px solid' };
const clientSectionStyle = { display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: 'var(--bg-elevated)', borderRadius: '10px' };
const infoRowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' };
const directCallButtonStyle = { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: 'var(--color-primary-surface, rgba(230, 81, 0, 0.12))', color: 'var(--color-primary, #E65100)', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', border: '1px solid var(--border-color)' };
const addressRowStyle = { display: 'flex', alignItems: 'flex-start', gap: '8px' };
const addressTextStyle = { fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 };
const noteTextStyle = { display: 'block', fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px', fontStyle: 'italic' };
const cashBoxStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '10px', backgroundColor: 'var(--bg-card-header)', border: '1px solid var(--border-color)' };
const cashInfoStyle = { display: 'flex', alignItems: 'center', gap: '10px' };
const cashLabelStyle = { display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)' };
const cashAmountStyle = { fontSize: '1rem', fontWeight: 800, color: 'var(--status-success, #16A34A)' };
const actionButtonsContainerStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const pinDeliveryBoxStyle = { display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', backgroundColor: 'var(--color-primary-surface)', borderRadius: '12px', border: '1.5px solid var(--color-primary-light, rgba(230, 81, 0, 0.25))' };
const pinInputHeaderStyle = { display: 'flex', alignItems: 'center', gap: '6px' };
const pinInputLabelStyle = { fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary-dark, #BF360C)' };
const pinInputFieldStyle = { textAlign: 'center', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '0.3em', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-elevated)', color: 'var(--color-primary)' };
