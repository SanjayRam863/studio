"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  assessUrgencyAndSuggestNextSteps,
} from "@/ai/flows/urgency-assessment-next-steps";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import type { UrgencyAssessmentOutput } from "@/ai/schemas/urgency-assessment-schemas";

const formSchema = z.object({
  heartRate: z.coerce.number().min(30).max(220),
  bloodPressureSystolic: z.coerce.number().min(50).max(250),
  bloodPressureDiastolic: z.coerce.number().min(30).max(150),
  oxygenSaturation: z.coerce.number().min(70).max(100),
  symptoms: z.string().min(5, "Please describe symptoms."),
});

type FormValues = z.infer<typeof formSchema>;

export function UrgencyAssessmentForm() {
  const { toast } = useToast();
  const [result, setResult] = useState<UrgencyAssessmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heartRate: 80,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      oxygenSaturation: 98,
      symptoms: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const assessmentResult = await assessUrgencyAndSuggestNextSteps(values);
      setResult(assessmentResult);
    } catch (error) {
      console.error("Error assessing urgency:", error);
      toast({
        title: "Error",
        description: "Failed to assess urgency. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getUrgencyVariant = (level: "Low" | "Medium" | "High"): "default" | "destructive" | "secondary" => {
    switch (level) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField control={form.control} name="heartRate" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Heart Rate (BPM): {field.value}</FormLabel>
                        <FormControl><Slider min={30} max={220} step={1} onValueChange={(v) => field.onChange(v[0])} value={[field.value]} /></FormControl>
                    </FormItem>
                )}/>
                <FormField control={form.control} name="oxygenSaturation" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Oxygen Saturation (%): {field.value}</FormLabel>
                        <FormControl><Slider min={70} max={100} step={1} onValueChange={(v) => field.onChange(v[0])} value={[field.value]} /></FormControl>
                    </FormItem>
                )}/>
                <FormField control={form.control} name="bloodPressureSystolic" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Blood Pressure - Systolic: {field.value}</FormLabel>
                        <FormControl><Slider min={50} max={250} step={1} onValueChange={(v) => field.onChange(v[0])} value={[field.value]} /></FormControl>
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="bloodPressureDiastolic" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Blood Pressure - Diastolic: {field.value}</FormLabel>
                        <FormControl><Slider min={30} max={150} step={1} onValueChange={(v) => field.onChange(v[0])} value={[field.value]} /></FormControl>
                    </FormItem>
                )}/>
              </div>

              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl><Textarea placeholder="e.g., chest pain, shortness of breath" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assess Urgency
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="mt-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Urgency Assessment Result</CardTitle>
            <CardDescription>
                <Badge variant={getUrgencyVariant(result.urgencyLevel)}>{result.urgencyLevel} Urgency</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Explanation</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.explanation}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Recommended Next Steps</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.nextSteps}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
