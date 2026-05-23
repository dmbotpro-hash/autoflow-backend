import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { SPAM_DETECTION_PROMPT } from './prompts/spam-detection.prompt';
import { getSalesPrompt } from './prompts/sales.prompt';
import { getSupportPrompt } from './prompts/support.prompt';

export type MessageIntent = 'sales' | 'support' | 'spam' | 'general';

export interface IntentResult {
  intent: MessageIntent;
  confidence: number;
  isSpam: boolean;
}

export interface AIReplyResult {
  reply: string;
  intent: MessageIntent;
  isAiGenerated: boolean;
}

const FALLBACK_REPLIES: Record<MessageIntent, string> = {
  sales:
    'Namaste! Hamare products ke baare mein jaankari ke liye dhanyavaad. Hum aapko jaldi reply karenge! 🙏',
  support:
    'Namaste! Aapki problem ke liye maafi chahenge. Hamar team jaldi aapse contact karega.',
  general:
    'Namaste! Aapka message mil gaya. Hum jaldi reply karenge! 🙏',
  spam: '',
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async detectSpam(message: string): Promise<{
    isSpam: boolean;
    confidence: number;
    reason: string;
  }> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 100,
        temperature: 0.1,
        messages: [
          { role: 'system', content: SPAM_DETECTION_PROMPT },
          { role: 'user', content: `Message: "${message}"` },
        ],
      });

      const content = response.choices[0]?.message?.content || '';
      const parsed = JSON.parse(content.trim());
      return parsed;
    } catch (error: any) {
      this.logger.error(`Spam detection failed: ${error?.message ?? error}`);
      return { isSpam: false, confidence: 0, reason: 'Detection failed' };
    }
  }

  async detectIntent(message: string): Promise<IntentResult> {
    try {
      const spamResult = await this.detectSpam(message);
      if (spamResult.isSpam && spamResult.confidence > 0.8) {
        return {
          intent: 'spam',
          confidence: spamResult.confidence,
          isSpam: true,
        };
      }

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 100,
        temperature: 0.1,
        messages: [
          {
            role: 'system',
            content: `
Classify the Instagram message intent into one of these categories:
- sales: asking about products, prices, ordering, availability
- support: complaints, issues, refunds, problems
- general: greetings, random questions, unclear intent
- spam: promotional, bot-like, irrelevant
Respond ONLY with valid JSON:
{"intent": "sales|support|general|spam", "confidence": 0.0-1.0}
No other text.
`.trim(),
          },
          {
            role: 'user',
            content: `Message: "${message}"`,
          },
        ],
      });

      const content = response.choices[0]?.message?.content || '';
      const parsed = JSON.parse(content.trim());
      return {
        intent: parsed.intent as MessageIntent,
        confidence: parsed.confidence,
        isSpam: parsed.intent === 'spam',
      };
    } catch (error: any) {
      this.logger.error(`Intent detection failed: ${error?.message ?? error}`);
      return { intent: 'general', confidence: 0.5, isSpam: false };
    }
  }

  async generateReply(
    message: string,
    intent: MessageIntent,
    businessContext: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[] = [],
    options?: { customTone?: string; customPrompt?: string },
  ): Promise<AIReplyResult> {
    if (intent === 'spam') {
      return { reply: '', intent, isAiGenerated: false };
    }

    try {
      const basePrompt =
        intent === 'sales'
          ? getSalesPrompt(businessContext)
          : intent === 'support'
            ? getSupportPrompt(businessContext)
            : getSalesPrompt(businessContext);

      const toneSuffix = options?.customTone
        ? `\n\nResponse tone: ${options.customTone}`
        : '';
      const promptSuffix = options?.customPrompt
        ? `\n\nWorkspace instructions:\n${options.customPrompt}`
        : '';
      const systemPrompt = `${basePrompt}${toneSuffix}${promptSuffix}`;

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-6),
        { role: 'user', content: message },
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 200,
        temperature: 0.7,
        messages,
      });

      const reply = response.choices[0]?.message?.content?.trim() || '';
      if (!reply) throw new Error('Empty response from OpenAI');

      this.logger.log(`AI reply generated for intent: ${intent}`);
      return { reply, intent, isAiGenerated: true };
    } catch (error: any) {
      this.logger.error(`AI reply generation failed: ${error?.message ?? error}`);
      const fallback = FALLBACK_REPLIES[intent];
      return { reply: fallback, intent, isAiGenerated: true };
    }
  }

  /**
   * Summarize an entire conversation thread into 2-3 sentences.
   */
  async summarizeConversation(
    messages: { direction: string; content: string }[],
  ): Promise<string> {
    if (!messages.length) return 'No messages to summarize.';

    const transcript = messages
      .map(
        (m) =>
          `${m.direction === 'inbound' ? 'Customer' : 'Agent'}: ${m.content}`,
      )
      .join('\n');

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 150,
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content:
              'You are a CRM assistant. Summarize the following customer conversation in 2-3 concise sentences. Focus on the customer intent, key topics discussed, and any action items or outcomes.',
          },
          { role: 'user', content: transcript },
        ],
      });

      return (
        response.choices[0]?.message?.content?.trim() ||
        'Unable to generate summary.'
      );
    } catch (error: any) {
      this.logger.error(
        `Conversation summary failed: ${error?.message ?? error}`,
      );
      return 'Summary unavailable — check OpenAI connection.';
    }
  }

  /**
   * Generate a workflow config JSON from a natural-language prompt.
   * POST /ai/generate-workflow
   */
  async generateWorkflow(prompt: string): Promise<{
    workflow: {
      name: string;
      description: string;
      nodes: Array<{
        id: string;
        type: string;
        label: string;
        config: Record<string, unknown>;
        position: { x: number; y: number };
      }>;
      edges: Array<{ id: string; source: string; target: string }>;
    };
    explanation: string;
  }> {
    const systemPrompt = `You are an automation workflow builder AI for an Instagram DM marketing platform.
Given a user's natural language request, generate a workflow as JSON.
Node types: trigger, ai, delay, condition, action, crm
Return ONLY valid JSON in this exact shape (no markdown, no backticks):
{
  "workflow": {
    "name": "short workflow name",
    "description": "one sentence description",
    "nodes": [
      { "id": "n1", "type": "trigger|ai|delay|condition|action|crm", "label": "Node Label", "config": {}, "position": { "x": 80, "y": 200 } }
    ],
    "edges": [
      { "id": "e1", "source": "n1", "target": "n2" }
    ]
  },
  "explanation": "2-sentence plain-English explanation of what this workflow does"
}
Space nodes horizontally: first node at x=80, each subsequent node x += 240. All at y=200.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 800,
        temperature: 0.4,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      });

      const raw = response.choices[0]?.message?.content?.trim() || '{}';
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (error: any) {
      this.logger.error(`Workflow generation failed: ${error?.message ?? error}`);
      // Return a sensible fallback
      const keyword = prompt.match(/["']([^"']+)["']|comment\s+["']?(\w+)["']?/i)?.[1] || 'price';
      return {
        workflow: {
          name: `Auto-DM: "${keyword}"`,
          description: `Send a DM when someone comments "${keyword}"`,
          nodes: [
            { id: 'n1', type: 'trigger', label: `Comment: "${keyword}"`, config: { type: 'comment_keyword', keyword }, position: { x: 80, y: 200 } },
            { id: 'n2', type: 'ai', label: 'AI: Generate Reply', config: { prompt: `Reply to comment about ${keyword}` }, position: { x: 320, y: 200 } },
            { id: 'n3', type: 'action', label: 'Send DM', config: { type: 'send_dm' }, position: { x: 560, y: 200 } },
          ],
          edges: [
            { id: 'e1', source: 'n1', target: 'n2' },
            { id: 'e2', source: 'n2', target: 'n3' },
          ],
        },
        explanation: `This workflow triggers when someone comments "${keyword}" on your post. It uses AI to craft a personalized reply and sends it as a DM automatically.`,
      };
    }
  }

  /**
   * Generate 3 short smart-reply chips based on the last customer message.
   */
  async getSmartReplies(
    lastMessage: string,
    conversationContext: string,
  ): Promise<string[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 120,
        temperature: 0.8,
        messages: [
          {
            role: 'system',
            content: `You are a customer support AI. Generate exactly 3 short, natural reply suggestions (max 8 words each) for an agent to send. Return ONLY a JSON array of strings, no other text. Example: ["Sure, let me check!", "Thanks for reaching out 😊", "Can you share more details?"]`,
          },
          {
            role: 'user',
            content: `Context: ${conversationContext}\n\nCustomer's last message: "${lastMessage}"`,
          },
        ],
      });

      const raw =
        response.choices[0]?.message?.content?.trim() || '[]';
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
    } catch (error: any) {
      this.logger.error(
        `Smart replies failed: ${error?.message ?? error}`,
      );
      return [
        'Thanks for reaching out! 😊',
        'Let me check that for you.',
        'Can you provide more details?',
      ];
    }
  }
}
