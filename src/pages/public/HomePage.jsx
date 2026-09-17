/**
 * Page d'accueil publique Chez Roger Becker.
 * Vitrine gastronomique mobile-first avec mise en avant des grillades et des offres.
 */

import React from 'react';
import { Flame, ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { DishCard } from '../../components/menu/DishCard';
import { Button } from '../../components/ui/Button';

export const HomePage = ({
  dishes = [],
  promotions = [],
  restaurant = {},
  onNavigate,
  onSelectDish
}) => {
  const featuredDishes = dishes.filter((d) => d.isFeatured).slice(0, 4);
  const activePromo = promotions[0];
  const openingHours = (restaurant.openingHours || 'Mardi – Dimanche : 11h00 – 23h00 (Fermé le lundi)')
    .replace(/Ferme\s+le\s+lundi/gi, 'Fermé le lundi');
  const address = (restaurant.address || "Abidjan, Côte d'Ivoire")
    .replace(/Cote\s+d\s*Ivoire/gi, "Côte d'Ivoire");

  return (
    <div className="animate-fade-in" style={pageStyle}>
      {/* 1. HERO BANNER */}
      <section style={heroStyle}>
        <div style={heroOverlayStyle}>
          <div style={badgeStyle}>
            <Flame size={15} color="#FF7A00" />
            <span>L'authenticité des grillades à Abidjan</span>
          </div>
          <h2 style={heroTitleStyle}>Chez Roger Becker</h2>
          <p style={heroSubtitleStyle}>
            {restaurant.description || 'Découvrez nos spécialités au feu de bois et commandez en direct en quelques secondes.'}
          </p>
          <div style={heroActionsStyle}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('menu')}
              icon={ArrowRight}
            >
              Commander maintenant
            </Button>
          </div>
        </div>
      </section>

      {/* 2. OFFRE SPÉCIALE DU MOMENT */}
      {activePromo && (
        <section style={promoSectionStyle}>
          <div className="card-surface" style={promoCardStyle}>
            <div style={promoHeaderStyle}>
              <span style={promoTagStyle}>Offre Exclusive</span>
              <h3 style={promoTitleStyle}>{activePromo.title}</h3>
              <p style={promoDescStyle}>{activePromo.description}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onNavigate('menu')}
                style={{ marginTop: '10px' }}
              >
                En profiter
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 3. PLATS POPULAIRES */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h3 style={sectionTitleStyle}>Spécialités Populaires</h3>
            <p style={sectionSubtitleStyle}>Les incontournables préparés chaque jour</p>
          </div>
          <button onClick={() => onNavigate('menu')} style={seeAllButtonStyle}>
            Voir tout
          </button>
        </div>

        <div style={dishesGridStyle}>
          {featuredDishes.map((dish) => (
            <DishCard key={dish._id} dish={dish} onSelect={onSelectDish} />
          ))}
        </div>
      </section>

      {/* 4. INFORMATIONS RESTAURANT */}
      <section style={infoSectionStyle}>
        <div className="card-surface" style={infoCardStyle}>
          <h3 style={infoTitleStyle}>Horaires & Contact</h3>
          <div style={infoRowStyle}>
            <Clock size={18} color="var(--color-primary)" />
            <span>{openingHours}</span>
          </div>
          <div style={infoRowStyle}>
            <MapPin size={18} color="var(--color-primary)" />
            <span>{address}</span>
          </div>
          <div style={infoRowStyle}>
            <Phone size={18} color="var(--color-primary)" />
            <a href={`tel:${restaurant.phone || '+2250700000000'}`} style={phoneLinkStyle}>
              {restaurant.phone || '+225 07 00 00 00 00'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  paddingBottom: '24px'
};

const heroStyle = {
  position: 'relative',
  backgroundImage: 'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '260px',
  display: 'flex',
  alignItems: 'flex-end'
};

const heroOverlayStyle = {
  width: '100%',
  padding: '24px 18px',
  background: 'linear-gradient(to top, rgba(11, 17, 32, 0.92) 0%, rgba(11, 17, 32, 0.4) 70%, transparent 100%)',
  color: '#FFFFFF'
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(8px)',
  padding: '4px 10px',
  borderRadius: '20px',
  fontSize: '0.74rem',
  fontWeight: 700,
  marginBottom: '8px'
};

const heroTitleStyle = {
  fontSize: '1.8rem',
  fontWeight: 800,
  lineHeight: 1.15,
  marginBottom: '6px'
};

const heroSubtitleStyle = {
  fontSize: '0.86rem',
  color: '#E2E8F0',
  lineHeight: 1.4,
  marginBottom: '16px'
};

const heroActionsStyle = {
  display: 'flex',
  gap: '10px'
};

const promoSectionStyle = {
  padding: '0 16px'
};

const promoCardStyle = {
  padding: '18px',
  background: 'linear-gradient(135deg, var(--color-primary-surface) 0%, var(--color-secondary-surface) 100%)',
  border: '1.5px solid var(--color-secondary-light)'
};

const promoHeaderStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const promoTagStyle = {
  fontSize: '0.72rem',
  fontWeight: 800,
  color: 'var(--color-primary-dark)',
  textTransform: 'uppercase'
};

const promoTitleStyle = {
  fontSize: '1.15rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const promoDescStyle = {
  fontSize: '0.84rem',
  color: 'var(--text-secondary)'
};

const sectionStyle = {
  padding: '0 16px'
};

const sectionHeaderStyle = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  marginBottom: '14px'
};

const sectionTitleStyle = {
  fontSize: '1.2rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const sectionSubtitleStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)'
};

const seeAllButtonStyle = {
  fontSize: '0.84rem',
  fontWeight: 700,
  color: 'var(--color-primary)'
};

const dishesGridStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const infoSectionStyle = {
  padding: '0 16px'
};

const infoCardStyle = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const infoTitleStyle = {
  fontSize: '1.05rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  marginBottom: '4px'
};

const infoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '0.86rem',
  color: 'var(--text-secondary)'
};

const phoneLinkStyle = {
  color: 'var(--color-primary)',
  fontWeight: 700,
  textDecoration: 'none'
};
