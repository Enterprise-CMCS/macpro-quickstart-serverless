import { useContext, createContext } from "react";

export const AppContext = createContext<Record<string, any>>({});

export function useAppContext() {
  return useContext(AppContext);
}
