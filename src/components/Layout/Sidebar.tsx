import { BarChart, Target, Users, Settings, Signal, LineChart, FileText, CalendarRange, UserCircle, Link, HelpCircle, Globe, MessageSquare } from "lucide-react";
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
  { icon: LineChart, label: "Performance", path: "/performance" },
  { icon: Users, label: "Audience", path: "/audience" },
  { icon: Signal, label: "Brand Sentiment", path: "/sentiment" },
  { icon: CalendarRange, label: "Planning", path: "/planning" },
  { icon: Target, label: "Naming Rules", path: "/naming" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: Link, label: "Connections", path: "/connections" },
  { icon: HelpCircle, label: "Help", path: "/help" },
  { icon: UserCircle, label: "Account", path: "/account" },
  { icon: MessageSquare, label: "Contact Us", path: "/contact" },
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