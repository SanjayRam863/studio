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
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  riskPredictionExplanation,
  RiskPredictionExplanationOutput,
} from "@/ai/flows/risk-prediction-explanation";
import { Progress } from "./ui/progress";

const conditions = ["Heart Disease", "Diabetes", "Stroke"] as const;

const formSchema = z.object({
  condition: z.enum(conditions),
  age: z.coerce.number().min(18, "Age must be 18 or older.").max(120),
  bmi: z.coerce.number().min(10).max(60),
  isSmoker: z.boolean().default(false),
  hasFamilyHistory: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

function parseRecommendations(text: string) {
    const sections = text.split('### ').slice(1);
    return sections.map(section => {
        const [title, ...content] = section.split('\n');
        const items = content.join('\n').split('- ').slice(1).map(item => {
            const subItems = item.split('  - ').slice(1);
            if (subItems.length > 0) {
                const [main, ...rest] = item.split('\n');
                return { main: main.replace(/-\s*\*\*(.*?)\*\*:/, '$1:'), subItems: rest.map(sub => sub.replace(/^\s*-\s*/, '')) };
            }
            return { main: item.replace(/\*\*(.*?)\*\*:/, '$1:'), subItems: [] };
        });
        return { title: title.trim(), items };
    });
}


export function RiskPredictionForm() {
  const { toast } = useToast();
  const [result, setResult] = useState<{ riskScore: number; explanation: RiskPredictionExplanationOutput } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      condition: "Heart Disease",
      age: 45,
      bmi: 25,
      isSmoker: false,
      hasFamilyHistory: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);

    // Simulate risk score generation
    let riskScore = 10;
    riskScore += (values.age - 18) * 0.5;
    riskScore += (values.bmi - 18.5) * 1.5;
    if (values.isSmoker) riskScore += 20;
    if (values.hasFamilyHistory) riskScore += 15;
    riskScore = Math.min(Math.max(Math.round(riskScore), 5), 99);
    
    const factors: string[] = [];
    if (values.age) factors.push(`Age: ${values.age}`);
    if (values.bmi) factors.push(`BMI: ${values.bmi.toFixed(1)}`);
    if (values.isSmoker) factors.push('Smoker');
    if (values.hasFamilyHistory) factors.push('Family history of condition');

    try {
      const explanationResult = await riskPredictionExplanation({
        condition: values.condition,
        riskScore,
        factors: factors.join(', '),
      });
      setResult({ riskScore, explanation: explanationResult });
    } catch (error) {
      console.error("Error getting risk explanation:", error);
      toast({
        title: "Error",
        description: "Failed to get risk explanation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const recommendationSections = result ? parseRecommendations(result.explanation.recommendations) : [];
  const disclaimer = result?.explanation.recommendations.split('**Disclaimer**:')[1];


  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a condition" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Mass Index (BMI)</FormLabel>
                      <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="isSmoker"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Are you a smoker?</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="hasFamilyHistory"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Family history of condition?</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Predict Risk
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
            <CardTitle>Risk Prediction Result</CardTitle>
            <CardDescription>
                Your simulated risk score for {form.getValues('condition')} is <span className="font-bold">{result.riskScore}%</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Progress value={result.riskScore} className="w-full h-4 [&>div]:bg-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Explanation</h3>
              <p className="text-sm text-muted-foreground">{result.explanation.explanation}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Recommendations</h3>
              <div className="space-y-4">
                {recommendationSections.map((section, idx) => (
                  <div key={idx}>
                    <h4 className="font-medium text-md mb-2">{section.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <span dangerouslySetInnerHTML={{ __html: item.main.replace(/\*\*(.*?)\*\*:/g, '<strong>$1:</strong>') }} />
                          {item.subItems.length > 0 && (
                            <ul className="list-['-_'] list-inside pl-4 mt-1 space-y-1">
                              {item.subItems.map((sub, subIdx) => (
                                <li key={subIdx}>{sub}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            {disclaimer && (
                <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground italic">
                        <strong>Disclaimer:</strong>{disclaimer}
                    </p>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
