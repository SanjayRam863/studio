"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle, Pill, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
};

const formSchema = z.object({
  name: z.string().min(1, "Medication name is required."),
  dosage: z.string().min(1, "Dosage is required."),
  time: z.string().min(1, "Time is required."),
});

const initialMedications: Medication[] = [
    { id: '1', name: 'Metformin', dosage: '500mg', time: '08:00', taken: true },
    { id: '2', name: 'Lisinopril', dosage: '10mg', time: '09:00', taken: false },
    { id: '3', name: 'Atorvastatin', dosage: '20mg', time: '20:00', taken: false },
];

export function MedicationRemindersView() {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dosage: "",
      time: "",
    },
  });

  function addMedication(data: z.infer<typeof formSchema>) {
    const newMedication: Medication = {
      id: new Date().toISOString(),
      ...data,
      taken: false,
    };
    setMedications((prev) => [...prev, newMedication].sort((a,b) => a.time.localeCompare(b.time)));
    form.reset();
  }

  function toggleTaken(id: string) {
    setMedications(meds => meds.map(med => med.id === id ? {...med, taken: !med.taken} : med));
  }
  
  function removeMedication(id: string) {
    setMedications(meds => meds.filter(med => med.id !== id));
  }

  const todayReminders = medications; // Simplified to show all for demo purposes

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Add New Medication</CardTitle>
            <CardDescription>Fill in the details to set up a reminder.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addMedication)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Aspirin" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl><Input placeholder="e.g., 1 tablet, 500mg" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl><Input type="time" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit"><Plus className="mr-2 h-4 w-4" /> Add Reminder</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Reminders</CardTitle>
            <CardDescription>Your medication schedule for today.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayReminders.length > 0 ? todayReminders.map((med) => (
                <div key={med.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${med.taken ? 'bg-green-500/20 text-green-600' : 'bg-primary/20 text-primary'}`}>
                      {med.taken ? <CheckCircle className="h-6 w-6" /> : <Bell className="h-6 w-6" />}
                    </div>
                    <div>
                      <p className={`font-semibold ${med.taken ? 'line-through text-muted-foreground' : ''}`}>{med.name}</p>
                      <p className="text-sm text-muted-foreground">{med.dosage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={med.taken ? "secondary" : "default"}>{med.time}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => toggleTaken(med.id)}>
                      <CheckCircle className={`h-5 w-5 ${med.taken ? 'text-green-600' : 'text-muted-foreground'}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeMedication(med.id)}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">No reminders for today.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
