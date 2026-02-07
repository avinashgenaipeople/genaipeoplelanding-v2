import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FormModal({ open, onOpenChange }: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden bg-white rounded-xl max-h-[90vh] flex flex-col">
        <DialogTitle className="text-xl font-bold text-center py-4 px-6 border-b border-gray-100 shrink-0">
          Share Details to Watch Video
        </DialogTitle>
        <div className="overflow-y-auto flex-1">
        <iframe
          src="https://share.synamate.com/widget/form/pk1gcKtubozhKvH14wUZ"
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
