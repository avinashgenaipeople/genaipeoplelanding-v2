import { useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const FORM_BASE_URL = "https://share.synamate.com/widget/form/pk1gcKtubozhKvH14wUZ";

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
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden rounded-xl max-h-[90vh] flex flex-col border-2 border-primary/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] bg-white">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 shrink-0">
          <DialogTitle className="text-xl font-bold text-center text-white">
            Enter Your Details to Watch the Free Roadmap Video
          </DialogTitle>
          <p className="text-sm text-white/80 text-center mt-1">
            Join 150+ Java developers already on the AI Architect path
          </p>
        </div>
        <div className="overflow-y-auto flex-1">
        <iframe
          src={formUrl}
          className="w-full border-none"
          style={{ height: "944px" }}
          id="inline-pk1gcKtubozhKvH14wUZ"
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="LFMVP Optin -Improved"
          data-height="944"
          data-layout-iframe-id="inline-pk1gcKtubozhKvH14wUZ"
          data-form-id="pk1gcKtubozhKvH14wUZ"
          title="LFMVP Optin -Improved"
        />
        </div>
      </DialogContent>
    </Dialog>
  );
}
