import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Briefcase, Heart, Users2, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemographicsCardProps {
  demographics: {
    age?: { [key: string]: number };
    gender?: { [key: string]: number };
    education?: { [key: string]: number };
    occupation?: { [key: string]: number };
    marital_status?: { [key: string]: number };
    geography?: { [key: string]: number };
  };
}

export function DemographicsCard({ demographics }: DemographicsCardProps) {
  const renderMetric = (data: { [key: string]: number } | undefined, title: string, icon: React.ReactNode) => {
    if (!data) return null;
    
    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="font-medium">{title}</h4>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize text-muted-foreground">{key}</span>
                <span className="font-medium">{value}%</span>
              </div>
              <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Demographics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {renderMetric(demographics.age, "Age Distribution", <Users className="h-4 w-4 text-primary" />)}
        {renderMetric(demographics.gender, "Gender Distribution", <Users2 className="h-4 w-4 text-primary" />)}
        {renderMetric(demographics.education, "Education", <GraduationCap className="h-4 w-4 text-primary" />)}
        {renderMetric(demographics.occupation, "Occupation", <Briefcase className="h-4 w-4 text-primary" />)}
        {renderMetric(demographics.marital_status, "Marital Status", <Heart className="h-4 w-4 text-primary" />)}
        {renderMetric(demographics.geography, "Geography", <Globe className="h-4 w-4 text-primary" />)}
      </CardContent>
    </Card>
  );
}