import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('template')
export class TemplateController {

    @Get()
    getAll(){
        return'smsm';
    }
    @Post()
    addNew(@Body() createTemplateDto){
        return'smsm';
    }


}
