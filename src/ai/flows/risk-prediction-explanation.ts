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
  condition:
    z.enum(['Heart Disease', 'Diabetes', 'Stroke'])
      .describe('The health condition to explain the risk for.'),
  riskScore: z.number().describe('The calculated risk score for the condition.'),
  factors:
    z.string()
      .describe(
        'A comma-separated list of factors contributing to the risk score.'
      ),
});
export type RiskPredictionExplanationInput = z.infer<
  typeof RiskPredictionExplanationInputSchema
>;

const RiskPredictionExplanationOutputSchema = z.object({
  explanation:
    z.string()
      .describe(
        'A detailed explanation of the risk score and contributing factors for the specified health condition.'
      ),
  recommendations:
    z.string()
      .describe(
        'Specific recommendations for managing and reducing the risk associated with the condition.'
      ),
});
export type RiskPredictionExplanationOutput = z.infer<
  typeof RiskPredictionExplanationOutputSchema
>;

export async function riskPredictionExplanation(
  input: RiskPredictionExplanationInput
): Promise<RiskPredictionExplanationOutput> {
  return riskPredictionExplanationFlow(input);
}

const riskPredictionExplanationPrompt = ai.definePrompt({
  name: 'riskPredictionExplanationPrompt',
  input: {schema: RiskPredictionExplanationInputSchema},
  output: {schema: RiskPredictionExplanationOutputSchema},
  prompt: `You are an expert health advisor explaining risk scores to users.

  Explain the risk score for the given condition, based on the factors that contribute to it. Provide recommendations on how to manage and reduce the risk.

  Condition: {{{condition}}}
  Risk Score: {{{riskScore}}}
  Contributing Factors: {{{factors}}}
  `,
});

const riskPredictionExplanationFlow = ai.defineFlow(
  {
    name: 'riskPredictionExplanationFlow',
    inputSchema: RiskPredictionExplanationInputSchema,
    outputSchema: RiskPredictionExplanationOutputSchema,
  },
  async input => {
    const {output} = await riskPredictionExplanationPrompt(input);
    return output!;
  }
);
