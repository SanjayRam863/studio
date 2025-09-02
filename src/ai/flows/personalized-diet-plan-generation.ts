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
  return dietPlanFlow(input);
}

const dietPlanPrompt = ai.definePrompt({
  name: 'dietPlanPrompt',
  input: {schema: PersonalizedDietPlanInputSchema},
  output: {schema: PersonalizedDietPlanOutputSchema},
  prompt: `You are an expert nutritionist. Create a personalized one-day diet plan based on the user's medical conditions and calorie needs.

The user has the following medical conditions: {{{medicalConditions}}}.
Their daily calorie need is: {{{calorieNeeds}}} calories.

Your response must include:
1. A diet plan with three meals (breakfast, lunch, dinner). The total calories should be as close as possible to the user's daily need.
2. A detailed shopping list for all ingredients.
3. Important notes explaining the diet's focus and a disclaimer.

If the user specifies 'None' for medical conditions, create a general healthy diet plan.
For specific conditions like 'Diabetes', 'High Blood Pressure', or 'High Cholesterol', tailor the diet plan accordingly with specific, well-explained meal choices.
For breakfast, give around 25% of calories. For lunch, 35%. For dinner, 40%.
Ensure the meal suggestions are specific and sound appealing.`,
});

const dietPlanFlow = ai.defineFlow(
  {
    name: 'dietPlanFlow',
    inputSchema: PersonalizedDietPlanInputSchema,
    outputSchema: PersonalizedDietPlanOutputSchema,
  },
  async input => {
    const {output} = await dietPlanPrompt(input);
    if (!output) {
      throw new Error('Failed to generate diet plan.');
    }
    const disclaimer =
      '\n\nDisclaimer: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider or registered dietitian for an accurate diagnosis and treatment plan.';
    return {
      ...output,
      notes: output.notes + disclaimer,
    };
  }
);
