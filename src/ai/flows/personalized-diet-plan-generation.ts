'use server';
/**
 * @fileOverview Personalized diet plan generation flow.
 *
 * This file defines a Genkit flow that generates a personalized diet plan based on user-provided medical conditions and calorie needs.
 *
 * @exports {
 *   generatePersonalizedDietPlan - Function to trigger the diet plan generation flow.
 *   PersonalizedDietPlanInput - Input type for the diet plan generation flow.
 *   PersonalizedDietPlanOutput - Output type for the diet plan generation flow.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const PersonalizedDietPlanInputSchema = z.object({
  medicalConditions: z
    .string()
    .describe('User specified medical conditions, comma separated.'),
  calorieNeeds: z.number().describe('Daily calorie requirements for the user.'),
});
export type PersonalizedDietPlanInput = z.infer<typeof PersonalizedDietPlanInputSchema>;

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
  dietPlan: z.array(MealSchema).describe('A list of meals for the diet plan.'),
  totalCalories: z.number().describe('Total calories for the diet plan.'),
  shoppingList: z
    .array(ShoppingListItemSchema)
    .describe('A list of food items needed for the diet plan.'),
  notes: z.string().describe('Important notes about the diet plan.'),
});
export type PersonalizedDietPlanOutput = z.infer<typeof PersonalizedDietPlanOutputSchema>;

const generatePersonalizedDietPlanPrompt = ai.definePrompt({
  name: 'generatePersonalizedDietPlanPrompt',
  input: {schema: PersonalizedDietPlanInputSchema},
  output: {schema: PersonalizedDietPlanOutputSchema},
  prompt: `You are a registered dietitian creating a personalized diet plan.

  Consider the following medical conditions: {{{medicalConditions}}}
  The user needs to consume approximately {{{calorieNeeds}}} calories per day.

  Create a diet plan with meal suggestions, a breakdown of calories for each meal, and a shopping list.  The output should be in JSON format and should validate against the PersonalizedDietPlanOutputSchema schema.

  Important:
  - Ensure the total calories in the diet plan matches the calorie needs of the user.
  - The shopping list should contain all the items required to prepare the meals in the diet plan.
  - Consider medical conditions to avoid any ingredient that could be harmful for the user.
  - Generate shopping list items with realistic quantities.

  Remember, the diet plan must be returned in JSON format and it must validate against the PersonalizedDietPlanOutputSchema. Include \"notes\" regarding medical conditions that the user should be aware of.
  {
    \"dietPlan\": [
      {
        \"name\": \"Meal 1 Name\",
        \"ingredients\": \"Ingredient 1, Ingredient 2, Ingredient 3\",
        \"calories\": 500
      },
      {
        \"name\": \"Meal 2 Name\",
        \"ingredients\": \"Ingredient A, Ingredient B, Ingredient C\",
        \"calories\": 600
      }
    ],
    \"totalCalories\": 1100,
    \"shoppingList\": [
      {
        \"item\": \"Ingredient 1\",
        \"quantity\": \"100g\"
      },
      {
        \"item\": \"Ingredient 2\",
        \"quantity\": \"50g\"
      }
    ],
    \"notes\": \"Avoid processed foods.\"
  }
  `,
});

const personalizedDietPlanGenerationFlow = ai.defineFlow(
  {
    name: 'personalizedDietPlanGenerationFlow',
    inputSchema: PersonalizedDietPlanInputSchema,
    outputSchema: PersonalizedDietPlanOutputSchema,
  },
  async input => {
    const {output} = await generatePersonalizedDietPlanPrompt(input);
    return output!;
  }
);

export async function generatePersonalizedDietPlan(
  input: PersonalizedDietPlanInput
): Promise<PersonalizedDietPlanOutput> {
  return personalizedDietPlanGenerationFlow(input);
}

