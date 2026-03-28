import { createContext, useContext } from "react";

export const DialogContext = createContext(null);

// Hook pratique pour l'utiliser
export const useDialog = () => useContext(DialogContext);
