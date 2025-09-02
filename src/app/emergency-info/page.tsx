import { EmergencyInfoView } from "@/components/emergency-info-view";

export default function EmergencyInfoPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Emergency Health Profile
        </h1>
        <p className="text-muted-foreground mb-8">
          Keep your critical health information up-to-date. This information can be vital for healthcare providers in an emergency.
        </p>
        <EmergencyInfoView />
      </div>
    </div>
  );
}
