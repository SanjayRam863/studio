import { UrgencyAssessmentForm } from "@/components/urgency-assessment-form";

export default function UrgencyAssessmentPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Urgency Assessment Tool
        </h1>
        <p className="text-muted-foreground mb-8">
          Enter your vital signs and symptoms to receive an AI-powered assessment of the situation's urgency. This is not a substitute for professional medical advice.
        </p>
        <UrgencyAssessmentForm />
      </div>
    </div>
  );
}
