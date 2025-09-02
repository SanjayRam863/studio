
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MapPin, Search, Stethoscope, Phone, LocateFixed } from "lucide-react";
import QRCode from 'qrcode.react';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { findMedicalAttenders, MedicalAttenderOutput } from "@/ai/flows/medical-attender-finder";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


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
      if (result.attenders.length === 0) {
        toast({
            title: "No Doctors Found",
            description: `We couldn't find any doctors for "${values.location}". Please try a different location in Tamil Nadu.`,
        });
      }
    } catch (error) {
      console.error("Error finding medical attenders:", error);
      toast({
        title: "Error",
        description: "Failed to find doctors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleUseLocation() {
    // Simulate getting user's location
    const simulatedLocation = "Coimbatore, TN";
    form.setValue("location", simulatedLocation);
    toast({
        title: "Location Fetched",
        description: `Location set to "${simulatedLocation}".`,
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
            <CardTitle>Find a Doctor</CardTitle>
            <CardDescription>Enter a city to find healthcare professionals near you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Your Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Chennai, TN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleUseLocation} className="h-10">
                    <LocateFixed className="mr-2 h-4 w-4" /> Use My Location
                </Button>
                <Button type="submit" disabled={isLoading} className="h-10">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Search
                </Button>
              </div>
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
        <div className="mt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
                {results.attenders.length > 0 
                    ? `Found ${results.attenders.length} doctors near ${form.getValues('location')}`
                    : 'No doctors found'
                }
            </h2>
            {results.attenders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.attenders.map((attender, index) => {
                        const qrValue = `BEGIN:VCARD\nVERSION:3.0\nFN:${attender.name}\nORG:${attender.address}\nTEL:${attender.contact}\nEND:VCARD`;
                        return (
                            <Card key={index} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{attender.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 pt-1">
                                        <Stethoscope className="h-4 w-4" /> {attender.services.join(', ')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-3">
                                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 mt-0.5" /> <span>{attender.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" /> <span>{attender.contact}</span>
                                </div>
                                </CardContent>
                                <CardFooter>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full">View QR Code</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-xs">
                                            <DialogHeader>
                                                <DialogTitle>{attender.name}</DialogTitle>
                                                <DialogDescription>
                                                    Scan this code to save contact details.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex justify-center p-4 bg-white rounded-md">
                                                <QRCode value={qrValue} size={200} />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-10">{results.response}</p>
            )}
        </div>
      )}
    </>
  );
}
