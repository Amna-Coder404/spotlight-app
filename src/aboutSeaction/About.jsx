
import aboutImg from "../assets/amna-ashraf.png"
import "./about.css"


function About() {
  return (
    <>
      <section id='about' className='about-section'>
        <h1 className="about-title">

          <span className="col short"></span>
          <span className="col medium"></span>
          <span className="col tall"></span>
          About Me
          <span className="col tall"></span>
          <span className="col medium"></span>
          <span className="col short"></span>
        </h1>

        <div className="about-container">
          {/* Left side  */}

          <div className="about-img" data-aos="fade-right">
            <img src={aboutImg} alt="Amna" />
          </div>
          {/* Right side  */}
          <div className="about-text" data-aos="fade-left" >
            <h2>Who I am 😎</h2>

            <p>
              Hi! I’m <strong>Amna Ashraf</strong>, a passionate web and mobile app developer who enjoys building clean, responsive, and user-friendly digital experiences.

              My journey started around 2022–2023, and since then I’ve been continuously growing my skills by working on real-world projects and improving my problem-solving abilities.

              Right now, I’m working with <b>React</b> for web development and also exploring <b>React Native + Expo</b> for mobile app development. Alongside this, I’m learning backend development and modern UI/UX design as I move toward becoming a <strong>Full-Stack Developer</strong>.

              My goal is to grow into a skilled Software Engineer who can build complete applications across both web and mobile platforms.

              For me, coding 💻 is a combination of logic and creativity — every project feels like a new challenge where I can learn, experiment, and improve.

              Outside of development, I enjoy photography, exploring creative ideas, and learning new technologies that keep me motivated and curious 🚀. I also like spending time with friends and improving myself through new experiences.
            </p>

          </div>
        </div>
      </section>
    </>
  )
}

export default About
