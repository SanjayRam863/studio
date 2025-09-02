"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { findMedicalAttenders, MedicalAttenderOutput } from "@/ai/flows/medical-attender-finder";

const formSchema = z.object({
  location: z.string().min(3, "Please enter a valid location."),
});

type FormValues = z.infer<typeof formSchema>;

export function MedicalAttendersView() {
  const { toast } = useToast();
  const [results, setResults] = useState<MedicalAttenderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResults(null);
    try {
      const result = await findMedicalAttenders(values);
      setResults(result);
    } catch (error) {
      console.error("Error finding medical attenders:", error);
      toast({
        title: "Error",
        description: "Failed to find medical attenders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
            <CardTitle>Search for Attenders</CardTitle>
            <CardDescription>Enter a location to find senior care services.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., San Francisco, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search
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

      {results && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Found {results.attenders.length} medical attenders near {form.getValues('location')}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.attenders.length > 0 ? (
                results.attenders.map((attender, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{attender.name}</CardTitle>
                            <CardDescription>{attender.services.join(', ')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <div className="flex items-center gap-2 text-sm text-muted-foreground">
                             <MapPin className="h-4 w-4" /> <span>{attender.address}</span>
                           </div>
                           <p className="text-sm">{attender.contact}</p>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">{results.response}</p>
            )}
            
          </CardContent>
        </Card>
      )}
    </>
  );
}
