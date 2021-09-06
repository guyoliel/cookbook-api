import { Injectable } from '@nestjs/common';
import { Recipe } from 'src/common/interfaces/recipe';
import { Scraper } from './interfaces/scraper';

@Injectable()
export class ScraperService {
  scraper: Scraper<Recipe>;
  constructor(scraper: Scraper<Recipe>) {
    this.scraper = scraper;
  }

  async scrape(url: string): Promise<Recipe> {
    if (this.scraper.canScrape(url)) return await this.scraper.scrape(url);
    throw new Error("Can't scrape this site with current scraper");
  }
}
