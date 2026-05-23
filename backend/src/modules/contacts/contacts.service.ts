import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async findAll(workspaceId: string) {
    return this.prisma.contact.findMany({
      where: { workspaceId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(workspaceId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, workspaceId, deletedAt: null },
    });
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async updateContact(
    workspaceId: string,
    contactId: string,
    dto: UpdateContactDto,
  ) {
    // Verify ownership
    const existing = await this.prisma.contact.findFirst({
      where: { id: contactId, workspaceId, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Contact not found');

    return this.prisma.contact.update({
      where: { id: contactId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.username !== undefined && { username: dto.username }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.leadScore !== undefined && { leadScore: dto.leadScore }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        updatedAt: new Date(),
      },
    });
  }
}
