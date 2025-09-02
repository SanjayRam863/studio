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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { generateFirstAidInstructions, FirstAidOutput } from "@/ai/flows/first-aid-instruction-generation";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const formSchema = z.object({
  problem: z.string().min(5, "Please describe the problem in at least 5 characters."),
});

type FormValues = z.infer<typeof formSchema>;

function parseInstructions(text: string) {
    const sections = text.split('### ').slice(1);
    return sections.map(section => {
        const [title, ...content] = section.split('\n');
        const items = content.join('\n').split('\n- ').slice(1).map(item => item.trim());
        return { title: title.trim(), items };
    });
}

export function FirstAidForm() {
  const { toast } = useToast();
  const [result, setResult] = useState<FirstAidOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problem: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const instructionResult = await generateFirstAidInstructions(values);
      setResult(instructionResult);
    } catch (error) {
      console.error("Error generating first aid instructions:", error);
      toast({
        title: "Error",
        description: "Failed to generate instructions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const instructionSections = result ? parseInstructions(result.instructions) : [];

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Problem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., deep cut on arm, someone is choking"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get First Aid Steps
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
            <CardTitle>First Aid for: {form.getValues('problem')}</CardTitle>
            <CardDescription>Follow these steps carefully. Always prioritize safety.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
                <AlertTitle>Important Disclaimer</AlertTitle>
                <AlertDescription>{result.disclaimer}</AlertDescription>
            </Alert>
            
            <div className="space-y-4">
                {instructionSections.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                        <ul className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            {section.items.map((item, itemIdx) => (
                                <li key={itemIdx} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*:/g, '<strong>$1:</strong>') }}></li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

          </CardContent>
        </Card>
      )}
    </>
  );
}
