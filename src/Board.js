import React, { useState, useEffect } from 'react';
import './Board.css';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const boardMembers = [
  { id: 1, name: 'Brooke Foley', role: 'President', image: '/wistemweb/guest.png', bio: 'something about Brooke', contact: 'email | disc' },
  { id: 2, name: 'Siena Zerillo', role: 'President', image: '/wistemweb/guest.png', bio: 'something about Siena', contact: 'email | disc' },
  { id: 3, name: 'Anna Ekmekci', role: 'Head Webmaster', image: '/wistemweb/guest.png', bio: 'something about Anna', contact: 'email | disc' },
  { id: 4, name: 'Person 4', role: 'Role', image: '/wistemweb/guest.png', bio: 'Bio for Person 4', contact: 'email | disc' },
  { id: 5, name: 'Person 5', role: 'Role', image: '/wistemweb/guest.png', bio: 'Bio for Person 5', contact: 'email | disc' },
  { id: 6, name: 'Person 6', role: 'Role', image: '/wistemweb/guest.png', bio: 'Bio for Person 6', contact: 'email | disc' },
  { id: 7, name: 'Person 7', role: 'Role', image: '/wistemweb/guest.png', bio: 'Bio for Person 7', contact: 'email | disc' },
  { id: 8, name: 'Person 8', role: 'Role', image: '/wistemweb/guest.png', bio: 'Bio for Person 8', contact: 'email | disc' },
  { id: 9, name: 'Person 9', role: 'Role', image: '/wistemweb/guest.png', bio: 'Bio for Person 9', contact: 'email | disc' },
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
