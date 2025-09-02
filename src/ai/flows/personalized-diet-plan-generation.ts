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
  const lowerCaseConditions = medicalConditions.toLowerCase();

  const breakfastCalories = Math.round(calorieNeeds * 0.25);
  const lunchCalories = Math.round(calorieNeeds * 0.35);
  const dinnerCalories = Math.round(calorieNeeds * 0.40);

  let dietPlan: z.infer<typeof MealSchema>[] = [];
  let shoppingList: z.infer<typeof ShoppingListItemSchema>[] = [];
  let notes = '';

  if (lowerCaseConditions.includes('diabetes')) {
    dietPlan = [
      {
        name: 'Breakfast: Scrambled Eggs with Spinach',
        ingredients: '2 Large Eggs, 1 cup Spinach, 1 slice Whole-Grain Toast',
        calories: breakfastCalories,
      },
      {
        name: 'Lunch: Lentil Soup',
        ingredients: '1 cup Lentils, Mixed Vegetables (Carrots, Celery), Vegetable Broth',
        calories: lunchCalories,
      },
      {
        name: 'Dinner: Baked Cod with Asparagus',
        ingredients: '150g Cod Fillet, 1 bunch Asparagus, 1/2 cup Brown Rice, Lemon',
        calories: dinnerCalories,
      },
    ];
    shoppingList = [
        { item: 'Eggs', quantity: '1 dozen' },
        { item: 'Spinach', quantity: '1 bag' },
        { item: 'Whole-Grain Bread', quantity: '1 loaf' },
        { item: 'Lentils', quantity: '500g' },
        { item: 'Carrots', quantity: '1 bag' },
        { item: 'Celery', quantity: '1 stalk' },
        { item: 'Vegetable Broth', quantity: '1L' },
        { item: 'Cod Fillet', quantity: '300g' },
        { item: 'Asparagus', quantity: '1 bunch' },
        { item: 'Brown Rice', quantity: '500g' },
    ];
    notes = "This diet plan is designed for managing diabetes by focusing on low-glycemic foods, high fiber, and lean protein to help stabilize blood sugar levels.\n\n- Emphasizes whole grains and vegetables.\n- Limits sugars and refined carbs.\n- Portion control is crucial. Always monitor your blood glucose as recommended by your doctor.";
  } else if (lowerCaseConditions.includes('high blood pressure')) {
    dietPlan = [
      {
        name: 'Breakfast: Greek Yogurt with Banana and Nuts',
        ingredients: '1 cup Plain Greek Yogurt, 1 Banana, 2 tbsp Unsalted Almonds',
        calories: breakfastCalories,
      },
      {
        name: 'Lunch: Turkey and Avocado Wrap',
        ingredients: '100g Sliced Turkey, 1/2 Avocado, 1 Whole-Wheat Tortilla, Lettuce and Tomato',
        calories: lunchCalories,
      },
      {
        name: 'Dinner: Grilled Chicken with Sweet Potato',
        ingredients: '150g Chicken Breast, 1 medium Sweet Potato, Steamed Green Beans',
        calories: dinnerCalories,
      },
    ];
    shoppingList = [
        { item: 'Plain Greek Yogurt', quantity: '500g' },
        { item: 'Bananas', quantity: '3' },
        { item: 'Unsalted Almonds', quantity: '100g' },
        { item: 'Sliced Turkey Breast', quantity: '200g' },
        { item: 'Avocado', quantity: '2' },
        { item: 'Whole-Wheat Tortillas', quantity: '1 pack' },
        { item: 'Lettuce', quantity: '1 head' },
        { item: 'Tomato', quantity: '2' },
        { item: 'Chicken Breast', quantity: '300g' },
        { item: 'Sweet Potatoes', quantity: '2' },
        { item: 'Green Beans', quantity: '1 bag' },
    ];
    notes = "This diet plan helps manage high blood pressure by emphasizing potassium-rich foods and limiting sodium.\n\n- Rich in fruits, vegetables, and lean protein.\n- Avoid adding salt to meals; use herbs and spices for flavor instead.\n- Limit processed foods, which are often high in sodium.";
  } else if (lowerCaseConditions.includes('high cholesterol')) {
    dietPlan = [
      {
        name: 'Breakfast: Oatmeal with Apples and Cinnamon',
        ingredients: '1/2 cup Rolled Oats, 1 Apple, Cinnamon, 1 tbsp Flaxseeds',
        calories: breakfastCalories,
      },
      {
        name: 'Lunch: Black Bean Burger on Whole-Wheat Bun',
        ingredients: '1 Black Bean Patty, 1 Whole-Wheat Bun, Mixed Greens',
        calories: lunchCalories,
      },
      {
        name: 'Dinner: Tofu Stir-fry with Mixed Vegetables',
        ingredients: '150g Firm Tofu, Broccoli, Bell Peppers, Carrots, Low-Sodium Soy Sauce',
        calories: dinnerCalories,
      },
    ];
    shoppingList = [
        { item: 'Rolled Oats', quantity: '500g' },
        { item: 'Apples', quantity: '3' },
        { item: 'Cinnamon', quantity: '1 jar' },
        { item: 'Flaxseeds', quantity: '100g' },
        { item: 'Black Bean Patties', quantity: '1 pack' },
        { item: 'Whole-Wheat Buns', quantity: '1 pack' },
        { item: 'Mixed Greens', quantity: '1 bag' },
        { item: 'Firm Tofu', quantity: '400g' },
        { item: 'Broccoli', quantity: '1 head' },
        { item: 'Bell Peppers', quantity: '2' },
        { item: 'Low-Sodium Soy Sauce', quantity: '1 bottle' },
    ];
    notes = "This diet is designed to help lower cholesterol by focusing on soluble fiber, healthy fats, and plant-based proteins.\n\n- High in fiber from oats, beans, and vegetables.\n- Low in saturated and trans fats.\n- Incorporates sources of healthy fats like flaxseeds.";
  } else {
    // General Healthy Diet
    dietPlan = [
      {
        name: 'Breakfast: Oatmeal with Berries',
        ingredients: 'Rolled Oats, Mixed Berries, Almond Milk, Chia Seeds',
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
    shoppingList = [
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
    notes = "This is a balanced, general-purpose healthy diet plan.\n\n- Focuses on a mix of lean protein, whole grains, and plenty of vegetables.\n- Since you have no specified conditions, maintain a balanced diet and regular physical activity for optimal health.\n- Feel free to vary the vegetables and proteins to keep meals interesting.";
  }

  notes += `\n\nThis plan is a general guideline. Always consult with your doctor or a registered dietitian for advice tailored to your specific health needs.`;

  return {
    dietPlan,
    totalCalories: breakfastCalories + lunchCalories + dinnerCalories,
    shoppingList,
    notes,
  };
}
