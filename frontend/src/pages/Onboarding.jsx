import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, ArrowLeft, Building, Monitor, Briefcase, GraduationCap, Trophy } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../lib/dataService';

const steps = [
  { id: 'welcome', title: 'Welcome to Revoraa' },
  { id: 'goal', title: 'Preparation Goal' },
  { id: 'companies', title: 'Target Companies' },
  { id: 'level', title: 'Current Level' },
  { id: 'time', title: 'Daily Study Time' },
  { id: 'solved', title: 'Problems Solved' },
    { id: 'plans', title: 'Choose Your Plan' },
  { id: 'generating', title: 'Generating Roadmap' },
];

const GeneratingRoadmap = ({ goal }) => {
  const [loadStep, setLoadStep] = useState(0);

  useEffect(() => {
    const intervals = [
      setTimeout(() => setLoadStep(1), 350), // ✓ Creating your workspace...
      setTimeout(() => setLoadStep(2), 700), // ✓ Personalizing your roadmap...
      setTimeout(() => setLoadStep(3), 1050),// ✓ Preparing your dashboard...
      setTimeout(() => setLoadStep(4), 1400) // Done
    ];
    return () => intervals.forEach(clearTimeout);
  }, []);

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.div key="step6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', margin: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
        <AnimatePresence>
          <motion.div key="step-0" variants={variants} initial="initial" animate="animate" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: loadStep >= 0 ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)' }}>
            <CheckCircle2 size={20} color={loadStep >= 0 ? 'var(--color-primary)' : 'transparent'} /> 
            <span style={{ fontWeight: 600 }}>Creating your workspace...</span>
          </motion.div>
          {loadStep >= 1 && (
            <motion.div key="step-1" variants={variants} initial="initial" animate="animate" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: loadStep >= 1 ? 'var(--color-revision)' : 'rgba(255,255,255,0.2)' }}>
              <CheckCircle2 size={20} color={loadStep >= 1 ? 'var(--color-revision)' : 'transparent'} /> 
              <span style={{ fontWeight: 600 }}>Personalizing your roadmap...</span>
            </motion.div>
          )}
          {loadStep >= 2 && (
            <motion.div key="step-2" variants={variants} initial="initial" animate="animate" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: loadStep >= 2 ? 'var(--color-readiness)' : 'rgba(255,255,255,0.2)' }}>
              <CheckCircle2 size={20} color={loadStep >= 2 ? 'var(--color-readiness)' : 'transparent'} /> 
              <span style={{ fontWeight: 600 }}>Preparing your dashboard...</span>
            </motion.div>
          )}
          {loadStep >= 3 && (
            <motion.div key="step-3" variants={variants} initial="initial" animate="animate" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff', marginTop: '1rem', justifyContent: 'center' }}>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-primary)' }}>Done</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const Onboarding = () => {
  const { user, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Selections
  const [goal, setGoal] = useState('');
  const [companies, setCompanies] = useState([]);
  const [level, setLevel] = useState('');
  const [time, setTime] = useState('');
  const [solved, setSolved] = useState('');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  useEffect(() => {
    let timer;
    if (currentStep === 6) {
      // Update the database first
      const completeOnboarding = async () => {
        try {
          if (user?.id) {
            await updateProfile(user.id, { has_completed_onboarding: true });
            await refreshProfile();
          }
        } catch (e) {
          console.error('Failed to complete onboarding', e);
        }
        timer = setTimeout(() => {
          if (formData.plan === 'free') {
            navigate('/dashboard');
          } else {
            navigate('/pricing');
          }
        }, 1400);
      };
      completeOnboarding();
    }
    return () => clearTimeout(timer);
  }, [currentStep, navigate, user, refreshProfile]);

  const toggleCompany = (company) => {
    setCompanies(prev => 
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    );
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <AuthLayout>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        
        {/* Progress Indicator */}
        {currentStep > 0 && currentStep < 6 && (
          <div style={{ position: 'absolute', top: '2rem', left: '0', right: '0', display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {[1,2,3,4,5].map(step => (
                <React.Fragment key={step}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, background: currentStep >= step ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)', color: currentStep >= step ? '#fff' : 'var(--color-text-muted)', border: `1px solid ${currentStep >= step ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`, transition: 'all 0.3s' }}>
                    {step}
                  </div>
                  {step < 5 && <div style={{ width: 30, height: 2, background: currentStep > step ? 'var(--color-primary)' : 'var(--color-border-subtle)', transition: 'all 0.3s' }} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <motion.div
          layout
          style={{
            width: '100%',
            maxWidth: '600px',
            background: 'var(--color-bg-glass)',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: 'var(--shadow-lg), 0 20px 40px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Welcome */}
            {currentStep === 0 && (
              <motion.div key="step0" variants={variants} initial="initial" animate="animate" exit="exit" style={{ textAlign: 'center', margin: 'auto' }}>
                <div style={{ display: 'inline-flex', width: 64, height: 64, borderRadius: 16, background: 'var(--color-primary)', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 8px 30px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}>
                  <Sparkles size={32} color="#fff" />
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Welcome to Revoraa</h1>
                <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '3rem' }}>We're going to build a personalized roadmap to get you interview-ready. Let's get started.</p>
                <button className="btn btn-primary" onClick={nextStep} style={{ padding: '1rem 3rem', fontSize: '1.05rem', borderRadius: '12px' }}>
                  Let's go <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                </button>
              </motion.div>
            )}

            {/* Step 2: Goal */}
            {currentStep === 1 && (
              <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>What is your primary goal?</h2>
                <p className="text-secondary text-sm" style={{ marginBottom: '2rem' }}>This helps us tailor your problem selection and roadmap.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                  {[
                    { id: 'Internship', icon: GraduationCap, color: 'var(--color-primary)' },
                    { id: 'Product Company', icon: Briefcase, color: 'var(--color-revision)' },
                    { id: 'FAANG', icon: Building, color: 'var(--color-readiness)' },
                    { id: 'Competitive Programming', icon: Trophy, color: 'var(--color-achievement)' },
                    { id: 'Daily DSA', icon: Monitor, color: 'var(--color-mission)' }
                  ].map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setGoal(item.id)}
                      style={{ padding: '1rem', border: `1.5px solid ${goal === item.id ? item.color : 'var(--color-border-subtle)'}`, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', background: goal === item.id ? `color-mix(in srgb, ${item.color} 5%, transparent)` : 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}
                    >
                      <item.icon size={20} color={goal === item.id ? item.color : 'var(--color-text-muted)'} />
                      <span style={{ fontWeight: 600, flex: 1 }}>{item.id}</span>
                      {goal === item.id && <CheckCircle2 size={18} color={item.color} />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Companies */}
            {currentStep === 2 && (
              <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Which companies are you targeting?</h2>
                <p className="text-secondary text-sm" style={{ marginBottom: '2rem' }}>Select all that apply.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1 }}>
                  {['Amazon', 'Google', 'Microsoft', 'Meta', 'Adobe', 'Uber', 'Atlassian', 'Flipkart'].map(company => (
                    <div 
                      key={company} 
                      onClick={() => toggleCompany(company)}
                      style={{ padding: '1rem', border: `1px solid ${companies.includes(company) ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: companies.includes(company) ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s', fontWeight: 600 }}
                    >
                      {company}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Level */}
            {currentStep === 3 && (
              <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>What is your current DSA level?</h2>
                <p className="text-secondary text-sm" style={{ marginBottom: '2rem' }}>Be honest, we'll build from where you are.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                  {[
                    { id: 'Beginner', desc: 'I know basic loops and arrays.' },
                    { id: 'Intermediate', desc: 'I can solve standard trees and graphs.' },
                    { id: 'Advanced', desc: 'I am comfortable with DP and advanced graphs.' }
                  ].map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setLevel(item.id)}
                      style={{ padding: '1.25rem', border: `1.5px solid ${level === item.id ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`, borderRadius: '12px', cursor: 'pointer', background: level === item.id ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}
                    >
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: level === item.id ? 'var(--color-primary)' : 'var(--color-text)' }}>{item.id}</h3>
                      <p className="text-secondary text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5: Time */}
            {currentStep === 4 && (
              <motion.div key="step4" variants={variants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>How much time can you study daily?</h2>
                <p className="text-secondary text-sm" style={{ marginBottom: '2rem' }}>We'll adjust your daily missions accordingly.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1 }}>
                  {['30 min', '1 hr', '2 hr', '4 hr+'].map(t => (
                    <div 
                      key={t} 
                      onClick={() => setTime(t)}
                      style={{ padding: '1.5rem', border: `1px solid ${time === t ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: time === t ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s', fontWeight: 600, fontSize: '1.1rem' }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 6: Solved */}
            {currentStep === 5 && (
              <motion.div key="step5" variants={variants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>How many problems have you solved?</h2>
                <p className="text-secondary text-sm" style={{ marginBottom: '2rem' }}>Rough estimate across LeetCode, Codeforces, etc.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1 }}>
                  {['0-50', '50-150', '150-300', '300+'].map(s => (
                    <div 
                      key={s} 
                      onClick={() => setSolved(s)}
                      style={{ padding: '1.5rem', border: `1px solid ${solved === s ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: solved === s ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s', fontWeight: 600, fontSize: '1.1rem' }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 7: Generating */}
            {currentStep === 6 && (
              <GeneratingRoadmap goal={goal} />
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentStep > 0 && currentStep < 6 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border-subtle)' }}>
              <button className="btn-ghost" onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem' }}>
                <ArrowLeft size={16} /> Back
              </button>
              
              <button 
                className="btn btn-primary" 
                onClick={nextStep} 
                disabled={
                  (currentStep === 1 && !goal) ||
                  (currentStep === 2 && companies.length === 0) ||
                  (currentStep === 3 && !level) ||
                  (currentStep === 4 && !time) ||
                  (currentStep === 5 && !solved)
                }
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px' }}
              >
                {currentStep === 5 ? 'Finish' : 'Next'} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AuthLayout>
  );
};
