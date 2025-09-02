"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, subDays } from "date-fns";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarIcon, Droplet, Zap } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";

type InsulinEntry = { date: Date; dose: number };
type SugarEntry = { date: Date; level: number };
type Entry = { date: Date, dose?: number, level?: number };

const formSchema = z.object({
  date: z.date({ required_error: "A date is required." }),
  dose: z.coerce.number().optional(),
  level: z.coerce.number().optional(),
}).refine(data => data.dose != null || data.level != null, {
  message: "Either insulin dose or blood sugar level is required.",
  path: ["dose"],
});

const initialData: Entry[] = Array.from({ length: 7 }, (_, i) => ({
  date: subDays(new Date(), 6 - i),
  dose: Math.floor(Math.random() * 10) + 5,
  level: Math.floor(Math.random() * 60) + 80
}));

const globalAverageData = initialData.map(item => ({
    date: item.date,
    level: Math.floor(Math.random() * 20) + 100,
}));


export function InsulinTrackerView() {
  const [entries, setEntries] = useState<Entry[]>(initialData);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setEntries((prev) => [...prev, data].sort((a,b) => a.date.getTime() - b.date.getTime()));
    form.reset({ date: new Date() });
  }

  const chartData = entries.map(entry => ({
    name: format(entry.date, 'MMM d'),
    userLevel: entry.level,
    dose: entry.dose,
    globalLevel: globalAverageData.find(d => format(d.date, 'MMM d') === format(entry.date, 'MMM d'))?.level,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Log New Entry</CardTitle>
            <CardDescription>Add an insulin dose or blood sugar reading.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insulin Dose (units)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 10" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Sugar (mg/dL)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 120" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add Entry</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Blood Sugar Trends</CardTitle>
            <CardDescription>Your levels vs. global averages.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                <ReferenceLine y={140} label="High" stroke="red" strokeDasharray="3 3" />
                <ReferenceLine y={70} label="Low" stroke="blue" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="userLevel" name="Your Level" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="globalLevel" name="Global Average" stroke="hsl(var(--accent))" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-5">
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right flex items-center justify-end gap-2"><Droplet className="h-4 w-4"/> Insulin Dose (units)</TableHead>
                  <TableHead className="text-right flex items-center justify-end gap-2"><Zap className="h-4 w-4"/> Blood Sugar (mg/dL)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(entry.date, "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">{entry.dose ?? 'N/A'}</TableCell>
                    <TableCell className="text-right">{entry.level ?? 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
