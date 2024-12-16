import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function DetailedTargeting() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Targeting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Interests</Label>
          <Textarea 
            placeholder="Enter interests (e.g., Technology, Fashion, Sports)" 
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Behaviors</Label>
          <Textarea 
            placeholder="Enter behaviors (e.g., Online shoppers, Frequent travelers)" 
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Demographics</Label>
          <Textarea 
            placeholder="Enter demographic traits (e.g., New parents, College students)" 
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}