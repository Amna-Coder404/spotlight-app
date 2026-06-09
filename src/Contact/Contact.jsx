import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { MyButton } from "../button/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../footer/Footer";
import MagicButton from "../MagicButton/MagicButton";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Contact.css";

function Contact() {
  const [showMagic, setShowMagic] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    msg: "",
  });

  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔹 Main email params (to you)
    const mainEmailParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.msg,
    };

    emailjs
      .send(
        "service_4v4s31d",
        "template_6txi5km",
        mainEmailParams,
        "gf9OfKiAGstx0sCiv"
      )
      .then(() => {
        toast.success("Message sent successfully!", { autoClose: 3000 });

        // 🔹 Auto-reply params (to visitor)
        const autoReplyParams = {
          from_name: formData.name,
          to_email: formData.email,
          message: formData.msg,
        };

        emailjs
          .send(
            "service_4v4s31d",
            "template_qqh7s67", 
            autoReplyParams,
            "gf9OfKiAGstx0sCiv"
          )
          .then(() => {
            console.log("Auto-reply sent successfully");
          })
          .catch((err) => {
            console.error("Auto-reply error:", err);
            toast.error("Auto-reply failed.", { autoClose: 3000 });
          });

        setFormData({ name: "", email: "", msg: "" });
      })
      .catch(() => {
        toast.error("Failed to send message. Try again.", {
          autoClose: 3000,
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />

      <section id="contact" className="contact-section">
        <h1 className="contact-title">🤙 Contact me 😉</h1>

        <div className="contact-container">
          {/* Left Side */}
          <div className="follow" data-aos="fade-right">
            <h1>Let's build something together</h1>
            <p>
              If you have any questions or would like to collaborate, feel free
              to contact me.
            </p>

            <h2 data-aos="fade-up">Follow me on:</h2>
            <ul data-aos="zoom-in" data-aos-delay="200">
              <li>
                <a href="https://github.com/Amna-Coder404" aria-label="GitHub">
                  <i className="fab fa-github"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/amna-coder200/"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </li>
            
            </ul>

            <div className="magic-container">
              {!showMagic && (
                <MyButton onClick={() => setShowMagic(true)}>
                  See Magic
                </MyButton>
              )}
              {showMagic && <MagicButton onClose={() => setShowMagic(false)} />}
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} data-aos="fade-left">
            <div className="formContent">
              <h2 className="form-title">Contact Me</h2>

              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label>Name *</label>
              </div>

              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label>Email *</label>
              </div>

              <div className="input-group">
                <textarea
                  name="msg"
                  rows="4"
                  value={formData.msg}
                  onChange={handleChange}
                  required
                />
                <label>Message *</label>
              </div>

              <MyButton type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </MyButton>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Contact;
