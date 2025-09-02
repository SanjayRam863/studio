'use server';
/**
 * @fileOverview A flow to find medical attenders for senior citizens.
 *
 * This file defines a function that uses a tool to find nearby medical attenders
 * based on a user-provided location.
 *
 * @exports {
 *   findMedicalAttenders - Function to trigger the medical attender search.
 *   MedicalAttenderInput - Input type for the search.
 *   MedicalAttenderOutput - Output type for the search.
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MedicalAttenderInputSchema = z.object({
  location: z.string().describe('The city and state to search for medical attenders (e.g., "Chennai, TN").'),
});
export type MedicalAttenderInput = z.infer<typeof MedicalAttenderInputSchema>;

const AttenderSchema = z.object({
    name: z.string().describe("The name of the agency or individual attender."),
    address: z.string().describe("The physical address of the attender."),
    contact: z.string().describe("The phone number or email for contacting the attender."),
    services: z.array(z.string()).describe("A list of services offered (e.g., 'In-home care', '24/7 support')."),
});

const MedicalAttenderOutputSchema = z.object({
  attenders: z.array(AttenderSchema).describe("A list of medical attenders found."),
  response: z.string().describe("A summary of the search results or a message if no results were found.")
});
export type MedicalAttenderOutput = z.infer<typeof MedicalAttenderOutputSchema>;


const findAttendersTool = ai.defineTool(
    {
        name: 'findAttendersTool',
        description: 'Finds medical attenders for senior citizens in a specific location. Returns a list of attenders or an empty list if none are found.',
        inputSchema: MedicalAttenderInputSchema,
        outputSchema: z.object({
            attenders: z.array(AttenderSchema),
        }),
    },
    async (input) => {
        // This is a mock implementation. In a real application, this would
        // call a real API or database to find attenders.
        console.log(`Searching for attenders in ${input.location}...`);

        // Simulate a database of attenders
        const mockDatabase: { [key: string]: z.infer<typeof AttenderSchema>[] } = {
            "chennai, tn": [
                { name: "Chennai Senior Care", address: "123 Anna Salai, Chennai, TN", contact: "044-12345678", services: ["In-home care", "Meal prep"] },
                { name: "Marina Home Health", address: "456 Beach Rd, Chennai, TN", contact: "044-87654321", services: ["24/7 support", "Medical reminders"] },
            ],
            "coimbatore, tn": [
                { name: "Kovai Elder Services", address: "789 Race Course Rd, Coimbatore, TN", contact: "0422-98765432", services: ["Companionship", "Personal care"] },
            ],
        };

        const key = input.location.toLowerCase();
        return {
            attenders: mockDatabase[key] || [],
        };
    }
);

export async function findMedicalAttenders(
  input: MedicalAttenderInput
): Promise<MedicalAttenderOutput> {
  return medicalAttenderFlow(input);
}

const medicalAttenderPrompt = ai.definePrompt({
  name: 'medicalAttenderPrompt',
  model: 'googleai/gemini-1.5-flash',
  tools: [findAttendersTool],
  input: { schema: MedicalAttenderInputSchema },
  output: { schema: MedicalAttenderOutputSchema },
  prompt: `You are a helpful assistant for finding senior care. A user has provided a location. Use the findAttendersTool to find medical attenders in that location.

Location: {{{location}}}

If the tool returns a list of attenders, present them in the output.
If the tool returns an empty list, set the 'response' field to a helpful message indicating that no attenders were found for the specified location and suggest trying a nearby city.
`,
});

const medicalAttenderFlow = ai.defineFlow(
  {
    name: 'medicalAttenderFlow',
    inputSchema: MedicalAttenderInputSchema,
    outputSchema: MedicalAttenderOutputSchema,
  },
  async (input) => {
    const { output } = await medicalAttenderPrompt(input);
    if (!output) {
      throw new Error('The AI model did not return a valid response.');
    }
    return output;
  }
);
