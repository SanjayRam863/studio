import { FirstAidForm } from "@/components/first-aid-form";

export default function FirstAidPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          AI-Powered First Aid Guide
        </h1>
        <p className="text-muted-foreground mb-8">
          Describe a medical problem to get immediate, AI-generated first aid instructions. This is not a substitute for professional medical help.
        </p>
        <FirstAidForm />
      </div>
    </div>
  );
}
