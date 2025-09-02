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
  // MOCK IMPLEMENTATION
  const plan = {
    dietPlan: [
      { name: 'Breakfast', ingredients: 'Oatmeal with berries and nuts', calories: 400 },
      { name: 'Lunch', ingredients: 'Grilled chicken salad with vinaigrette', calories: 600 },
      { name: 'Dinner', ingredients: 'Salmon with quinoa and steamed vegetables', calories: 700 }
    ],
    totalCalories: 1700,
    shoppingList: [
      { item: 'Oats', quantity: '100g' },
      { item: 'Mixed Berries', quantity: '50g' },
      { item: 'Almonds', quantity: '20g' },
      { item: 'Chicken Breast', quantity: '150g' },
      { item: 'Mixed Greens', quantity: '100g' },
      { item: 'Salmon Fillet', quantity: '150g' },
      { item: 'Quinoa', quantity: '80g' },
      { item: 'Broccoli', quantity: '1 cup' }
    ],
    notes: `This is a sample balanced diet plan. For your specific condition (${input.medicalConditions}), it's crucial to consult with a registered dietitian or your doctor. This plan provides a general framework for healthy eating.`
  };
  return new Promise(resolve => setTimeout(() => resolve(plan), 1000));
}
