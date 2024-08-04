import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import './Archive.css';

const archiveItems = [
  { id: 1, image: '/wistemweb/library.png', title: 'Teaching in Libraries', description: 'Introduced elementary and middle school students to subjects ranging from isolating DNA to programming Python terminal games in hopes of sparking passion for STEM amongst the younger generation.' },
  { id: 2, image: '/wistemweb/presentations.png', title: 'Presentations', description: 'Created slide show presentations throughout the year about areas of interest to educate others.' },
  { id: 3, image: '/wistemweb/garticphone.png', title: 'Fun + Games!', description: 'Played a Kahoot about successful women in STEM to inspire club members and learn more about contributions from females and gender minorities to various fields along with an interesting Gartic Phone game.' },
  { id: 4, image: '/wistemweb/bakesale.png', title: 'Bakesale', description: 'Sold baked goods to raise funds for future club activities and advertise WiSTEM with treats!' },
  { id: 5, image: '/wistemweb/karaoke.png', title: 'Karaoke Event', description: 'Singing to popular songs as a fun bonding experience for the club in early November.' },
  { id: 6, image: '/wistemweb/roses.png', title: 'Valentine\'s Day Roses', description: 'Sold crocheted roses for Valentine\'s Day at BCA with the hard work of our club members.' },
  // Add more items as needed
];

const Archive = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = containerRef.current.querySelectorAll('.archive-item');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="archive-page">
      <Navbar />
      <h1 className="archive-title">Past Years</h1>
      <div className="archive-container" ref={containerRef}>
        {archiveItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={`archive-item ${index % 2 === 0 ? 'left' : 'right'} ${!item.image ? 'no-image' : ''}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {item.image && (
              <div className="archive-image">
                <img src={item.image} alt={item.title} />
              </div>
            )}
            <div className="archive-text">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Archive;