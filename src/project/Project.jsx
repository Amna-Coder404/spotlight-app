import React, { useRef, useState } from "react";
import "./project.css";
import { motion } from "framer-motion";

import { webProjects, mobileProjects } from "../data/ProjectData";

function Project() {
  const constraintRef = useRef(null);

  const [activeTab, setActiveTab] = useState("web");

  const projects = activeTab === "web" ? webProjects : mobileProjects;

  return (
    <section id="project" className="project-section">
      <h1 className="project-title">My Projects</h1>

      {/* TOGGLE BUTTONS */}
      <div className="project-toggle">
        <button
          className={activeTab === "web" ? "active" : ""}
          onClick={() => setActiveTab("web")}
        >
          Web Projects
        </button>

        <button
          className={activeTab === "mobile" ? "active" : ""}
          onClick={() => setActiveTab("mobile")}
        >
          Mobile Projects
        </button>
      </div>

      {/* CAROUSEL */}
      <motion.div ref={constraintRef} className="carousel-wrapper">
        <motion.div
          className="inner-carousel"
          drag="x"
          dragConstraints={constraintRef}
          dragDirectionLock
          dragElastic={0.15}
          dragMomentum={false}
          style={{ touchAction: "pan-y" }}
        >
          {projects.map((project, index) => (
            <motion.div className="project-card" key={index}>
              <div className="card-image">
                <img src={project.img} alt="Project" />
              </div>

              <div className="card-buttons">
                {/* LIVE DEMO ONLY FOR WEB */}
                {activeTab === "web" && project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noreferrer"
                    className="btn live-btn"
                  >
                    Live Demo
                  </a>
                )}

                <a
                  href={project.code}
                  target="_blank"
                  rel="noreferrer"
                  className="btn code-btn"
                >
                  View Code
                </a>
              </div>
            </motion.div>
          ))}

          {/* SEE MORE ONLY FOR WEB */}
          {activeTab === "web" && (
            <motion.a
              href="https://my-project-list-nine.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="project-card see-more-card"
            >
              <div className="see-more-content">
                <span className="plus-icon">＋</span>
                <p>See more projects</p>
              </div>
            </motion.a>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Project;