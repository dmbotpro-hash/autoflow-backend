import { Controller, Get, Post, Query, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhookService } from './webhook.service';
import { GoogleGenerativeAI } from '@google/generative-ai'; // 👉 AI imports add kiye
import OpenAI from 'openai';

import { PrismaService } from '../../prisma/prisma.service';


@Controller('webhook/instagram')
export class WebhookController {
  
  // ==================== CONFIGURATIONS ====================
  // 🔒 Saari keys ab secure hain aur aapki .env file se aayengi
  private readonly INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
  private readonly GROQ_API_KEY = process.env.GROQ_API_KEY;
  private readonly GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  private readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  // ========================================================

  // 👉 Constructor mein PrismaService ko inject kiya
  constructor(
    private readonly webhookService: WebhookService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
    if (!VERIFY_TOKEN) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Webhook verify token not configured');
    }
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified successfully!');
      return res.status(HttpStatus.OK).send(challenge);
    }
    return res.status(HttpStatus.FORBIDDEN).send('Forbidden');
  }

  @Post()
  async receiveWebhook(@Req() req: Request, @Res() res: Response) {
    console.log('📬 [RAW EVENT RECEIVED] Meta ne server ko hit kiya! Data:', JSON.stringify(req.body, null, 2));

    try {
      const body = req.body;

      if (body.object === 'instagram' && body.entry) {
        for (const entry of body.entry) {
          if (entry.messaging && entry.messaging.length > 0) {
            const webhookEvent = entry.messaging[0];

            const senderId = webhookEvent.sender?.id;
            const botId = entry.id;

            if (!senderId) {
              console.log('⚠️ Is event mein sender.id nahi mila. Skip kar rahe hain.');
              continue;
            }

            if (senderId === botId) {
              console.log('🛑 Ye Bot ka apna bheja hua message hai, ignore.');
              continue;
            }

            let incomingText = '';
            if (webhookEvent.message) {
              incomingText = webhookEvent.message.text || '[Non-text packet]';
            } else if (webhookEvent.message_edit) {
              console.log('⚠️ Encrypted/Edited message detect hua, but hum try karenge!');
              incomingText = 'Hello';
            } else {
              incomingText = 'Hello';
            }

            console.log(`💬 Processing chat for Sender ID: ${senderId} | Message: "${incomingText}"`);

            console.log('🤖 AI Brain is thinking...');
            const aiReply = await this.getAIReplyFromRouter(incomingText);

            console.log(`🚀 Sending AI Reply: "${aiReply}"`);
            await this.sendInstagramMessage(senderId, aiReply);

            // 🗄️ Database mein save karna
            try {
              await this.prisma.chatLog.create({
                data: {
                  senderId: senderId,
                  message: incomingText,
                  aiReply: aiReply,
                },
              });
              console.log('💾 Chat saved to database successfully!');
            } catch (dbError) {
              console.error('❌ Database storage error:', dbError);
            }

          } else {
            console.log('⚠️ Event mein messaging array khali mila.');
          }
        }
      }
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
    }

    return res.status(HttpStatus.OK).send('EVENT_RECEIVED');
  }

  // 🔥 MULTI-AI FALLBACK ROUTER
  private async getAIReplyFromRouter(userMessage: string): Promise<string> {
    const systemPrompt = "You are AutoFlow AI, a helpful and professional customer support assistant. Keep replies short, accurate, and human-like.";

    // ➡️ TRY 1: GROQ (Llama 3)
    try {
      const groq = new OpenAI({ apiKey: this.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' });
      const response = await groq.chat.completions.create({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
      });
      if (response.choices[0]?.message?.content) {
        return `🤖 [Groq AI]: ${response.choices[0].message.content}`;
      }
    } catch (error) {
      console.warn('⚠️ Groq Failed/Rate Limited. Switching to Gemini...');
    }

    // ➡️ TRY 2: GEMINI
    try {
      const genAI = new GoogleGenerativeAI(this.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(`${systemPrompt}\n\nUser: ${userMessage}`);
      const response = await result.response;
      const text = response.text();
      if (text) return `♊ [Gemini AI]: ${text}`;
    } catch (error) {
      console.warn('⚠️ Gemini Failed. Switching to OpenAI...');
    }

    // ➡️ TRY 3: OPENAI GPT
    try {
      const openai = new OpenAI({ apiKey: this.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
      });
      if (response.choices[0]?.message?.content) {
        return `🧠 [GPT AI]: ${response.choices[0].message.content}`;
      }
    } catch (error) {
      console.error('❌ All AI Models Failed!');
    }

    return "Hello! Thank you for messaging. Our team will get back to you shortly.";
  }

  // 🔥 INSTAGRAM SENDER
  private async sendInstagramMessage(recipientId: string, messageText: string) {
    const url = `https://graph.instagram.com/v21.0/me/messages`;
    const payload = {
      recipient: { id: recipientId },
      message: { text: messageText },
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.INSTAGRAM_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();
      if (resData.error) {
        console.error('❌ Meta Transmitter Error:', resData.error);
      } else {
        console.log('✅ AI Reply delivered to Instagram successfully!');
      }
    } catch (error) {
      console.error('❌ Failed to deliver message:', error);
    }
  }
}