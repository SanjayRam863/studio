
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const formSchema = z.object({
  location: z.string().min(3, "Please enter a valid location."),
});

type FormValues = z.infer<typeof formSchema>;

const mockDoctors = {
  "chennai, tn": [
    { 
      name: "Dr. Priya Sharma", 
      specialty: "Cardiologist",
      clinic: "Apollo Hospital, Greams Road",
      availableTimes: ["10:00 AM", "11:30 AM", "02:00 PM"]
    },
    { 
      name: "Dr. Arjun Reddy", 
      specialty: "Orthopedic Surgeon",
      clinic: "Fortis Malar Hospital, Adyar",
      availableTimes: ["09:00 AM", "01:00 PM", "04:30 PM"]
    },
  ],
  "coimbatore, tn": [
    { 
      name: "Dr. Suresh Kumar", 
      specialty: "Pediatrician",
      clinic: "PSG Hospitals, Peelamedu",
      availableTimes: ["10:30 AM", "12:00 PM", "03:00 PM", "05:00 PM"]
    },
  ]
};

type Doctor = (typeof mockDoctors)["chennai, tn"][0];

export function AppointmentFinderView() {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
    },
  });

  const searchDoctors = (location: string) => {
    setIsLoading(true);
    setDoctors([]);
    setSearchedLocation(location);

    // Simulate API call
    setTimeout(() => {
      const locationKey = location.toLowerCase().trim() as keyof typeof mockDoctors;
      const results = mockDoctors[locationKey] || [];
      setDoctors(results);
      if (results.length === 0) {
        toast({
          title: "No Doctors Found",
          description: `No available appointments found for "${location}". Please try another location.`,
          variant: "default",
        })
      }
      setIsLoading(false);
    }, 1000);
  };
  
  function handleQrScan() {
    const simulatedLocation = "Chennai, TN";
    form.setValue("location", simulatedLocation);
    toast({
      title: "QR Code Scanned",
      description: `Location set to ${simulatedLocation}.`,
    });
    searchDoctors(simulatedLocation);
  }

  return (
    <>
      <Card>
        <CardHeader>
            <CardTitle>Find an Appointment</CardTitle>
            <CardDescription>Scan a location QR code to find available doctors and their schedules nearby.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleQrScan} disabled={isLoading} size="lg" className="w-full sm:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <QrCode className="mr-2 h-4 w-4" />}
            Scan QR Code for Location
          </Button>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="mt-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {doctors.length > 0 && (
        <div className="mt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
                Available Appointments near {searchedLocation}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((doctor) => (
                    <Card key={doctor.name}>
                        <CardHeader>
                            <CardTitle>{doctor.name}</CardTitle>
                            <CardDescription>{doctor.specialty} at {doctor.clinic}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h4 className="font-semibold mb-3">Available Times:</h4>
                            <div className="flex flex-wrap gap-2">
                                {doctor.availableTimes.map(time => (
                                    <Button key={time} variant="outline">{time}</Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      )}
    </>
  );
}
