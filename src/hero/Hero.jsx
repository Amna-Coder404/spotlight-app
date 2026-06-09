import React, { useEffect, useRef } from 'react'
import "./Hero.css";
import Typewriter from "typewriter-effect/dist/core";
import { MyButton } from '../button/Button';
import AOS from "aos";
import heroImg from "../assets/amna.png"

function Hero() {
  let typeRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Reset scroll on refresh
    window.scrollTo(0, 0);

    // Typewriter effect
    if (typeRef.current) {
      const typewriter = new Typewriter(typeRef.current, {
        loop: true,
        delay: 75,
      });

      typewriter
        .typeString("Hey I am Amna Ashraf!")
        .pauseFor(1000)
        .deleteAll()
        .typeString("A Passionate Web & Moblie Developer")
        .pauseFor(1000)
        .start();
    }

    // Particle background
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      let particlesArray = [];
      const numberOfParticles = 50;
      const mouse = { x: null, y: null, radius: 150 };

      window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
      });

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 5 + 1;
          this.speedX = Math.random() * 3 - 1.5;
          this.speedY = Math.random() * 3 - 1.5;
        }

        update() {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
          }
          if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
          }

          // Check mouse proximity
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            this.speedX = dx * 0.05;
            this.speedY = dy * 0.05;
          }
        }

        draw() {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }
      }

      function init() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
          particlesArray.push(new Particle());
        }
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update();
          particlesArray[i].draw();
        }
        requestAnimationFrame(animate);
      }

      init();
      animate();

      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
      });
    }

    //  IntersectionObserver to retrigger AOS when Hero comes back into view
    const heroEl = document.getElementById("hero");
    if (heroEl) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            AOS.refreshHard(); 
          }
        },
        { threshold: 0.4 } 
      );

      observer.observe(heroEl);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div>
      <section id='hero' className='hero-section'>
        <canvas ref={canvasRef} className="particle-canvas"></canvas>

        {/* Intro Section */}
        <div className="intro">
          <h1 ref={typeRef} className="typewriter-text"></h1>

          <h2 data-aos="fade-up" data-aos-delay="200" data-aos-once="false">
            Frontend Developer | React Enthusiast | Student
          </h2>

          <p
            className="intro-text"
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-once="false"
          >
            As a passionate front-end developer, I focus on creating modern, responsive,
            and user-friendly websites that blend clean design with smooth functionality.
            My goal is to turn ideas into interactive <strong>experiences</strong> that inspire and engage.
          </p>

          <div className="buttons">
            <MyButton
              data-aos="zoom-in"
              data-aos-delay="600"
              data-aos-once="false"
              onClick={() => {
                document.getElementById("project")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <i className="fas fa-rocket"></i> View my Work
            </MyButton>

            <MyButton
              data-aos="zoom-in"
              data-aos-delay="800"
              data-aos-once="false"
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <i className="fas fa-star"></i> Contact me
            </MyButton>
          </div>
        </div>

        {/* Intro Image */}
        <div className="intro-img" data-aos="zoom-in-up" data-aos-once="false">
          <img src={heroImg} alt="Amna Ashraf" />
        </div>
      </section>
    </div>
  )
}

export default Hero;
