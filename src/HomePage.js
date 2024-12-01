import React, { useState, useEffect } from 'react';
import './HomePage.css';
import Navbar from './Navbar';
import { Link } from 'react-router-dom'; 

const BCAWiSTEMHomepage = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
      const handleScroll = () => {
        setScrollPosition(window.pageYOffset);
      };
    
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const handleDiscordClick = () => {
      window.open('https://discord.gg/wMzMTFga', '_blank', 'noopener,noreferrer');
    };
    
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrollPosition(window.pageYOffset);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const isInView = 
          scrollPosition > sectionTop - window.innerHeight / 2 && 
          scrollPosition < sectionTop + sectionHeight - window.innerHeight / 2;
  
        if (isInView) {
          section.classList.add('active');
          const popIns = section.querySelectorAll('.pop-in');
          popIns.forEach((popIn, index) => {
            setTimeout(() => {
              popIn.classList.add('active');
            }, index * 200);
          });
        } else {
          section.classList.remove('active');
          const popIns = section.querySelectorAll('.pop-in');
          popIns.forEach((popIn) => {
            popIn.classList.remove('active');
          });
        }
      });
    };
  
    handleScroll(); 
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollPosition]);

  return (
    <div className="container">
      <Navbar />

      <section id="home" className="section">
        <h1>BCA WiSTEM</h1>
        <h2>Empowering Women in Science, Technology, Engineering, and Mathematics</h2>
        {/* <button className="cta-button">Interest Form!</button> */}
      </section>

      <section id="about" className="section">
        <h2>About Us</h2>
        <div className="content">
          <div className="pop-in">
            <p>BCA WiSTEM is dedicated to fostering a supportive community for women in STEM fields. We aim to inspire, educate, and empower the next generation of female scientists, technologists, engineers, and mathematicians.</p>
          </div>
        </div>
      </section>

     

      <section id="contact" className="section">
        <h2>Get in Touch</h2>
        <div className="content">
        <div className="pop-in">
            <p>
              Have questions? Reach out to any of our{' '}
              <Link to="/board" className="board-link">
                board members
              </Link>
              !
            </p>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default BCAWiSTEMHomepage;