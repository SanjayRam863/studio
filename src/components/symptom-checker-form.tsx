"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Loader2, Download } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  symptomCheckerDiseaseSuggestions,
  SymptomCheckerDiseaseSuggestionsOutput,
} from "@/ai/flows/symptom-checker-disease-suggestions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  symptoms: z
    .string()
    .min(10, "Please describe your symptoms in at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function SymptomCheckerForm() {
  const { toast } = useToast();
  const [suggestions, setSuggestions] =
    useState<SymptomCheckerDiseaseSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await symptomCheckerDiseaseSuggestions(values);
      setSuggestions(result);
    } catch (error) {
      console.error("Error checking symptoms:", error);
      toast({
        title: "Error",
        description: "Failed to check symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDownloadPrescription = () => {
    if (!suggestions?.prescription) return;
    const blob = new Blob([suggestions.prescription], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prescription.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., headache, fever, cough"
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please list all your symptoms, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check Symptoms
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

      {suggestions && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Symptom Analysis</CardTitle>
            <CardDescription>Based on the symptoms you provided, here are some possibilities. Always consult a doctor for a diagnosis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Suggested Conditions</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestions.suggestedConditions}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-2">Recommendations</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestions.recommendations}</p>
            </div>
            {suggestions.prescription && (
                <>
                    <Separator />
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="font-semibold text-lg">Simulated Prescription</h3>
                             <Button variant="outline" size="sm" onClick={handleDownloadPrescription}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                             </Button>
                        </div>
                        <Card className="bg-muted/50">
                            <CardContent className="p-4">
                                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">{suggestions.prescription}</pre>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
