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
          <h1 className="text-2xl font-bold">Campaign Naming Patterns</h1>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Pattern
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <NamingPatternList />
          </CardContent>
        </Card>

        <CreatePatternSheet 
          open={isCreateOpen} 
          onOpenChange={setIsCreateOpen}
          patternToEdit={null}
        />
      </main>
    </div>
  );
}