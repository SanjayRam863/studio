import { RiskPredictionForm } from "@/components/risk-prediction-form";

export default function RiskPredictionPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Health Risk Prediction
        </h1>
        <p className="text-muted-foreground mb-8">
          Select a condition and provide your details to get a simulated risk score and AI-powered explanation and recommendations.
        </p>
        <RiskPredictionForm />
      </div>
    </div>
  );
}
