'use client';
// In your context definition file
import React, { createContext, useContext, useState } from "react";

const UpdatedContext = createContext();

export function UpdatedProvider({ children }) {
    const [number, setNumber] = useState(0);

    return (
        <UpdatedContext.Provider value={{ number, setNumber }}>
            {children}
        </UpdatedContext.Provider>
    );
}

export function useUpdatedContext() {
    const context = useContext(UpdatedContext);
    if (context === undefined) {
        throw new Error("useUpdatedContext must be used within a LoadingProvider");
    }
    return context;
}
