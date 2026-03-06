"use client";

import { useEffect, useState } from "react";

export default function MaintenancePage() {
  const [progress, setProgress] = useState(0);
  const [smokeParticles, setSmokeParticles] = useState([]);
  const [time, setTime] = useState("");

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 87) return 87;
        return prev + 1;
      });
    }, 40);

    // Generate smoke particles
    const particles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${30 + Math.random() * 20}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 2}s`,
      size: `${6 + Math.random() * 10}px`,
    }));
    setSmokeParticles(particles);

    // Clock
    const clockInterval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Libre Baskerville', serif;
          background: #1a0f0a;
          color: #f0e6d3;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2rem;
          background:
            radial-gradient(ellipse at 20% 80%, rgba(139,69,19,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(180,100,30,0.1) 0%, transparent 50%),
            #1a0f0a;
        }

        /* Paper texture overlay */
        .page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        .railway-border {
          position: fixed;
          inset: 16px;
          border: 2px solid rgba(180,130,60,0.25);
          pointer-events: none;
          z-index: 10;
        }

        .railway-border::before {
          content: '';
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(180,130,60,0.12);
        }

        /* Corner ornaments */
        .corner {
          position: fixed;
          width: 40px;
          height: 40px;
          z-index: 11;
          pointer-events: none;
        }
        .corner-tl { top: 10px; left: 10px; border-top: 2px solid #b4823c; border-left: 2px solid #b4823c; }
        .corner-tr { top: 10px; right: 10px; border-top: 2px solid #b4823c; border-right: 2px solid #b4823c; }
        .corner-bl { bottom: 10px; left: 10px; border-bottom: 2px solid #b4823c; border-left: 2px solid #b4823c; }
        .corner-br { bottom: 10px; right: 10px; border-bottom: 2px solid #b4823c; border-right: 2px solid #b4823c; }

        .content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 680px;
          width: 100%;
          animation: fadeInUp 1s ease forwards;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .eyebrow {
          font-size: 0.65rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #b4823c;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .eyebrow::before, .eyebrow::after {
          content: '';
          width: 50px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #b4823c, transparent);
        }

        /* Train Illustration */
        .train-scene {
          position: relative;
          width: 280px;
          height: 120px;
          margin-bottom: 2.5rem;
        }

        .track {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 12px;
        }

        .rail {
          position: absolute;
          height: 3px;
          background: #6b4c2a;
          border-radius: 2px;
          left: 0; right: 0;
        }
        .rail-top { bottom: 8px; }
        .rail-bottom { bottom: 2px; }

        .sleeper {
          position: absolute;
          width: 16px;
          height: 10px;
          background: #4a2e12;
          border-radius: 1px;
          bottom: 1px;
        }

        .train {
          position: absolute;
          bottom: 10px;
          left: 30px;
          animation: trainRock 3s ease-in-out infinite;
        }

        @keyframes trainRock {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-1px) rotate(0.3deg); }
          75% { transform: translateY(-1px) rotate(-0.3deg); }
        }

        .engine {
          position: relative;
          display: flex;
          align-items: flex-end;
          gap: 2px;
        }

        .boiler {
          width: 100px;
          height: 44px;
          background: linear-gradient(135deg, #5c3317 0%, #3d2008 60%, #2a1505 100%);
          border-radius: 22px 8px 8px 22px;
          position: relative;
          border: 1.5px solid #8b5e30;
          box-shadow: inset 0 2px 4px rgba(255,200,100,0.1), 0 4px 12px rgba(0,0,0,0.5);
        }

        .boiler::after {
          content: '';
          position: absolute;
          top: 8px; left: 12px; right: 16px; height: 6px;
          background: rgba(255,180,60,0.15);
          border-radius: 3px;
        }

        .cab {
          width: 52px;
          height: 52px;
          background: linear-gradient(160deg, #4a2a10, #2a1505);
          border-radius: 4px 4px 0 0;
          position: relative;
          border: 1.5px solid #7a4e25;
          border-bottom: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }

        .cab-window {
          position: absolute;
          top: 10px; left: 8px;
          width: 18px; height: 14px;
          background: rgba(255,200,80,0.2);
          border-radius: 2px;
          border: 1px solid #b4823c;
          box-shadow: inset 0 0 6px rgba(255,200,80,0.3);
          animation: windowGlow 2s ease-in-out infinite alternate;
        }

        @keyframes windowGlow {
          from { background: rgba(255,180,60,0.15); box-shadow: inset 0 0 6px rgba(255,180,60,0.2); }
          to { background: rgba(255,220,80,0.3); box-shadow: inset 0 0 10px rgba(255,200,80,0.5); }
        }

        .chimney {
          position: absolute;
          top: -18px;
          left: 18px;
          width: 14px;
          height: 22px;
          background: linear-gradient(to bottom, #3d2008, #2a1505);
          border-radius: 4px 4px 0 0;
          border: 1.5px solid #7a4e25;
          border-bottom: none;
        }

        .chimney::before {
          content: '';
          position: absolute;
          top: -4px; left: -3px;
          width: 20px; height: 6px;
          background: #2a1505;
          border-radius: 3px;
          border: 1.5px solid #8b5e30;
        }

        .wheel {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #8b5e30, #3d2008);
          border: 2px solid #b4823c;
          animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .wheel::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 6px; height: 6px;
          background: #b4823c;
          border-radius: 50%;
        }

        .wheel-lg { width: 30px; height: 30px; bottom: -6px; }
        .w1 { left: 18px; }
        .w2 { left: 54px; }
        .w3 { left: 90px; }
        .wheel-sm { width: 20px; height: 20px; bottom: -2px; }
        .ws1 { left: 6px; }

        /* Coffee cup on tender */
        .cup {
          width: 32px;
          height: 28px;
          background: linear-gradient(160deg, #7a4e25, #3d2008);
          border-radius: 0 0 6px 6px;
          position: absolute;
          bottom: 10px;
          right: -38px;
          border: 1.5px solid #b4823c;
        }
        .cup::before {
          content: '';
          position: absolute;
          top: -4px; left: 0; right: 0;
          height: 4px;
          background: #5c3317;
          border-radius: 2px;
          border: 1px solid #b4823c;
        }
        .cup-handle {
          position: absolute;
          right: -10px;
          top: 6px;
          width: 10px;
          height: 14px;
          border: 2px solid #b4823c;
          border-left: none;
          border-radius: 0 6px 6px 0;
        }

        /* Smoke */
        .smoke-container {
          position: absolute;
          top: -50px;
          left: 28px;
          width: 60px;
          height: 60px;
        }

        .smoke-puff {
          position: absolute;
          border-radius: 50%;
          background: rgba(200,180,150,0.25);
          animation: smokeRise var(--dur) var(--delay) ease-out infinite;
        }

        @keyframes smokeRise {
          0% { transform: translateY(0) scale(0.3); opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { transform: translateY(-55px) translateX(8px) scale(1.8); opacity: 0; }
        }

        /* Heading */
        .headline {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(2.8rem, 8vw, 4.5rem);
          line-height: 1;
          letter-spacing: -0.02em;
          color: #f0e6d3;
          margin-bottom: 0.3rem;
        }

        .headline span {
          color: #b4823c;
          display: block;
          font-style: italic;
          font-size: 0.7em;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.8rem 0;
          width: 100%;
          max-width: 400px;
        }
        .divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #b4823c55, transparent); }
        .divider-icon { color: #b4823c; font-size: 1rem; }

        .description {
          font-size: 1rem;
          line-height: 1.8;
          color: #c4aa85;
          max-width: 460px;
          font-style: italic;
          margin-bottom: 2.5rem;
        }

        /* Progress */
        .progress-section {
          width: 100%;
          max-width: 420px;
          margin-bottom: 2.5rem;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.7rem;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8a6a40;
        }

        .progress-label strong { color: #b4823c; font-family: 'Playfair Display', serif; font-size: 1rem; }

        .progress-track {
          height: 6px;
          background: rgba(180,130,60,0.15);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #6b3a10, #b4823c, #d4a855);
          border-radius: 3px;
          transition: width 0.1s linear;
          position: relative;
        }

        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 30px; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,220,120,0.6));
          animation: shimmer 1.5s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Info tiles */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          width: 100%;
          max-width: 420px;
          margin-bottom: 2.5rem;
        }

        .info-tile {
          background: rgba(180,130,60,0.07);
          border: 1px solid rgba(180,130,60,0.2);
          border-radius: 6px;
          padding: 1rem 1.2rem;
          text-align: left;
        }

        .tile-label {
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8a6a40;
          margin-bottom: 0.3rem;
        }

        .tile-value {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          color: #d4b07a;
        }

        /* Contact */
        .contact-line {
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          color: #6a5035;
          border-top: 1px solid rgba(180,130,60,0.15);
          padding-top: 1.5rem;
          width: 100%;
          max-width: 420px;
        }

        .contact-line a {
          color: #b4823c;
          text-decoration: none;
          border-bottom: 1px solid rgba(180,130,60,0.4);
          transition: color 0.2s;
        }
        .contact-line a:hover { color: #d4a855; }

        .logo-mark {
          font-family: 'Playfair Display', serif;
          font-size: 0.8rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(180,130,60,0.5);
          margin-bottom: 3rem;
        }

        @media (max-width: 480px) {
          .info-grid { grid-template-columns: 1fr; }
          .train-scene { width: 220px; }
          .boiler { width: 76px; }
        }
      `}</style>

      {/* Frame */}
      <div className="railway-border" />
      <div className="corner corner-tl" />
      <div className="corner corner-tr" />
      <div className="corner corner-bl" />
      <div className="corner corner-br" />

      <div className="page">
        <div className="content">

          <div className="logo-mark">✦ TrainCafe ✦</div>

          <div className="eyebrow">Platform Notice</div>

          {/* Train Illustration */}
          <div className="train-scene">
            {/* Smoke */}
            <div className="smoke-container">
              {[
                { w: 14, h: 14, l: 0, t: 30, dur: "2.4s", del: "0s" },
                { w: 10, h: 10, l: 8, t: 35, dur: "2s", del: "0.6s" },
                { w: 12, h: 12, l: -4, t: 32, dur: "2.8s", del: "1.2s" },
                { w: 8,  h: 8,  l: 12, t: 38, dur: "1.8s", del: "1.8s" },
              ].map((p, i) => (
                <div
                  key={i}
                  className="smoke-puff"
                  style={{
                    width: p.w, height: p.h,
                    left: p.l, top: p.t,
                    "--dur": p.dur,
                    "--delay": p.del,
                  }}
                />
              ))}
            </div>

            <div className="train">
              <div className="engine">
                {/* Cab */}
                <div className="cab">
                  <div className="cab-window" />
                  <div className="wheel wheel-sm ws1" style={{ animationDuration: "1.2s" }} />
                </div>

                {/* Boiler */}
                <div className="boiler">
                  <div className="chimney" />
                  <div className="wheel wheel-lg w1" />
                  <div className="wheel wheel-lg w2" />
                  <div className="wheel wheel-lg w3" />
                </div>

                {/* Coffee cup on tender */}
                <div className="cup">
                  <div className="cup-handle" />
                </div>
              </div>
            </div>

            {/* Track */}
            <div className="track">
              <div className="rail rail-top" />
              <div className="rail rail-bottom" />
              {[0,20,40,60,80,100,120,140,160,180,200,220,240,260].map((l) => (
                <div key={l} className="sleeper" style={{ left: l }} />
              ))}
            </div>
          </div>

          <h1 className="headline">
            Under<span>Maintenance</span>
          </h1>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-icon">☕</span>
            <div className="divider-line" />
          </div>

          <p className="description">
            Hamara platform thodi der ke liye station par ruka hua hai.
            Hum kuch naya aur behtar leke aa rahe hain — grab a cup of chai
            aur thoda intezaar karein.
          </p>

          {/* Progress */}
          <div className="progress-section">
            <div className="progress-label">
              <span>Kaam chal raha hai...</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Info tiles */}
          <div className="info-grid">
            <div className="info-tile">
              <div className="tile-label">Estimated Time</div>
              <div className="tile-value">Kuch ghante</div>
            </div>
            <div className="info-tile">
              <div className="tile-label">Live Clock</div>
              <div className="tile-value">{time || "Loading..."}</div>
            </div>
            <div className="info-tile">
              <div className="tile-label">Status</div>
              <div className="tile-value">🔧 In Progress</div>
            </div>
            <div className="info-tile">
              <div className="tile-label">Next Stop</div>
              <div className="tile-value">Back Soon</div>
            </div>
          </div>

          <div className="contact-line">
            Koi urgent kaam ho toh humse milein:{" "}
            <a href="mailto:support@traincafe.in">support@traincafe.in</a>
          </div>

        </div>
      </div>
    </>
  );
}