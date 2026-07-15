import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const STORY_POINTS = [
  {
    title: "The broken grind",
    description: "Endlessly grinding random problems leads to memorization, not mastery. You forget dynamic programming the moment you stop practicing."
  },
  {
    title: "Pattern recognition",
    description: "Interviews aren't about solving 1000 problems. They are about recognizing 15 core patterns instantly. Revoraa forces you to internalize them."
  },
  {
    title: "Spaced repetition",
    description: "We use cognitive science to ensure you only practice what you're about to forget, maximizing retention with minimal daily effort."
  }
];

const FAQS = [
  {
    q: "What exactly is Revoraa?",
    a: "Revoraa is a personal interview operating system. It acts as your command center for tracking, organizing, and mastering data structures, algorithms, and system design concepts using spaced repetition."
  },
  {
    q: "Do I solve coding problems inside Revoraa?",
    a: "No. You continue solving problems on your preferred platforms. Revoraa works alongside them as your intelligent tracker and revision scheduler, ensuring you never forget the patterns you've learned."
  },
  {
    q: "How does the revision system work?",
    a: "When you log a problem, you rate its cognitive load (how hard it was to understand). Our algorithm then schedules it for review at the exact optimal interval to transition it into your long-term memory."
  },
  {
    q: "What information does Revoraa track?",
    a: "It tracks the specific problems you've solved, your perceived difficulty, the core patterns involved, your time spent, and your historical mastery of different algorithmic concepts."
  },
  {
    q: "Can I organize problems by topic or company?",
    a: "Yes. You can build custom folders, tag problems by specific data structures, or organize them into targeted company-specific interview prep decks."
  },
  {
    q: "Is Revoraa free?",
    a: "Revoraa is currently in a closed beta phase and is completely free for our early adopters."
  },
  {
    q: "Will AI features be available?",
    a: "Yes. We are building AI integrations that will analyze your weak points and generate personalized mock interviews and targeted study guides."
  },
  {
    q: "Who is Revoraa built for?",
    a: "It's built for ambitious software engineers who are tired of endlessly grinding random problems and want a structured, data-driven approach to interview preparation."
  }
];

// ─── Individual accordion card — its own glass surface ───────────────────────
const AccordionCard = ({ faq, isOpen, onClick, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.055, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        background: isOpen
          ? 'rgba(255,255,255,0.055)'
          : hovered
            ? 'rgba(255,255,255,0.04)'
            : 'rgba(255,255,255,0.022)',
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        border: `1px solid ${
          isOpen
            ? 'rgba(245, 158, 11, 0.22)'
            : hovered
              ? 'rgba(245, 158, 11, 0.10)'
              : 'rgba(255,255,255,0.07)'
        }`,
        boxShadow: isOpen
          ? '0 8px 32px rgba(0,0,0,0.26), 0 2px 8px rgba(0,0,0,0.14), inset 0 0 0 0.5px rgba(245,158,11,0.08)'
          : hovered
            ? '0 4px 20px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.09)'
            : '0 2px 8px rgba(0,0,0,0.10)',
        transform: hovered && !isOpen ? 'translateY(-2px)' : 'translateY(0px)',
        transition: 'border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease, transform 0.22s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Per-card amber glow when open */}
      {isOpen && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {/* Question button */}
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.35rem 1.75rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          outline: 'none',
          position: 'relative',
          zIndex: 1,
          minHeight: 72,
          gap: '1.25rem',
        }}
      >
        <span
          style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.35,
            flex: 1,
            color: isOpen ? '#f59e0b' : 'var(--color-text-primary)',
            transition: 'color 0.2s ease',
          }}
        >
          {faq.q}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.30, ease: [0.16, 1, 0.3, 1] }}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: isOpen ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.045)',
            border: `1px solid ${isOpen ? 'rgba(245,158,11,0.28)' : 'rgba(255,255,255,0.09)'}`,
            color: isOpen ? '#f59e0b' : 'var(--color-text-muted)',
            transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
          }}
        >
          <ChevronDown size={16} strokeWidth={2.5} />
        </motion.div>
      </button>

      {/* Answer — smooth height + fade */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.26, ease: 'easeOut' },
            }}
            style={{ overflow: 'hidden', position: 'relative', zIndex: 1 }}
          >
            <p
              style={{
                margin: 0,
                padding: '0 1.75rem 1.65rem',
                fontSize: '1rem',
                lineHeight: 1.78,
                color: 'var(--color-text-secondary)',
                letterSpacing: '-0.005em',
              }}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
export const LandingStoryFAQ = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);

  return (
    <div style={{ position: 'relative', zIndex: 10, background: 'transparent' }}>

      {/* ── STORY SECTION ─────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '8rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', marginBottom: '5rem' }}
          >
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}>
              We built the tool we <br />
              <span style={{ color: '#f59e0b' }}>wished we had.</span>
            </h2>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1.15rem',
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              The traditional interview prep cycle is fundamentally broken. It
              rewards rote memorization over deep understanding. We created
              Revoraa to fix that.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            {STORY_POINTS.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="gemini-glass"
                style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div style={{
                  width: 40, height: 40,
                  borderRadius: '12px',
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#f59e0b', fontSize: '1.25rem', fontWeight: 700,
                  marginBottom: '0.5rem',
                }}>
                  0{idx + 1}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                  {point.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── FAQ SECTION ───────────────────────────────────────────────────── */}
      <section
        id="faq"
        style={{
          position: 'relative',
          padding: 'clamp(6rem, 10vw, 10rem) 1.5rem clamp(7rem, 12vw, 12rem)',
          overflow: 'hidden',
        }}
      >
        {/* Section-level ambient amber mesh (extremely low opacity) */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            background: 'radial-gradient(ellipse 70% 55% at 50% 15%, rgba(245,158,11,0.045) 0%, transparent 100%)',
            filter: 'blur(70px)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>

          {/* Heading block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', marginBottom: '4.5rem' }}
          >
            <h2 style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              marginBottom: '1rem',
            }}>
              Questions Before You Start
            </h2>
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              maxWidth: 460,
              margin: '0 auto',
              letterSpacing: '-0.01em',
            }}>
              Everything you need to know before using Revoraa.
            </p>
          </motion.div>

          {/* Individual glass cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FAQS.map((faq, i) => (
              <AccordionCard
                key={i}
                faq={faq}
                index={i}
                isOpen={openFaqIndex === i}
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? -1 : i)}
              />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
