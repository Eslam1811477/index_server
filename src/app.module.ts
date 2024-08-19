import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TemplateController } from './template/template.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { vars } from 'config';
import { TemplateModule } from './template/template.module';


@Module({
  imports: [MongooseModule.forRoot(vars.Database.link), TemplateModule],
  controllers: [AppController, TemplateController],
  providers: [AppService],
})
export class AppModule {}
