import { MedicationRemindersView } from "@/components/medication-reminders-view";

export default function MedicationPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Medication Reminders
        </h1>
        <p className="text-muted-foreground mb-8">
          Add your medications and schedules to receive reminders. Never miss a dose again.
        </p>
        <MedicationRemindersView />
      </div>
    </div>
  );
}
