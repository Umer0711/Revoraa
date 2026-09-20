import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import './MobileNav.css';

export function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <MobileNav />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
