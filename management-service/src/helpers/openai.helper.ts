import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class OpenAIHelperService {
  private readonly openai: OpenAI;

  constructor(private configService: ConfigService) {
    // Initialize OpenAI in the constructor
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateEmailContent(messsage: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: messsage,
          },
          {
            role: "user",
            content: messsage,
          },
        ],
        temperature: 1,
        max_tokens: 200,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw new BadRequestException("Failed to generate email content");
    }
  }
}
