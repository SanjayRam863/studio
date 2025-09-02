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
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
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
    title: "Symptom Checker",
    description: "Check your symptoms.",
    href: "/symptom-checker",
    icon: Stethoscope,
  },
  {
    title: "Emergency Info",
    description: "Manage your emergency data.",
    href: "/emergency-info",
    icon: Contact,
  },
  {
    title: "Blood Transfusion",
    description: "Find donors or recipients.",
    href: "/blood-transfusion",
    icon: Syringe,
  },
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
  {
    title: "First Aid",
    description: "Get first aid procedures.",
    href: "/first-aid",
    icon: Ambulance,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">HealthWise Hub Dashboard</h1>
        <p className="text-muted-foreground">
          Your personal health companion. Navigate to any feature below.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href} className="flex">
            <Card className="flex flex-col w-full transition-all hover:shadow-md hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center">
                <feature.icon className="w-16 h-16 text-primary" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
