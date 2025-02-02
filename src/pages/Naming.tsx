import { useState } from "react";
import { PageLayout } from "@/components/Layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NamingPatternList } from "@/components/Naming/NamingPatternList";
import { CreatePatternSheet } from "@/components/Naming/CreatePatternSheet";
import { NameGenerator } from "@/components/Naming/NameGenerator";
import { UTMGenerator } from "@/components/Naming/UTMGenerator";
import { Separator } from "@/components/ui/separator";

export default function Naming() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <PageLayout title="Campaign Naming">
      <div className="space-y-8">
        {/* Introduction Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">The Power of Consistency: Campaign Naming Made Simple</h1>
          <p className="text-muted-foreground mt-2">
            Standardize your campaign names across platforms with ease. Build clarity, improve tracking, and leave chaos behind.
          </p>
        </div>

        <Separator />

        {/* Naming Rules Card */}
        <Card>
          <CardHeader>
            <CardTitle>Naming Convention Guidelines</CardTitle>
            <CardDescription>
              Follow these rules to maintain consistency across all campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-2">Basic Rules</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Use underscores (_) to separate different components</li>
                  <li>Avoid special characters except for underscores</li>
                  <li>Keep names concise but descriptive</li>
                  <li>Use consistent casing (preferably lowercase)</li>
                  <li>Include essential information like region, platform, and objective</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Example Structure</h3>
                <div className="bg-muted p-4 rounded-lg text-sm">
                  <p className="font-mono">advertiser_channel_objective_placement_strategy</p>
                  <p className="mt-2 text-muted-foreground">
                    Example: nike_facebook_awareness_feed_summer2024
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Name Generator Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Generate Campaign Names</h2>
          <NameGenerator />
        </div>

        {/* UTM Generator Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Generate UTM URLs</h2>
          <UTMGenerator />
        </div>

        {/* Patterns Management Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Naming Patterns</h2>
              <p className="text-muted-foreground">
                Create and manage reusable naming patterns for different campaign types
              </p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Pattern
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <NamingPatternList />
            </CardContent>
          </Card>
        </div>
      </div>

      <CreatePatternSheet 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
        patternToEdit={null}
      />
    </PageLayout>
  );
}