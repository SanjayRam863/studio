import { MedicineDeliveryView } from "@/components/medicine-delivery-view";

export default function MedicineDeliveryPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Medicine Delivery
        </h1>
        <p className="text-muted-foreground mb-8">
          Order your prescription and over-the-counter medicines for delivery.
        </p>
        <MedicineDeliveryView />
      </div>
    </div>
  );
}
