import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// CommonJS compatibility import
const Fuse = require('fuse.js');

interface FaqEntry {
  keywords: string[];
  answer: string;
}

interface FuseSearchItem {
  keyword: string;
  answer: string;
}

@Injectable()
export class FaqService implements OnModuleInit {
  private readonly logger = new Logger(FaqService.name);
  private faqData: FaqEntry[] = [];
  private fuse: any = null;

  onModuleInit() {
    this.loadFaqData();
  }

  private loadFaqData() {
    try {
      const pathsToTry = [
        path.join(process.cwd(), 'src', 'data', 'faq-data.json'),
        path.join(process.cwd(), 'dist', 'data', 'faq-data.json'),
        path.join(__dirname, '..', '..', 'data', 'faq-data.json'),
        path.join(__dirname, '..', 'data', 'faq-data.json'),
      ];

      let filePath = '';
      for (const p of pathsToTry) {
        if (fs.existsSync(p)) {
          filePath = p;
          break;
        }
      }

      if (!filePath) {
        this.logger.error('Could not find faq-data.json in any search path!');
        this.faqData = [];
        return;
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      this.faqData = JSON.parse(fileContent);
      this.logger.log(`Loaded ${this.faqData.length} FAQ entries successfully from: ${filePath}`);

      // Initialize Fuse.js search structure
      const searchItems: FuseSearchItem[] = [];
      for (const entry of this.faqData) {
        for (const keyword of entry.keywords) {
          if (keyword && keyword.trim()) {
            searchItems.push({
              keyword: keyword.trim().toLowerCase(),
              answer: entry.answer,
            });
          }
        }
      }

      this.fuse = new Fuse(searchItems, {
        keys: ['keyword'],
        threshold: 0.4, // slightly relaxed fuzzy threshold to match short typos
        includeScore: true,
        ignoreLocation: true, // match keyword anywhere in the user query
      });

    } catch (error: any) {
      this.logger.error(`Failed to load FAQ data: ${error?.message ?? error}`);
      this.faqData = [];
    }
  }

  async getAnswer(message: string): Promise<string | null> {
    if (!message || typeof message !== 'string') {
      return null;
    }

    const trimmedMsg = message.trim().toLowerCase();
    if (!trimmedMsg) return null;

    // 1. Precise check: Try exact boundary regex check first
    for (const entry of this.faqData) {
      for (const keyword of entry.keywords) {
        const cleanKeyword = keyword.trim().toLowerCase();
        if (!cleanKeyword) continue;

        const escapedKeyword = this.escapeRegExp(cleanKeyword);
        const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
        
        if (regex.test(trimmedMsg)) {
          this.logger.log(`FAQ Exact hit: keyword "${cleanKeyword}" matched in message "${trimmedMsg}"`);
          return entry.answer;
        }
      }
    }

    // 2. Fuzzy check: Fall back to Fuse.js
    if (this.fuse) {
      const results = this.fuse.search(trimmedMsg);
      if (results.length > 0) {
        const bestMatch = results[0];
        if (bestMatch.score !== undefined && bestMatch.score <= 0.4) {
          this.logger.log(
            `FAQ Fuzzy hit: keyword "${bestMatch.item.keyword}" matched via Fuse.js (score: ${bestMatch.score}) in message "${trimmedMsg}"`,
          );
          return bestMatch.item.answer;
        }
      }
    }

    return null;
  }

  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
