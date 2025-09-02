"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Apple,
  Bell,
  Contact,
  Droplets,
  HeartPulse,
  Home,
  ShieldAlert,
  Stethoscope,
  Settings,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/risk-prediction", label: "Risk Prediction", icon: HeartPulse },
  { href: "/urgency-assessment", label: "Urgency Assessment", icon: ShieldAlert },
  { href: "/diet-plan", label: "Diet Plans", icon: Apple },
  { href: "/medication", label: "Medication", icon: Bell },
  { href: "/insulin-tracker", label: "Insulin Tracker", icon: Droplets },
  { href: "/symptom-checker", label: "Symptom Checker", icon: Stethoscope },
  { href: "/emergency-info", label: "Emergency Info", icon: Contact },
];

export function AppSidebarNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const NavLink = isMobile ? Link : TooltipTrigger;

  const navLinks = navItems.map((item) => {
    const link = (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
          pathname === item.href && "text-foreground bg-accent rounded-md",
          isMobile && "py-2"
        )}
      >
        <item.icon className="h-5 w-5" />
        {isMobile ? item.label : ''}
      </Link>
    );

    if (isMobile) {
      return link;
    }

    return (
      <Tooltip key={item.href}>
        <NavLink asChild>{link}</NavLink>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  });

  return <>{navLinks}</>;
}

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Icons.logo className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">HealthWise Hub</span>
          </Link>
          <AppSidebarNav />
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
