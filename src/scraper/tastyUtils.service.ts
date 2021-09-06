import { Injectable } from '@nestjs/common';

@Injectable()
export class TastyUtilsService {
  public parseFractionText(text: string): number {
    switch (text) {
      case '½':
        return 0.5;
      case '¾':
        return 0.75;
      case '¼':
        return 0.25;
      default: {
        const number = parseInt(text);
        return !isNaN(number) ? number : 0;
      }
    }
  }

  public singlify(text: string): string {
    return this.capitalize(
      text.endsWith('s') ? text.slice(undefined, text.length - 1) : text,
    );
  }

  private capitalize(text: string): string {
    const lower = text.toLowerCase();
    return text.charAt(0).toUpperCase() + lower.slice(1);
  }
}
