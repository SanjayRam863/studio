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
  model: 'googleai/gemini-1.5-flash',
  input: { schema: PersonalizedDietPlanInputSchema },
  output: { schema: PersonalizedDietPlanOutputSchema },
  prompt: `You are a professional nutritionist. Create a personalized one-day diet plan for a user based on their medical conditions and daily calorie needs. The plan should consist of three meals: breakfast, lunch, and dinner.

User's Medical Conditions: {{{medicalConditions}}}
User's Daily Calorie Needs: {{{calorieNeeds}}}

Instructions:
1.  **Diet Plan**: Create a diet plan with three distinct meals. Distribute the total calories appropriately across these meals. For each meal, provide a name (e.g., "Breakfast"), a list of ingredients, and the calculated calorie count.
2.  **Total Calories**: Ensure the sum of calories from all meals closely matches the user's daily calorie needs.
3.  **Shopping List**: Generate a consolidated shopping list of all the ingredients required for the entire day's meals, specifying the item and quantity.
4.  **Notes**: Provide a brief, insightful note explaining the rationale behind the diet plan, especially considering the user's medical conditions. Also, include a standard disclaimer advising the user to consult with a healthcare provider. If the condition is "None", create a balanced, generally healthy diet plan.
5.  **Tailor the plan**:
    -   For **Diabetes**, focus on low-glycemic index foods, complex carbs, lean proteins, and healthy fats. Limit sugars and refined carbs.
    -   For **High Blood Pressure**, create a DASH-style diet, rich in fruits, vegetables, whole grains, and low-fat dairy, while being low in sodium.
    -   For **High Cholesterol**, focus on heart-healthy fats (like those in avocados and nuts), soluble fiber (oats, beans), and limiting saturated and trans fats.
`,
});

const dietPlanFlow = ai.defineFlow(
  {
    name: 'dietPlanFlow',
    inputSchema: PersonalizedDietPlanInputSchema,
    outputSchema: PersonalizedDietPlanOutputSchema,
  },
  async (input) => {
    const { output } = await dietPlanPrompt(input);
    if (!output) {
      throw new Error('The AI model did not return a valid diet plan.');
    }
    return output;
  }
);
