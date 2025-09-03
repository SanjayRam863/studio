'use server';
/**
 * @fileOverview Personalized diet plan generation flow.
 *
 * This file defines a function that generates a personalized diet plan based on user-provided medical conditions and calorie needs.
 *
 * @exports {
 *   generatePersonalizedDietPlan - Function to trigger the diet plan generation flow.
 *   PersonalizedDietPlanInput - Input type for the diet plan generation flow.
 *   PersonalizedDietPlanOutput - Output type for the diet plan generation flow.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedDietPlanInputSchema = z.object({
  medicalConditions: z
    .string()
    .describe('User specified medical conditions, comma separated. Can be "None".'),
  calorieNeeds: z.number().describe('Daily calorie requirements for the user.'),
});
export type PersonalizedDietPlanInput = z.infer<
  typeof PersonalizedDietPlanInputSchema
>;

const MealSchema = z.object({
  name: z.string().describe('Name of the meal'),
  ingredients: z.string().describe('List of ingredients required for the meal'),
  calories: z.number().describe('Number of calories in the meal'),
});

const ShoppingListItemSchema = z.object({
  item: z.string().describe('The name of the food item to buy.'),
  quantity: z.string().describe('The amount needed (e.g. 200g, 1 loaf).'),
});

const PersonalizedDietPlanOutputSchema = z.object({
  dietPlan: z
    .array(MealSchema)
    .describe('A list of three meals (breakfast, lunch, dinner) for the diet plan.'),
  totalCalories: z.number().describe('Total calories for the diet plan.'),
  shoppingList: z
    .array(ShoppingListItemSchema)
    .describe('A comprehensive list of all food items needed for the diet plan.'),
  notes: z
    .string()
    .describe(
      'Important notes about the diet plan, including a brief summary of the diet\'s focus and a disclaimer to consult a doctor.'
    ),
});
export type PersonalizedDietPlanOutput = z.infer<
  typeof PersonalizedDietPlanOutputSchema
>;

export async function generatePersonalizedDietPlan(
  input: PersonalizedDietPlanInput
): Promise<PersonalizedDietPlanOutput> {
  console.log('Generating diet plan for:', input);
  const llmResponse = await ai.generate({
    model: 'gemini-1.5-flash-latest',
    prompt: `Generate a personalized one-day diet plan for a user with the following medical conditions: ${input.medicalConditions}.
The target daily calorie intake is ${input.calorieNeeds} calories.
The plan should include three meals: breakfast, lunch, and dinner.
For each meal, provide a name, a list of ingredients, and the approximate calorie count.
Also, create a shopping list for all the ingredients required for the plan.
Finally, add some important notes, including a brief summary of the diet\'s focus and a disclaimer to consult a doctor.
Ensure the total calories for the day are as close to the target as possible.`,
    output: {
      schema: PersonalizedDietPlanOutputSchema,
    },
  });
  return llmResponse.output!;
}
