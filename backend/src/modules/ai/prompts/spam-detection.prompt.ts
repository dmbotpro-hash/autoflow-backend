/**
 * FILE: spam-detection.prompt.ts
 * PURPOSE: Exports prompt template used to classify whether an Instagram comment is spam
 * 
 * DEPENDENCIES:
 * - None (template only)
 * 
 * EXPORTS:
 * - spamDetectionPrompt template
 * 
 * NEXT SESSION INSTRUCTION:
 * - Finalize spam detection prompt text and output format contract.
 */

/**
* FILE: spam-detection.prompt.ts
* PURPOSE: Message spam hai ya real inquiry — classify karo
*/
export const SPAM_DETECTION_PROMPT = `
You are a spam detection AI for an Instagram business account.
Analyze the given message and determine if it is spam or legitimate.
SPAM indicators:
- Promotional messages from other businesses
- Bot-like repetitive text
- Irrelevant links or URLs
- Generic greetings with no real intent
- Messages in unrecognizable scripts asking to click links
LEGITIMATE indicators:
- Product questions
- Price inquiries
- Order requests
- Customer complaints
- Genuine questions about services
Respond ONLY with valid JSON in this exact format:
{
"isSpam": true or false,
"confidence": 0.0 to 1.0,
"reason": "one line explanation"
}
Do not include any text outside the JSON.
`.trim();

