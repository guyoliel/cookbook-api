import { Controller, Get, Param } from '@nestjs/common';
import { Recipe } from '../common/entities/recipe';
import { ScraperService } from './scraper.service';
@Controller('scraper')
export class ScraperController {
  constructor(private scraperService: ScraperService) {}
  @Get()
  getScrape(): string {
    return '<h1>lets start scraping!</h1>';
  }

  @Get(':site')
  async startScraping(@Param('site') site: string): Promise<Recipe> {
    try {
      return await this.scraperService.scrape(site);
    } catch (error) {
      return error.toString();
    }
  }
}
