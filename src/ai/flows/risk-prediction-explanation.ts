'use server';

/**
 * @fileOverview This flow provides explanations for risk predictions related to Heart Disease, Diabetes, and Stroke.
 *
 * - riskPredictionExplanation - A function that generates explanations for risk scores.
 * - RiskPredictionExplanationInput - The input type for the riskPredictionExplanation function.
 * - RiskPredictionExplanationOutput - The return type for the riskPredictionExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskPredictionExplanationInputSchema = z.object({
  condition: z
    .enum(['Heart Disease', 'Diabetes', 'Stroke'])
    .describe('The health condition to explain the risk for.'),
  riskScore: z
    .number()
    .describe('The calculated risk score for the condition.'),
  factors: z
    .string()
    .describe(
      'A comma-separated list of factors contributing to the risk score.'
    ),
});
export type RiskPredictionExplanationInput = z.infer<
  typeof RiskPredictionExplanationInputSchema
>;

const RiskPredictionExplanationOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A detailed explanation of the risk score and contributing factors for the specified health condition. Explain how each factor contributes to the risk.'
    ),
  recommendations: z
    .string()
    .describe(
      'Specific, actionable recommendations for managing and reducing the risk associated with the condition. Provide detailed, condition-specific dietary and lifestyle advice formatted with markdown using "###" for headings and "-" for list items.'
    ),
});
export type RiskPredictionExplanationOutput = z.infer<
  typeof RiskPredictionExplanationOutputSchema
>;

export async function riskPredictionExplanation(
  input: RiskPredictionExplanationInput
): Promise<RiskPredictionExplanationOutput> {
  return riskPredictionFlow(input);
}

const riskPredictionFlow = ai.defineFlow(
  {
    name: 'riskPredictionFlow',
    inputSchema: RiskPredictionExplanationInputSchema,
    outputSchema: RiskPredictionExplanationOutputSchema,
  },
  async input => {
    const { condition, riskScore, factors } = input;
    
    let explanation = `Your risk score of ${riskScore}% for ${condition} is based on several factors. A higher score suggests a greater likelihood of developing the condition. The contributing factors identified were: ${factors}. Each of these can influence your risk in different ways. For example, age is a known risk factor, and a higher BMI can strain your body's systems.`;
    
    let recommendations = '';

    switch (condition) {
      case 'Heart Disease':
        recommendations = `
### Dietary Changes
- Adopt a DASH (Dietary Approaches to Stop Hypertension) or Mediterranean diet.
- Reduce sodium intake to less than 2,300 milligrams per day.
- Limit saturated and trans fats found in red meat and full-fat dairy.
### Lifestyle Modifications
- Engage in at least 150 minutes of moderate-intensity aerobic exercise per week.
- If you smoke, quitting is the single most effective way to reduce your risk.
- Manage stress through techniques like meditation or yoga.`;
        break;
      case 'Diabetes':
        recommendations = `
### Dietary Changes
- Monitor carbohydrate intake and choose complex carbohydrates (whole grains, legumes) over simple sugars.
- Increase your intake of fiber-rich foods.
- Eat regular, balanced meals to help manage blood sugar levels.
### Lifestyle Modifications
- Aim for at least 30 minutes of physical activity most days of the week.
- Monitor your blood sugar levels as recommended by a healthcare provider.
- Maintain a healthy weight, as excess body fat can increase insulin resistance.`;
        break;
      case 'Stroke':
        recommendations = `
### Dietary Changes
- Focus on a diet low in cholesterol and saturated fats.
- Increase potassium intake from sources like bananas, spinach, and sweet potatoes to help manage blood pressure.
- Limit alcohol consumption.
### Lifestyle Modifications
- Control high blood pressure through diet, exercise, and medication if prescribed.
- If you have atrial fibrillation, work with your doctor to manage it.
- Understand the signs of a stroke (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services).`;
        break;
    }

    const disclaimer = '\n\n**Disclaimer**: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.';
    
    return {
      explanation,
      recommendations: recommendations + disclaimer,
    };
  }
);
