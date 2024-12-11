import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Briefcase, Heart, Users2 } from "lucide-react";

interface DemographicsCardProps {
  demographics: {
    age?: { [key: string]: number };
    gender?: { [key: string]: number };
    education?: { [key: string]: number };
    occupation?: { [key: string]: number };
    marital_status?: { [key: string]: number };
  };
}

export function DemographicsCard({ demographics }: DemographicsCardProps) {
  const renderMetric = (data: { [key: string]: number } | undefined, title: string, icon: React.ReactNode) => {
    if (!data) return null;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="font-medium">{title}</h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="capitalize">{key}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {value}%
                </span>
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
        <CardTitle>Demographics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {renderMetric(demographics.age, "Age Distribution", <Users className="h-4 w-4 text-muted-foreground" />)}
        {renderMetric(demographics.gender, "Gender Distribution", <Users2 className="h-4 w-4 text-muted-foreground" />)}
        {renderMetric(demographics.education, "Education", <GraduationCap className="h-4 w-4 text-muted-foreground" />)}
        {renderMetric(demographics.occupation, "Occupation", <Briefcase className="h-4 w-4 text-muted-foreground" />)}
        {renderMetric(demographics.marital_status, "Marital Status", <Heart className="h-4 w-4 text-muted-foreground" />)}
      </CardContent>
    </Card>
  );
}