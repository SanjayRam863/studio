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
  PersonalizedDietPlanOutput,
  generatePersonalizedDietPlan,
} from "@/ai/flows/personalized-diet-plan-generation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

const formSchema = z.object({
  medicalConditions: z
    .string()
    .min(1, "Please enter at least one condition or 'None'."),
  calorieNeeds: z.coerce
    .number()
    .min(500, "Calorie needs must be at least 500.")
    .max(10000, "Calorie needs seem too high."),
});

type FormValues = z.infer<typeof formSchema>;

export function DietPlanForm() {
  const { toast } = useToast();
  const [dietPlan, setDietPlan] = useState<PersonalizedDietPlanOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicalConditions: "",
      calorieNeeds: 2000,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setDietPlan(null);
    try {
      const result = await generatePersonalizedDietPlan(values);
      setDietPlan(result);
    } catch (error) {
      console.error("Error generating diet plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate diet plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="medicalConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Conditions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Diabetes, High Blood Pressure"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List any medical conditions, separated by commas. Type 'None'
                      if you have no conditions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="calorieNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Calorie Needs</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your estimated daily calorie requirement.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <DietPlanSkeleton />}

      {dietPlan && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Personalized Diet Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="plan">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="plan">Diet Plan</TabsTrigger>
                <TabsTrigger value="shopping">Shopping List</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="plan" className="mt-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Total Calories:{" "}
                    <Badge variant="secondary">{dietPlan.totalCalories}</Badge>
                  </p>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {dietPlan.dietPlan.map((meal, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{meal.name}</CardTitle>
                          <p className="text-sm font-medium text-primary">
                            {meal.calories} calories
                          </p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {meal.ingredients}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="shopping" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dietPlan.shoppingList.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.item}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="notes" className="mt-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {dietPlan.notes}
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </>
  );
}

function DietPlanSkeleton() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <Skeleton className="h-8 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
