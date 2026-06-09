import React, { useEffect, useRef, useState } from "react";
import "./Skill.css";

import { webSkill, moblieSkill } from "../data/SkillData";

import "aos/dist/aos.css";

function Skill() {
  const [activeTab, setActiveTab] = useState("web"); // 👈 NEW STATE

  const progressBarsRef = useRef([]);

  const data = activeTab === "web" ? webSkill : moblieSkill;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            bar.style.width = bar.getAttribute("data-level") + "%";
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.5 }
    );

    progressBarsRef.current.forEach((bar) => {
      if (bar) observer.observe(bar);
    });

    return () => {
      progressBarsRef.current.forEach((bar) => {
        if (bar) observer.unobserve(bar);
      });
    };
  }, [activeTab]); // 👈 re-run when tab changes

  const getLevelText = (level) => {
    if (level >= 90) return "Advanced";
    if (level >= 75) return "Proficient";
    return "Intermediate";
  };

  return (
    <section id="skill" className="skill-section">
      <h1 className="skill-title">
        <span className="col short"></span>
        <span className="col medium"></span>
        <span className="col tall"></span>
        My Skills
        <span className="col tall"></span>
        <span className="col medium"></span>
        <span className="col short"></span>
      </h1>

      {/* 👇 TOGGLE BUTTONS */}
      <div className="skill-toggle">
        <button
          className={activeTab === "web" ? "active" : ""}
          onClick={() => setActiveTab("web")}
        >
          Web Skills
        </button>

        <button
          className={activeTab === "mobile" ? "active" : ""}
          onClick={() => setActiveTab("mobile")}
        >
          Mobile Skills
        </button>
      </div>

      <div className="skill-grid">
        {data.map((skill, index) => (
          <div
            data-aos="fade-up"
            data-aos-delay={index * 100}
            className="skill-card"
            key={skill.name}
          >
            <div className="skill-icon">
              <img src={skill.icon} alt={skill.name} />
            </div>

            <h3>{skill.name}</h3>
            <p>{skill.desc}</p>

            <div className="skill-progress">
              <div
                ref={(el) => (progressBarsRef.current[index] = el)}
                className="skill-progress-bar"
                data-level={skill.level}
              ></div>
            </div>

            <div className="skill-level">
              {getLevelText(skill.level)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skill;