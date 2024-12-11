import { useState } from "react";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NamingPatternList } from "@/components/Naming/NamingPatternList";
import { CreatePatternSheet } from "@/components/Naming/CreatePatternSheet";

export default function Naming() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Campaign Naming Rules</h1>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Pattern
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Naming Rules</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ul className="list-disc pl-6 space-y-2">
                <li>Use underscores (_) to separate different components in the pattern</li>
                <li>Avoid special characters except for underscores</li>
                <li>Keep names concise but descriptive</li>
                <li>Use consistent casing (preferably lowercase)</li>
                <li>Include essential information like region, platform, and objective</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <NamingPatternList />
            </CardContent>
          </Card>
        </div>

        <CreatePatternSheet 
          open={isCreateOpen} 
          onOpenChange={setIsCreateOpen}
          patternToEdit={null}
        />
      </main>
    </div>
  );
}