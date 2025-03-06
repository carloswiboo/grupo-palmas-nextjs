'use client';
// In your context definition file
import React, { createContext, useContext, useState } from "react";

const CrudContext = createContext();

export function CrudProvider({ children }) {
  const [crud, setCrud] = useState({ type: null, data: null });

  return (
    <CrudContext.Provider value={{ crud, setCrud }}>
      {children}
    </CrudContext.Provider>
  );
}

export function useCrudContext() {
  const context = useContext(CrudContext);
  if (context === undefined) {
    throw new Error("useCrudContext must be used within a LoadingProvider");
  }
  return context;
}
