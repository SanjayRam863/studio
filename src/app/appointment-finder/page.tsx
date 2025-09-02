import { AppointmentFinderView } from "@/components/appointment-finder-view";

export default function AppointmentFinderPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Appointment Finder
        </h1>
        <p className="text-muted-foreground mb-8">
          Find available doctor appointments near your location.
        </p>
        <AppointmentFinderView />
      </div>
    </div>
  );
}
