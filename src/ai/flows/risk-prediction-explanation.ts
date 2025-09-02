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

const riskPredictionPrompt = ai.definePrompt({
    name: 'riskPredictionPrompt',
    model: 'googleai/gemini-1.5-flash',
    input: { schema: RiskPredictionExplanationInputSchema },
    output: { schema: RiskPredictionExplanationOutputSchema },
    prompt: `You are a medical expert providing a risk assessment for a user.
Condition: {{{condition}}}
Calculated Risk Score: {{{riskScore}}}%
Contributing Factors: {{{factors}}}

1.  **Explanation**:
    -   Start by stating the user's risk score for the specified condition.
    -   Briefly explain what the risk score means in simple terms.
    -   Go through each of the contributing factors and explain clearly and concisely how it influences the risk for the specific condition. For example, explain *why* being a smoker increases the risk of heart disease.

2.  **Recommendations**:
    -   Provide specific, actionable recommendations tailored to the selected condition to help the user manage and reduce their risk.
    -   Structure the recommendations under two markdown headings: '### Dietary Changes' and '### Lifestyle Modifications'.
    -   Under each heading, provide a bulleted list (using '-') of 3-5 clear, practical tips.
    -   For **Heart Disease**: Suggest the DASH or Mediterranean diet, limiting sodium and unhealthy fats, and increasing omega-3s. For lifestyle, suggest specific types and durations of exercise, stress management, and smoking cessation.
    -   For **Diabetes**: Suggest monitoring carbs, choosing complex over simple carbs, increasing fiber, and eating balanced meals. For lifestyle, recommend regular physical activity, weight management, and blood sugar monitoring.
    -   For **Stroke**: Suggest a diet low in cholesterol and saturated fats, increasing potassium, and limiting alcohol. For lifestyle, emphasize blood pressure control, managing atrial fibrillation if present, and knowing the signs of a stroke.
    -   Finally, add a disclaimer at the end: '**Disclaimer**: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.'
`
});

const riskPredictionFlow = ai.defineFlow(
  {
    name: 'riskPredictionFlow',
    inputSchema: RiskPredictionExplanationInputSchema,
    outputSchema: RiskPredictionExplanationOutputSchema,
  },
  async input => {
    const { output } = await riskPredictionPrompt(input);
    if (!output) {
        throw new Error('The AI model did not return a valid explanation.');
    }
    return output;
  }
);
