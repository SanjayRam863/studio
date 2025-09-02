import { BloodTransfusionView } from "@/components/blood-transfusion-view";

export default function BloodTransfusionPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Blood Donors & Recipients
        </h1>
        <p className="text-muted-foreground mb-8">
          Connect with blood donors or find recipients in your area.
        </p>
        <BloodTransfusionView />
      </div>
    </div>
  );
}
