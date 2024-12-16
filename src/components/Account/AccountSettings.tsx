import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessInfoForm } from "./BusinessInfoForm";
import { SecurityForm } from "./SecurityForm";
import { SubscriptionForm } from "./SubscriptionForm";
import { AccountLoading } from "./AccountLoading";
import { AccountHeader } from "./AccountHeader";
import { useProfile } from "./hooks/useProfile";

export function AccountSettings() {
  const { loading, profile, email, updateProfile } = useProfile();

  if (loading) {
    return <AccountLoading />;
  }

  return (
    <div className="space-y-6">
      <AccountHeader />

      <Tabs defaultValue="business" className="w-full">
        <TabsList>
          <TabsTrigger value="business">Business Information</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-4">
          <BusinessInfoForm 
            profile={profile} 
            email={email}
            onUpdate={updateProfile} 
          />
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <SubscriptionForm />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityForm email={email} />
        </TabsContent>
      </Tabs>
    </div>
  );
}