import { AppSidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { PlatformIntegrations } from "@/components/Settings/PlatformIntegrations";

const Settings = () => {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1">
        <Header title="Settings" />
        <main className="container mx-auto p-6">
          <PlatformIntegrations />
        </main>
      </div>
    </div>
  );
};

export default Settings;