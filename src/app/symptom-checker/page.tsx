import { SymptomCheckerForm } from "@/components/symptom-checker-form";

export default function SymptomCheckerPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          AI Symptom Checker
        </h1>
        <p className="text-muted-foreground mb-8">
          Describe your symptoms, and our AI will suggest potential conditions and provide recommendations. This is not a substitute for professional medical advice.
        </p>
        <SymptomCheckerForm />
      </div>
    </div>
  );
}
