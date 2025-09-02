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
import {googleAI} from '@genkit-ai/googleai';

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
  input: {schema: RiskPredictionExplanationInputSchema},
  output: {schema: RiskPredictionExplanationOutputSchema},
  model: googleAI.model('gemini-1.5-flash-latest'),
  prompt: `You are an expert medical AI. Your role is to explain a user's health risk and provide tailored recommendations.

Analyze the following data:
- Condition: {{{condition}}}
- Risk Score: {{{riskScore}}}%
- Contributing Factors: "{{{factors}}}"

Based on this information, provide:
1.  A clear explanation of why the risk score is what it is, referencing the specific contributing factors.
2.  Actionable recommendations to manage and reduce the risk. These should be specific to the condition. For example, for Heart Disease, suggest the DASH diet. For Diabetes, focus on carbohydrate management. For Stroke, emphasize blood pressure control. Use markdown for formatting recommendations with "###" for headings and "-" for list items.`,
});

const riskPredictionFlow = ai.defineFlow(
  {
    name: 'riskPredictionFlow',
    inputSchema: RiskPredictionExplanationInputSchema,
    outputSchema: RiskPredictionExplanationOutputSchema,
  },
  async input => {
    const {output} = await riskPredictionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate risk explanation.');
    }
    const disclaimer =
      '\n\n**Disclaimer**: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.';
    return {
      ...output,
      recommendations: output.recommendations + disclaimer,
    };
  }
);
