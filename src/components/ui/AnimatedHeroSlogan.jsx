/**
 * Composant de slogan animé pour le Hero (AnimatedHeroSlogan).
 * Alterne les textes toutes les 10s avec transition fluide de droite à gauche et vague lumineuse séquentielle sur les mots.
 */

import React, { useState, useEffect } from 'react';

const SLOGANS = [
  'Restaurant, Garba et Bar',
  'Venez découvrir Chez ROGER BECKER'
];

export const AnimatedHeroSlogan = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLOGANS.length);
    }, 10000); // Remplacement toutes les 10 secondes

    return () => clearInterval(timer);
  }, []);

  const currentText = SLOGANS[currentIndex];
  const words = currentText.split(' ');

  return (
    <div key={currentIndex} className="slogan-slide" style={containerStyle}>
      {words.map((word, idx) => (
        <span
          key={`${currentIndex}-${idx}`}
          className="pulsing-word"
          style={{
            animationDelay: `${idx * 0.22}s`,
            marginRight: '0.32em'
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

const containerStyle = {
  fontSize: '0.94rem',
  fontWeight: 700,
  minHeight: '32px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  marginBottom: '16px',
  padding: '4px 0',
  overflow: 'visible'
};
