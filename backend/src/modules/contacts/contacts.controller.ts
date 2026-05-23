import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceId } from '../../common/decorators/workspace-id.decorator';
import { ContactsService } from './contacts.service';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  findAll(@WorkspaceId() workspaceId: string) {
    return this.contactsService.findAll(workspaceId);
  }

  @Get(':id')
  findOne(@WorkspaceId() workspaceId: string, @Param('id') id: string) {
    return this.contactsService.findOne(workspaceId, id);
  }

  @Patch(':id')
  update(
    @WorkspaceId() workspaceId: string,
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contactsService.updateContact(workspaceId, id, dto);
  }
}
