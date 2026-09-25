/**
 * Page d'accueil publique Chez Roger Becker.
 * Vitrine gastronomique mobile-first avec mise en avant des grillades et des offres.
 */

import React from 'react';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { DishCard } from '../../components/menu/DishCard';
import { Button } from '../../components/ui/Button';
import { AnimatedHeroSlogan } from '../../components/ui/AnimatedHeroSlogan';
import { PromoPopupModal } from '../../components/ui/PromoPopupModal';
import { HomePromoBanner } from './components/HomePromoBanner';
import bgHeroImg from '../../assets/images/bg.png';

export const HomePage = ({
  dishes = [],
  promotions = [],
  restaurant = {},
  onNavigate,
  onSelectDish
}) => {
  const availableDishes = dishes.filter((d) => d.isAvailable !== false);
  const featured = availableDishes.filter((d) => d.isFeatured);
  const popularDishes = featured.length > 0 ? featured.slice(0, 6) : availableDishes.slice(0, 6);
  const activePromo = promotions.find((p) => p && p.isActive !== false);

  const handlePromoAction = (promo) => {
    if (!promo) return;
    if (promo.dishId) {
      const target = typeof promo.dishId === 'object' ? promo.dishId : dishes.find((d) => d._id === promo.dishId);
      if (target && onSelectDish) onSelectDish(target);
      else onNavigate('menu');
    } else if (promo.link?.startsWith('http')) {
      window.open(promo.link, '_blank', 'noopener,noreferrer');
    } else if (promo.link) {
      onNavigate(promo.link.replace(/^\//, '') || 'menu');
    } else {
      onNavigate('menu');
    }
  };

  return (
    <div className="animate-fade-in" style={pageStyle}>
      {/* Pop-up publicitaire automatique d'accueil */}
      <PromoPopupModal
        promotions={promotions}
        onNavigate={onNavigate}
        onSelectDish={onSelectDish}
      />

      {/* 1. HERO BANNER */}
      <section style={heroStyle}>
        <div style={heroOverlayStyle}>
          <h2 style={heroTitleStyle}>Chez Roger Becker</h2>
          
          {/* Slogan animé alterné toutes les 10s avec mots pulsants */}
          <AnimatedHeroSlogan />

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
      <HomePromoBanner promo={activePromo} onAction={handlePromoAction} />

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
          {popularDishes.map((dish) => (
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
            <span>{restaurant.openingHours || 'Mardi – Dimanche : 11h00 – 23h00 (Fermé le lundi)'}</span>
          </div>
          <div style={infoRowStyle}>
            <MapPin size={18} color="var(--color-primary)" />
            <span>{restaurant.address || "Cocody Vallon, Rue des Jardins, Abidjan, Côte d'Ivoire"}</span>
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
  backgroundImage: `url(${bgHeroImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '270px',
  display: 'flex',
  alignItems: 'flex-end'
};

const heroOverlayStyle = {
  width: '100%',
  padding: '24px 18px',
  background: 'linear-gradient(to top, rgba(11, 17, 32, 0.94) 0%, rgba(11, 17, 32, 0.45) 75%, transparent 100%)',
  color: 'var(--color-primary-contrast, #FFFFFF)'
};

const heroTitleStyle = {
  fontSize: '1.8rem',
  fontWeight: 800,
  lineHeight: 1.15,
  marginBottom: '4px'
};

const heroActionsStyle = {
  display: 'flex',
  gap: '10px'
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
  color: 'var(--color-primary)',
  background: 'none',
  border: 'none',
  cursor: 'pointer'
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
