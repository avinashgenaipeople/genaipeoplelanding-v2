import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FormModal({ open, onOpenChange }: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden bg-white rounded-xl">
        <VisuallyHidden>
          <DialogTitle>Sign Up Form</DialogTitle>
        </VisuallyHidden>
        <iframe
          src="https://share.synamate.com/widget/form/pk1gcKtubozhKvH14wUZ"
          className="w-full border-none rounded-lg"
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
      </DialogContent>
    </Dialog>
  );
}
