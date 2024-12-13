import { BarChart, Target, Users, Settings, Signal, LineChart, FileText, CalendarRange, UserCircle, Link, HelpCircle, Globe, MessageSquare, Building2, Megaphone } from "lucide-react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: BarChart, label: "Campaigns", path: "/campaigns" },
  { icon: Globe, label: "Website Performance", path: "/website-performance" },
  { icon: Megaphone, label: "Launch Ads", path: "/launch-ads" },
  { icon: LineChart, label: "Ad Performance", path: "/ad-performance" },
  { icon: Users, label: "Audience", path: "/audience" },
  { icon: Signal, label: "Brand Sentiment", path: "/sentiment" },
  { icon: CalendarRange, label: "Planning", path: "/planning" },
  { icon: Target, label: "Naming Rules", path: "/naming" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: Link, label: "Connections", path: "/connections" },
  { icon: HelpCircle, label: "Help", path: "/help" },
  { icon: UserCircle, label: "Account", path: "/account" },
  { icon: Building2, label: "Brands", path: "/brands" },
  { icon: MessageSquare, label: "Contact Us", path: "/contact" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarContent>
        <div className="flex items-center gap-2 px-4 py-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand" />
          <h1 className="text-xl font-bold bg-gradient-brand bg-clip-text text-transparent">
            Valkyrie
          </h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild
                    data-active={location.pathname === item.path}
                    className="hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <RouterLink to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </RouterLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}