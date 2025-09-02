import { DietPlanForm } from "@/components/diet-plan-form";

export default function DietPlanPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Personalized Diet Plan Generator
        </h1>
        <p className="text-muted-foreground mb-8">
          Enter your medical conditions and daily calorie needs to generate a personalized diet plan using AI.
        </p>
        <DietPlanForm />
      </div>
    </div>
  );
}
