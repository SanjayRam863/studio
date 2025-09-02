import { InsulinTrackerView } from "@/components/insulin-tracker-view";

export default function InsulinTrackerPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Insulin & Blood Sugar Tracker
        </h1>
        <p className="text-muted-foreground mb-8">
          Log your insulin doses and blood sugar levels. Visualize your trends over time.
        </p>
        <InsulinTrackerView />
      </div>
    </div>
  );
}
