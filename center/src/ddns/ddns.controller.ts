import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DDnsService } from './ddns.service';
import { CreateDdnDto } from './dto/create-ddn.dto';
import { UpdateDdnDto } from './dto/update-ddn.dto';

@Controller('ddns')
export class DDnsController {
  constructor(private readonly ddnsService: DDnsService) {}
}
