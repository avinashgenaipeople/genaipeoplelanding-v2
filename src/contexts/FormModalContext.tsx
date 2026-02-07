import { createContext, useContext, useState, ReactNode } from "react";
import { FormModal } from "@/components/ui/form-modal";

interface FormModalContextType {
  openFormModal: () => void;
}

const FormModalContext = createContext<FormModalContextType | undefined>(undefined);

export function FormModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openFormModal = () => setIsOpen(true);

  return (
    <FormModalContext.Provider value={{ openFormModal }}>
      {children}
      <FormModal open={isOpen} onOpenChange={setIsOpen} />
    </FormModalContext.Provider>
  );
}

export function useFormModal() {
  const context = useContext(FormModalContext);
  if (!context) {
    throw new Error("useFormModal must be used within a FormModalProvider");
  }
  return context;
}
