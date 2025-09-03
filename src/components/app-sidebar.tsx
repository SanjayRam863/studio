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
  Syringe,
  Truck,
  HelpingHand,
  Ambulance,
  CalendarClock,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { useSidebar } from "./ui/sidebar";
import { Separator } from "./ui/separator";

const navCategories = [
    {
      title: "Home",
      items: [
        { href: "/", label: "Dashboard", icon: Home },
      ]
    },
    {
        title: "Health Assessment",
        items: [
            { href: "/risk-prediction", label: "Risk Prediction", icon: HeartPulse },
            { href: "/urgency-assessment", label: "Urgency Assessment", icon: ShieldAlert },
            { href: "/symptom-checker", label: "Symptom Checker", icon: Stethoscope },
        ]
    },
    {
        title: "Management",
        items: [
            { href: "/diet-plan", label: "Diet Plans", icon: Apple },
            { href: "/medication", label: "Medication", icon: Bell },
            { href: "/insulin-tracker", label: "Insulin Tracker", icon: Droplets },
            { href: "/appointment-finder", label: "Appointment Finder", icon: CalendarClock },
        ]
    },
    {
        title: "Emergency & Support",
        items: [
            { href: "/emergency-info", label: "Emergency Info", icon: Contact },
            { href: "/first-aid", label: "First Aid", icon: Ambulance },
            { href: "/blood-transfusion", label: "Blood Transfusion", icon: Syringe },
        ]
    },
    {
        title: "Additional Services",
        items: [
            { href: "/medicine-delivery", label: "Medicine Delivery", icon: Truck },
            { href: "/medical-attenders", label: "Medical Attenders", icon: HelpingHand },
        ]
    }
]


export function AppSidebarNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const { isSidebarOpen } = useSidebar();
  const NavLink = isMobile || isSidebarOpen ? 'div' : TooltipTrigger;

  return (
    <>
      {navCategories.map((category, index) => (
        <div key={category.title} className={cn("space-y-2", isSidebarOpen ? "w-full" : "")}>
          {(isSidebarOpen || isMobile) && (
            <h3 className="px-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{category.title}</h3>
          )}
          {category.items.map((item) => {
            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                  pathname === item.href && "text-foreground bg-accent rounded-md",
                  isSidebarOpen ? "py-2" : "h-9 w-9 justify-center rounded-lg",
                  isMobile && "py-2"
                )}
              >
                <item.icon className="h-5 w-5" />
                {(isSidebarOpen || isMobile) && <span className="truncate">{item.label}</span>}
              </Link>
            );

            if (isMobile || isSidebarOpen) {
              return <div key={item.href}>{linkContent}</div>;
            }

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
           {index < navCategories.length - 1 && !(isSidebarOpen || isMobile) && (
              <Separator className="my-2" />
           )}
        </div>
      ))}
    </>
  );
}

export function AppSidebar() {
  const { isSidebarOpen } = useSidebar();
  return (
    <aside className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-56" : "w-14"
    )}>
      <TooltipProvider>
        <div className="flex flex-col items-center gap-4 px-2 sm:py-5 flex-grow">
          <Link
            href="/"
            className={cn(
              "group flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base",
               isSidebarOpen ? "h-9 w-full" : "h-9 w-9",
            )}
          >
            <Icons.logo className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className={cn("sr-only", isSidebarOpen && "!not-sr-only !whitespace-nowrap")}>HealthWise Hub</span>
          </Link>
          <nav className={cn(
              "flex flex-col gap-4 mt-4",
              isSidebarOpen ? "items-stretch w-full px-2 space-y-4" : "items-center"
          )}>
            <AppSidebarNav />
          </nav>
        </div>
        <div className={cn("mt-auto flex flex-col items-center gap-4 px-2 sm:py-5", isSidebarOpen ? "items-stretch w-full" : "items-center")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className={cn(
                    "flex items-center gap-4 text-muted-foreground transition-colors hover:text-foreground",
                    isSidebarOpen ? "px-2.5 py-2" : "h-9 w-9 justify-center rounded-lg"
                )}
              >
                <Settings className="h-5 w-5" />
                {isSidebarOpen && <span className="truncate">Settings</span>}
              </Link>
            </TooltipTrigger>
            {!isSidebarOpen && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip>
        </div>
      </TooltipProvider>
    </aside>
  );
}
