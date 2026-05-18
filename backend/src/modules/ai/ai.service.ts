/**
 * FILE: ai.service.ts
 * PURPOSE: Provides AI operations for spam detection and generating personalized support/sales replies
 * 
 * DEPENDENCIES:
 * - OpenAI client (shell)
 * - Prompt templates from prompts/*
 * 
 * EXPORTS:
 * - AiService class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Implement methods: detectSpam(comment), generateSalesReply(input), generateSupportReply(input).
 */

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
  ): Promise<AIReplyResult> {
    if (intent === 'spam') {
      return { reply: '', intent, isAiGenerated: false };
    }

    try {
      const systemPrompt =
        intent === 'sales'
          ? getSalesPrompt(businessContext)
          : intent === 'support'
            ? getSupportPrompt(businessContext)
            : getSalesPrompt(businessContext);

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
}


