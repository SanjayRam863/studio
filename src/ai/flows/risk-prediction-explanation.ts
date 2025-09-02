'use server';

/**
 * @fileOverview This flow provides explanations for risk predictions related to Heart Disease, Diabetes, and Stroke using an AI model.
 *
 * - riskPredictionExplanation - A function that generates AI-powered explanations for risk scores.
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
      'A detailed explanation of the risk score and contributing factors for the specified health condition.'
    ),
  recommendations: z
    .string()
    .describe(
      'Specific, actionable recommendations for managing and reducing the risk associated with the condition.'
    ),
});
export type RiskPredictionExplanationOutput = z.infer<
  typeof RiskPredictionExplanationOutputSchema
>;

const riskExplanationPrompt = ai.definePrompt({
  name: 'riskExplanationPrompt',
  input: {schema: RiskPredictionExplanationInputSchema},
  output: {schema: RiskPredictionExplanationOutputSchema},
  prompt: `You are a medical expert providing a risk assessment. The user has a simulated risk score for a specific condition.
Your task is to provide a clear, empathetic explanation of the risk score and give specific, actionable recommendations.

Do not state that this is a simulation. Be direct and helpful.

Condition: {{{condition}}}
Simulated Risk Score: {{{riskScore}}}%
Contributing Factors: {{{factors}}}

Based on this information, generate:
1.  An 'explanation' that details what the risk score means and how the contributing factors (like age, BMI, smoking) influence the risk for the specified condition.
2.  A set of 'recommendations' that are tailored to the user's situation. Be specific. For example, instead of "eat healthy," suggest "incorporate leafy greens like spinach and kale into your diet, and reduce red meat consumption." If the user is a smoker, a key recommendation should be about quitting smoking. Provide at least 3-5 distinct recommendations. Format them as a markdown list.`,
});

const riskPredictionExplanationFlow = ai.defineFlow(
  {
    name: 'riskPredictionExplanationFlow',
    inputSchema: RiskPredictionExplanationInputSchema,
    outputSchema: RiskPredictionExplanationOutputSchema,
  },
  async input => {
    const {output} = await riskExplanationPrompt(input);
    return output!;
  }
);

export async function riskPredictionExplanation(
  input: RiskPredictionExplanationInput
): Promise<RiskPredictionExplanationOutput> {
  return riskPredictionExplanationFlow(input);
}
