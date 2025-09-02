'use server';

/**
 * @fileOverview This flow provides explanations for risk predictions related to Heart Disease, Diabetes, and Stroke.
 *
 * - riskPredictionExplanation - A function that generates explanations for risk scores.
 * - RiskPredictionExplanationInput - The input type for the riskPredictionExplanation function.
 * - RiskPredictionExplanationOutput - The return type for the riskPredictionExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

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
    console.log("Generating risk explanation for:", input);
    // MOCK IMPLEMENTATION
    const mockOutput = {
        explanation: `Your risk score of ${input.riskScore}% for ${input.condition} is influenced by factors such as: ${input.factors}. Each of these elements can contribute to the likelihood of developing this condition over time. A higher BMI, for instance, can strain the cardiovascular system.`,
        recommendations: `### Dietary Changes
- Reduce sodium intake to lower blood pressure.
- Focus on whole grains, fruits, and vegetables.
- Limit processed foods and sugary drinks.
### Lifestyle Modifications
- Engage in at least 30 minutes of moderate exercise daily.
- If you smoke, consider quitting.
- Monitor your blood pressure regularly.
**Disclaimer**: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.`
    };
    return new Promise(resolve => setTimeout(() => resolve(mockOutput), 1000));
}
