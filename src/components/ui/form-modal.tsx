import { useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const FORM_BASE_URL = "https://share.synamate.com/widget/form/TW7vEwm553MbqKYmfMPP";

function buildFormUrl() {
  const params = window.location.search;
  if (!params) return FORM_BASE_URL;
  return `${FORM_BASE_URL}${params}`;
}

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FormModal({ open, onOpenChange }: FormModalProps) {
  const formUrl = useMemo(() => buildFormUrl(), []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl w-full p-0 overflow-hidden rounded-xl max-h-[90vh] flex flex-col border-2 border-primary/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] bg-white">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 shrink-0">
          <DialogTitle className="text-xl font-bold text-center text-white">
            Watch the Free Video & Book Your Call
          </DialogTitle>
          <p className="text-sm text-white/90 text-center mt-2">
            28-min free training for senior Java devs ready to ship 10x faster.
          </p>
        </div>
        <div className="overflow-y-auto flex-1">
        <iframe
          src={formUrl}
          className="w-full border-none"
          style={{ height: "944px" }}
          id="inline-TW7vEwm553MbqKYmfMPP"
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="LFMVP Optin -Improved"
          data-height="944"
          data-layout-iframe-id="inline-TW7vEwm553MbqKYmfMPP"
          data-form-id="TW7vEwm553MbqKYmfMPP"
          title="LFMVP Optin -Improved"
          loading="lazy"
        />
        </div>
        <div className="px-6 py-3 border-t border-border/60 text-center">
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Form not loading? Open it in a new tab.
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
