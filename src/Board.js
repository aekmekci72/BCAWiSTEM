import React, { useState, useEffect } from 'react';
import './Board.css';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const boardMembers = [
  { id: 1, name: 'Brooke Foley', role: 'President', image: '/guest.png',  contact: 'brofol26@bergen.org' },
  { id: 2, name: 'Siena Zerillo', role: 'President', image: '/guest.png', contact: 'siezer26@bergen.org' },
  { id: 3, name: 'Alyson L.', role: 'Vice President', image: '/guest.png', contact: 'email@bergen.org' },
  { id: 4, name: 'Claire S.', role: 'Vice President', image: '/guest.png', contact: 'email@bergen.org' },
  { id: 5, name: 'Shuohan P.', role: 'Secretary', image: '/guest.png', contact: 'email@bergen.org' },
  { id: 6, name: 'Anna Ekmekci', role: 'Head Webmaster', image: '/guest.png', contact: 'annekm26@bergen.org' },
  { id: 7, name: 'Steffia G.', role: 'Webmaster', image: '/guest.png', contact: 'email@bergen.org' },
  { id: 8, name: 'Scarlett O.', role: 'Treasurer', image: '/guest.png', contact: 'email@bergen.org' },
  { id: 9, name: 'Aubrey D.', role: 'Director of Design', image: '/guest.png', contact: 'email@bergen.org' },
];


const MeetTheBoard = () => {
  const [flippedCard, setFlippedCard] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const section = document.querySelector('.meet-the-board');
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (
      scrollPosition > sectionTop - window.innerHeight / 2 &&
      scrollPosition < sectionTop + sectionHeight - window.innerHeight / 2
    ) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  }, [scrollPosition]);

  const handleCardClick = (id) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  return (
    <div>
      <Navbar />
      <section className="meet-the-board">
        <h2>Meet the Board</h2>
        <div className="character-grid">
          {boardMembers.map((member) => (
            <motion.div
              key={member.id}
              className={`character-card ${flippedCard === member.id ? 'flipped' : ''}`}
              onClick={() => handleCardClick(member.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="character-card-inner">
                <div className="character-card-front">
                  <img src={member.image} alt={member.name} />
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
                <div className="character-card-back">
                  <h3>{member.name}</h3>
                  <p className="contact">{member.contact}</p>
                  <p className="bio">{member.bio}</p>
                  
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MeetTheBoard;
