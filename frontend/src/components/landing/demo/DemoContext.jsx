import React, { createContext, useContext, useState, useCallback } from 'react';

const DemoContext = createContext();

export const useDemoContext = () => useContext(DemoContext);

export const DemoProvider = ({ children }) => {
  const [refs, setRefs] = useState({});
  const [containerRef, setContainerRef] = useState(null);

  const registerRef = useCallback((id) => (node) => {
    if (node) {
      setRefs((prev) => {
        if (prev[id] === node) return prev;
        return { ...prev, [id]: node };
      });
    }
  }, []);

  const registerContainer = useCallback((node) => {
    if (node) setContainerRef(node);
  }, []);

  return (
    <DemoContext.Provider value={{ refs, registerRef, containerRef, registerContainer }}>
      {children}
    </DemoContext.Provider>
  );
};
