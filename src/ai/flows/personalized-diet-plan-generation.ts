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

import {z} from 'genkit';

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

export async function generatePersonalizedDietPlan(
  input: PersonalizedDietPlanInput
): Promise<PersonalizedDietPlanOutput> {
  // Simulate a delay to mimic an API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { medicalConditions, calorieNeeds } = input;

  const breakfastCalories = Math.round(calorieNeeds * 0.25);
  const lunchCalories = Math.round(calorieNeeds * 0.35);
  const dinnerCalories = Math.round(calorieNeeds * 0.40);

  const dietPlan = [
    {
      name: 'Breakfast: Oatmeal with Berries',
      ingredients: 'Rolled Oats, Mixed Berries (Fresh or Frozen), Almond Milk, Chia Seeds',
      calories: breakfastCalories,
    },
    {
      name: 'Lunch: Grilled Chicken Salad',
      ingredients: 'Grilled Chicken Breast, Mixed Greens, Cherry Tomatoes, Cucumber, Olive Oil Vinaigrette',
      calories: lunchCalories,
    },
    {
      name: 'Dinner: Salmon with Quinoa and Steamed Vegetables',
      ingredients: 'Salmon Fillet, Quinoa, Broccoli, Carrots, Lemon',
      calories: dinnerCalories,
    },
  ];

  const shoppingList = [
    { item: 'Rolled Oats', quantity: '500g' },
    { item: 'Mixed Berries', quantity: '300g' },
    { item: 'Almond Milk', quantity: '1L' },
    { item: 'Chia Seeds', quantity: '100g' },
    { item: 'Chicken Breast', quantity: '400g' },
    { item: 'Mixed Greens', quantity: '1 bag' },
    { item: 'Cherry Tomatoes', quantity: '1 punnet' },
    { item: 'Cucumber', quantity: '1' },
    { item: 'Olive Oil', quantity: '1 bottle' },
    { item: 'Salmon Fillet', quantity: '300g' },
    { item: 'Quinoa', quantity: '250g' },
    { item: 'Broccoli', quantity: '1 head' },
    { item: 'Carrots', quantity: '1 bag' },
    { item: 'Lemon', quantity: '2' },
  ];
  
  let notes = "This is a general healthy diet plan. ";
  if (medicalConditions.toLowerCase().includes('diabetes')) {
    notes += "For diabetes, it's important to monitor carbohydrate intake and choose whole grains. This plan incorporates this, but portion control is key. ";
  }
  if (medicalConditions.toLowerCase().includes('high blood pressure')) {
    notes += "To manage high blood pressure, this plan is low in sodium. Avoid adding extra salt to your meals. ";
  }
  if (medicalConditions.toLowerCase() === 'none' || medicalConditions.trim() === '') {
    notes += "Since you have no specific medical conditions, focus on maintaining a balanced diet and regular physical activity."
  } else {
    notes += `Always consult with your doctor or a registered dietitian for advice tailored to your specific health needs, especially concerning '${medicalConditions}'.`
  }
  

  return {
    dietPlan,
    totalCalories: breakfastCalories + lunchCalories + dinnerCalories,
    shoppingList,
    notes,
  };
}
