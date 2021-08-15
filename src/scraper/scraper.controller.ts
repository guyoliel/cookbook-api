import { Controller, Get } from '@nestjs/common';

@Controller('scraper')
export class ScraperController {
  @Get()
  getScrape(): string {
    return '<h1>lets start scraping!</h1>';
  }
}
