import { createContext, useContext, useState, ReactNode } from "react";
import { FormModal } from "@/components/ui/form-modal";
import { trackEvent } from "@/lib/analytics";

interface FormModalHeader {
  title: string;
  subtitle: string;
}

interface FormModalContextType {
  openFormModal: () => void;
  setFormHeader: (header: FormModalHeader) => void;
}

const FormModalContext = createContext<FormModalContextType | undefined>(undefined);

const DEFAULT_HEADER: FormModalHeader = {
  title: "Watch the Free Training",
  subtitle: "Get instant access to the 28-min roadmap",
};

export function FormModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [header, setFormHeader] = useState<FormModalHeader>(DEFAULT_HEADER);

  const openFormModal = () => {
    trackEvent("lead_form_open", { page_path: window.location.pathname });
    setIsOpen(true);
  };

  return (
    <FormModalContext.Provider value={{ openFormModal, setFormHeader }}>
      {children}
      <FormModal open={isOpen} onOpenChange={setIsOpen} title={header.title} subtitle={header.subtitle} />
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
