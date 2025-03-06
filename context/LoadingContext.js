'use client';
import React, { createContext, useContext, useState, useCallback } from "react";

// Crear el contexto
const LoadingContext = createContext();

// Crear el Provider
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Función para mostrar el loading con un mensaje opcional
  const showLoading = useCallback((message = "Cargando...") => {
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  // Función para ocultar el loading
  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage("");
  }, []);

  return (
    <LoadingContext.Provider
      value={{ isLoading, loadingMessage, showLoading, hideLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useLoading = () => {
  return useContext(LoadingContext);
};
