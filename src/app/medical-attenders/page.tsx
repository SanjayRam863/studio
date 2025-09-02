import { MedicalAttendersView } from "@/components/medical-attenders-view";

export default function MedicalAttendersPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Find a Doctor
        </h1>
        <p className="text-muted-foreground mb-8">
          Enter your location to find nearby doctors and specialists.
        </p>
        <MedicalAttendersView />
      </div>
    </div>
  );
}
