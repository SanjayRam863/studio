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

const dietPlanFlow = ai.defineFlow(
  {
    name: 'dietPlanFlow',
    inputSchema: PersonalizedDietPlanInputSchema,
    outputSchema: PersonalizedDietPlanOutputSchema,
  },
  async (input: PersonalizedDietPlanInput) => {
    const { medicalConditions, calorieNeeds } = input;
    let dietPlan, shoppingList, notes, totalCalories;

    const lowerCaseConditions = medicalConditions.toLowerCase();

    if (lowerCaseConditions.includes('diabetes')) {
      notes = "This diet plan focuses on managing blood sugar levels by including complex carbohydrates, lean proteins, and healthy fats. It limits sugars and refined carbs. Portion control is key.";
      dietPlan = [
        { name: 'Breakfast (25%)', ingredients: 'Scrambled Eggs with Spinach and a side of whole-wheat toast.', calories: Math.round(calorieNeeds * 0.25) },
        { name: 'Lunch (35%)', ingredients: 'Grilled Chicken Salad with mixed greens, vegetables, and a light vinaigrette.', calories: Math.round(calorieNeeds * 0.35) },
        { name: 'Dinner (40%)', ingredients: 'Baked Salmon with quinoa and steamed asparagus.', calories: Math.round(calorieNeeds * 0.40) },
      ];
      shoppingList = [
        { item: 'Eggs', quantity: '6' },
        { item: 'Spinach', quantity: '1 bag' },
        { item: 'Whole-wheat toast', quantity: '1 loaf' },
        { item: 'Chicken Breast', quantity: '200g' },
        { item: 'Mixed Greens', quantity: '1 bag' },
        { item: 'Vinaigrette Dressing', quantity: '1 bottle' },
        { item: 'Salmon Fillet', quantity: '150g' },
        { item: 'Quinoa', quantity: '1 cup' },
        { item: 'Asparagus', quantity: '1 bunch' },
      ];
    } else if (lowerCaseConditions.includes('high blood pressure')) {
      notes = "This is a DASH-style diet, designed to lower blood pressure. It is rich in fruits, vegetables, and low-fat dairy, while low in sodium and saturated fats.";
      dietPlan = [
        { name: 'Breakfast (25%)', ingredients: 'Oatmeal with berries and a sprinkle of nuts.', calories: Math.round(calorieNeeds * 0.25) },
        { name: 'Lunch (35%)', ingredients: 'Turkey and Avocado Sandwich on whole-wheat bread with a side of carrot sticks.', calories: Math.round(calorieNeeds * 0.35) },
        { name: 'Dinner (40%)', ingredients: 'Lentil Soup with a side salad.', calories: Math.round(calorieNeeds * 0.40) },
      ];
      shoppingList = [
        { item: 'Rolled Oats', quantity: '1 container' },
        { item: 'Mixed Berries (frozen or fresh)', quantity: '1 bag' },
        { item: 'Mixed Nuts', quantity: '1 bag' },
        { item: 'Sliced Turkey', quantity: '200g' },
        { item: 'Avocado', quantity: '1' },
        { item: 'Whole-wheat bread', quantity: '1 loaf' },
        { item: 'Carrots', quantity: '1 bag' },
        { item: 'Lentils', quantity: '1 can/bag' },
        { item: 'Mixed Greens for salad', quantity: '1 bag' },
      ];
    } else if (lowerCaseConditions.includes('high cholesterol')) {
        notes = "This plan focuses on heart-healthy fats, soluble fiber, and limiting saturated fats to help lower cholesterol levels.";
        dietPlan = [
            { name: 'Breakfast (25%)', ingredients: 'Greek yogurt with sliced almonds and a banana.', calories: Math.round(calorieNeeds * 0.25) },
            { name: 'Lunch (35%)', ingredients: 'Tuna salad (made with yogurt instead of mayo) on whole grain crackers, with apple slices.', calories: Math.round(calorieNeeds * 0.35) },
            { name: 'Dinner (40%)', ingredients: 'Black Bean Burgers on a whole-wheat bun with a sweet potato.', calories: Math.round(calorieNeeds * 0.40) },
        ];
        shoppingList = [
            { item: 'Greek Yogurt', quantity: '1 tub' },
            { item: 'Sliced Almonds', quantity: '1 bag' },
            { item: 'Bananas', quantity: '3' },
            { item: 'Canned Tuna', quantity: '1 can' },
            { item: 'Whole grain crackers', quantity: '1 box' },
            { item: 'Apples', quantity: '2' },
            { item: 'Canned Black Beans', quantity: '1 can' },
            { item: 'Whole-wheat buns', quantity: '1 pack' },
            { item: 'Sweet Potato', quantity: '1' },
        ];
    } else {
      notes = "This is a general healthy eating plan. It provides a balance of macronutrients and is rich in vitamins and minerals from a variety of food sources.";
      dietPlan = [
        { name: 'Breakfast (25%)', ingredients: 'Avocado Toast on whole-wheat bread with a hard-boiled egg.', calories: Math.round(calorieNeeds * 0.25) },
        { name: 'Lunch (35%)', ingredients: 'Quinoa bowl with chickpeas, mixed vegetables, and a lemon-tahini dressing.', calories: Math.round(calorieNeeds * 0.35) },
        { name: 'Dinner (40%)', ingredients: 'Stir-fried Tofu with broccoli and brown rice.', calories: Math.round(calorieNeeds * 0.40) },
      ];
      shoppingList = [
        { item: 'Avocado', quantity: '1' },
        { item: 'Whole-wheat bread', quantity: '1 loaf' },
        { item: 'Eggs', quantity: '2' },
        { item: 'Quinoa', quantity: '1 cup' },
        { item: 'Canned Chickpeas', quantity: '1 can' },
        { item: 'Mixed Vegetables (e.g., bell peppers, cucumber)', quantity: 'various' },
        { item: 'Lemon', quantity: '1' },
        { item: 'Tahini', quantity: '1 jar' },
        { item: 'Tofu', quantity: '1 block' },
        { item: 'Broccoli', quantity: '1 head' },
        { item: 'Brown Rice', quantity: '1 bag' },
      ];
    }

    totalCalories = dietPlan.reduce((acc, meal) => acc + meal.calories, 0);
    const disclaimer = '\n\nDisclaimer: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider or registered dietitian for an accurate diagnosis and treatment plan.';
    
    return {
      dietPlan,
      shoppingList,
      totalCalories,
      notes: notes + disclaimer,
    };
  }
);
