import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlatformIntegrationType } from "@/types/platform";
import { FacebookSetup } from "./platforms/FacebookSetup";
import { GoogleAdsSetup } from "./platforms/GoogleAdsSetup";
import { DefaultSetup } from "./platforms/DefaultSetup";

interface IntegrationDialogProps {
  platform: PlatformIntegrationType | null;
  onClose: () => void;
}

export const IntegrationDialog = ({ platform, onClose }: IntegrationDialogProps) => {
  const getSetupComponent = () => {
    if (!platform) return null;

    switch (platform.platform_name) {
      case "Facebook":
      case "Instagram":
        return <FacebookSetup platform={platform} />;
      case "Google Ads":
      case "DV360":
        return <GoogleAdsSetup platform={platform} />;
      default:
        return <DefaultSetup platform={platform} />;
    }
  };

  return (
    <Dialog open={!!platform} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {platform?.platform_name} Integration Setup
          </DialogTitle>
        </DialogHeader>
        {getSetupComponent()}
      </DialogContent>
    </Dialog>
  );
};