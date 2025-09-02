"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, Save, User, Shield, Stethoscope, Pill } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const emergencyInfoSchema = z.object({
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  allergies: z.string().optional(),
  surgeries: z.string().optional(),
  chronicConditions: z.string().optional(),
});

type EmergencyInfo = z.infer<typeof emergencyInfoSchema>;

const initialInfo: EmergencyInfo = {
  emergencyContactName: "Jane Doe",
  emergencyContactPhone: "123-456-7890",
  allergies: "Peanuts, Penicillin",
  surgeries: "Appendectomy (2015)",
  chronicConditions: "Type 1 Diabetes, Asthma",
};

export function EmergencyInfoView() {
  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState<EmergencyInfo>(initialInfo);

  const form = useForm<EmergencyInfo>({
    resolver: zodResolver(emergencyInfoSchema),
    values: info,
  });

  function onSubmit(data: EmergencyInfo) {
    setInfo(data);
    setIsEditing(false);
  }
  
  const InfoRow = ({ label, value, icon: Icon }: { label: string; value?: string; icon: React.ElementType }) => (
    <div className="flex items-start gap-4">
      <Icon className="h-5 w-5 text-muted-foreground mt-1" />
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{value || "Not specified"}</p>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Your Health Profile</CardTitle>
            <CardDescription>View and edit your emergency information.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
          <span className="sr-only">{isEditing ? "Save" : "Edit"}</span>
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h3 className="font-semibold text-lg">Emergency Contact</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl><Input placeholder="e.g., 123-456-7890" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator />
              <h3 className="font-semibold text-lg">Medical Details</h3>
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Peanuts, Penicillin" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surgeries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Past Surgeries</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Appendectomy (2015)" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chronicConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chronic Conditions</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Type 1 Diabetes, Asthma" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Emergency Contact</h3>
              <div className="space-y-4">
                <InfoRow label="Name" value={info.emergencyContactName} icon={User} />
                <InfoRow label="Phone Number" value={info.emergencyContactPhone} icon={User} />
              </div>
            </div>
            <Separator />
            <div>
                <h3 className="font-semibold text-lg mb-4">Medical Details</h3>
                <div className="space-y-4">
                    <InfoRow label="Allergies" value={info.allergies} icon={Shield} />
                    <InfoRow label="Past Surgeries" value={info.surgeries} icon={Stethoscope} />
                    <InfoRow label="Chronic Conditions" value={info.chronicConditions} icon={Pill} />
                </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
