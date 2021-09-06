import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { TastyUtilsService } from './tastyUtils.service';

@Module({
  controllers: [ScraperController],
  providers: [TastyUtilsService],
})
export class ScraperModule {}
