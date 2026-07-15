import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Globe, Info, Users } from 'lucide-react';
import { submitSupportTicket } from '../lib/dataService';
import { useAuth } from '../contexts/AuthContext';
import { SEO } from '../components/SEO';


export const Support = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitSupportTicket(user?.id, user?.email, subject, message);
      setStatus('success');
      setSubject('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div>
      <SEO title="Support" url="https://revoraa.com/support" />
      <header className="page-header">
        <h1>Support</h1>
        <p className="text-secondary">We're here to help. Reach out anytime.</p>
      </header>
      
      <div className="bento-grid" style={{ marginBottom: '2rem' }}>
        {[
          { icon: BookOpen, title: 'Documentation', sub: 'Read guides, tutorials, and FAQs.', href: '#' },
          { icon: Globe,    title: 'Community',     sub: 'Join our Discord and connect with peers.', href: '#' },
          { icon: Info,     title: 'Bug Report',    sub: 'Found an issue? Let us know.', href: '#' },
          { icon: Users,    title: 'Contact Us',    sub: 'Reach the team directly at support@revoraa.co.in', href: 'mailto:support@revoraa.co.in' },
        ].map(({ icon: Icon, title, sub, href }, i) => (
          <motion.a 
            key={title} 
            href={href} 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.08 }} 
            whileHover={{ y: -4 }} 
            className="bento-card col-span-2" 
            style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color="var(--color-text-muted)" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.25rem' }}>{title}</h3>
              <p className="text-muted text-sm">{sub}</p>
            </div>
          </motion.a>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bento-card liquid-glass">
        <h2 style={{ marginBottom: '1.5rem' }}>Send a Message</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="text-secondary text-sm" style={{ display: 'block', marginBottom: '0.5rem' }}>Subject</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="How can we help?" 
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-secondary text-sm" style={{ display: 'block', marginBottom: '0.5rem' }}>Message</label>
            <textarea 
              className="glass-input" 
              rows="5" 
              placeholder="Provide as much detail as possible..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={status === 'loading'}
            style={{ alignSelf: 'flex-start' }}
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
          
          {status === 'success' && <p className="text-sm" style={{ color: 'var(--color-success)' }}>Your message was sent successfully!</p>}
          {status === 'error' && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>There was an error sending your message. Please try again.</p>}
        </form>
      </motion.div>
    </div>
  );
};
