import { Home, BarChart, Target, Users, Settings, Signal, LineChart, FileText, CalendarRange, UserCircle, Link, HelpCircle } from "lucide-react";
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
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: BarChart, label: "Campaigns", path: "/campaigns" },
  { icon: LineChart, label: "Performance", path: "/performance" },
  { icon: Target, label: "Naming Rules", path: "/naming" },
  { icon: Users, label: "Audience", path: "/audience" },
  { icon: Signal, label: "Brand Sentiment", path: "/sentiment" },
  { icon: CalendarRange, label: "Planning", path: "/planning" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: Link, label: "Connections", path: "/connections" },
  { icon: HelpCircle, label: "Help", path: "/help" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: UserCircle, label: "Account", path: "/account" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild
                    data-active={location.pathname === item.path}
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