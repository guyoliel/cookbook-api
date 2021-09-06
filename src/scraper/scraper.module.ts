import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { TastyUtilsService } from './utils/tastyUtils';
import { TastyScraper } from './scraperStartegies/tastyScraper';
import { PuppeteerUtils } from './utils/puppeteerUtils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from 'src/common/entities/recipe';
import { ScraperService } from './scraper.service';

const tastyScraper = new TastyScraper(
  new PuppeteerUtils(),
  new TastyUtilsService(),
);

@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],
  controllers: [ScraperController],
  providers: [
    ScraperService,
    TastyUtilsService,
    { provide: 'Scraper', useValue: tastyScraper },
  ],
  exports: [TypeOrmModule],
})
export class ScraperModule {}
