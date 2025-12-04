"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface BlurContextType {
  isBlur: boolean;
  setIsBlur: Dispatch<SetStateAction<boolean>>; // (n: boolean) => void is easier to write here but TS got its own rules
}

const BlurContext = createContext<BlurContextType | undefined>(undefined);

export const BlurProvider = ({ children }: { children: ReactNode }) => {
  const [isBlur, setIsBlur] = useState(false);
  return (
    <BlurContext.Provider value={{ isBlur, setIsBlur }}>
      {children}
    </BlurContext.Provider>
  );
};

const useBlur = () => {
  const ctx = useContext(BlurContext);
  if (!ctx) throw new Error("useBlur must be within CounterProvider");
  return ctx;
};

export default useBlur;
