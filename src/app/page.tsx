import Link from "next/link";
import {
  Apple,
  Bell,
  Contact,
  Droplets,
  HeartPulse,
  ShieldAlert,
  Stethoscope,
  Ambulance,
  Truck,
  Syringe,
  HelpingHand,
  CalendarClock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const featureCategories = [
  {
    id: "assessment",
    title: "Health Assessment",
    features: [
      {
        title: "Risk Prediction",
        description: "Assess your health risks.",
        href: "/risk-prediction",
        icon: HeartPulse,
      },
      {
        title: "Urgency Assessment",
        description: "Evaluate medical urgency.",
        href: "/urgency-assessment",
        icon: ShieldAlert,
      },
      {
        title: "Symptom Checker",
        description: "Check your symptoms.",
        href: "/symptom-checker",
        icon: Stethoscope,
      },
    ],
  },
  {
    id: "management",
    title: "Management",
    features: [
      {
        title: "Personalized Diet Plans",
        description: "Get a custom diet plan.",
        href: "/diet-plan",
        icon: Apple,
      },
      {
        title: "Medication Reminders",
        description: "Never miss a dose.",
        href: "/medication",
        icon: Bell,
      },
      {
        title: "Insulin Tracking",
        description: "Monitor your insulin usage.",
        href: "/insulin-tracker",
        icon: Droplets,
      },
       {
        title: "Appointment Finder",
        description: "Find doctor appointments.",
        href: "/appointment-finder",
        icon: CalendarClock,
      },
    ],
  },
  {
    id: "support",
    title: "Emergency & Support",
    features: [
      {
        title: "Emergency Info",
        description: "Manage your emergency data.",
        href: "/emergency-info",
        icon: Contact,
      },
      {
        title: "First Aid",
        description: "Get first aid procedures.",
        href: "/first-aid",
        icon: Ambulance,
      },
      {
        title: "Blood Transfusion",
        description: "Find donors or recipients.",
        href: "/blood-transfusion",
        icon: Syringe,
      },
    ],
  },
  {
    id: "services",
    title: "Additional Services",
    features: [
      {
        title: "Medicine Delivery",
        description: "Order your medicines.",
        href: "/medicine-delivery",
        icon: Truck,
      },
      {
        title: "Medical Attenders",
        description: "Find senior care.",
        href: "/medical-attenders",
        icon: HelpingHand,
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">HealthWise Hub</h1>
        <p className="text-muted-foreground">
          Your personal health companion.
        </p>
      </div>

      <Tabs defaultValue="assessment" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          {featureCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {featureCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.features.map((feature) => (
                <Link href={feature.href} key={feature.href} className="flex">
                  <Card className="flex flex-col w-full transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <feature.icon className="w-8 h-8 text-primary" />
                        <span className="text-xl">{feature.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-end justify-end">
                      <p className="text-base text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
