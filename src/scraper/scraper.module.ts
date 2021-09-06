import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { TastyUtilsService } from './tastyUtils.service';
import { ScraperService } from './scraper.service';
import { TastyScraper } from './scraperStartegies/tastyScraper';
import { PuppeteerUtils } from './utils/puppeteerUtils';

@Module({
  controllers: [ScraperController],
  providers: [
    TastyUtilsService,
    {
      provide: ScraperService,
      useFactory: (tastyUtilsService: TastyUtilsService) => {
        const tastyScraper = new TastyScraper(
          new PuppeteerUtils(),
          tastyUtilsService,
        );
        return new ScraperService(tastyScraper);
      },
      inject: [TastyUtilsService],
    },
  ],
})
export class ScraperModule {}
