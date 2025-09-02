'use server';

/**
 * @fileOverview This flow provides explanations for risk predictions related to Heart Disease, Diabetes, and Stroke.
 *
 * - riskPredictionExplanation - A function that generates explanations for risk scores.
 * - RiskPredictionExplanationInput - The input type for the riskPredictionExplanation function.
 * - RiskPredictionExplanationOutput - The return type for the riskPredictionExplanation function.
 */
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

export async function riskPredictionExplanation(
  input: RiskPredictionExplanationInput
): Promise<RiskPredictionExplanationOutput> {
  // Simulate a delay to mimic an API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { condition, riskScore, factors } = input;
  const lowercasedFactors = factors.toLowerCase();

  let explanation = `Your risk score of ${riskScore}% for ${condition} is influenced by several factors. `;
  explanation += `Specifically, these include: ${factors}. `;

  if (lowercasedFactors.includes('age')) {
    explanation += 'Age is a significant non-modifiable risk factor; risk tends to increase with age. ';
  }
  if (lowercasedFactors.includes('bmi')) {
    explanation += 'A higher BMI can contribute to conditions like high blood pressure and cholesterol, increasing risk. ';
  }
   if (lowercasedFactors.includes('smoker')) {
    explanation += 'Smoking damages blood vessels and can dramatically increase the risk of cardiovascular diseases. ';
  }
  if (lowercasedFactors.includes('family history')) {
    explanation += 'A family history suggests a genetic predisposition, which can increase your risk. ';
  }

  let recommendations = 'Here are some tailored recommendations:\n';
  
  // General recommendations based on factors
  if (lowercasedFactors.includes('bmi')) {
      recommendations += '- Nutrition: Focus on a balanced diet rich in fruits, vegetables, and whole grains. Reduce intake of processed foods and sugary drinks.\n';
      recommendations += '- Exercise: Aim for at least 150 minutes of moderate-intensity exercise, like brisk walking or cycling, per week.\n'
  }
   if (lowercasedFactors.includes('smoker')) {
      recommendations += '- Quit Smoking: This is a critical step. Seek support from a healthcare provider or cessation programs.\n'
  }

  // Condition-specific recommendations
  if (condition === 'Heart Disease') {
    recommendations += '- Diet: Emphasize a heart-healthy diet, low in sodium and saturated fats. Incorporate foods like oats, fatty fish (salmon), and nuts.\n';
    recommendations += '- Monitoring: Regularly check your blood pressure and cholesterol levels.\n';
  } else if (condition === 'Diabetes') {
    recommendations += '- Diet: Monitor carbohydrate intake and focus on low-glycemic foods to manage blood sugar levels. Prioritize fiber-rich foods.\n';
    recommendations += '- Monitoring: Regularly check your blood glucose levels as advised by your doctor.\n';
  } else if (condition === 'Stroke') {
    recommendations += '- Blood Pressure Control: Managing high blood pressure is the most critical step to reduce stroke risk. \n';
    recommendations += '- Know the Signs: Be aware of the signs of a stroke (F.A.S.T: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services).\n';
  }


  if (riskScore > 50) {
     recommendations += "- Regular Check-ups: Given the risk score, it's crucial to have regular check-ups with your doctor to monitor your health status and discuss a personalized prevention plan.\n"
  } else {
      recommendations += "- Healthy Lifestyle: Continue maintaining a healthy lifestyle. Even with a lower risk score, prevention is key.\n"
  }
  
  recommendations += '\nDisclaimer: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.';


  return {
    explanation,
    recommendations,
  };
}
