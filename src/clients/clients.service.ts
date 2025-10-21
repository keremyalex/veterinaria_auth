import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  async create(createClientInput: CreateClientInput): Promise<Client> {
    const client = this.clientsRepository.create(createClientInput);
    return await this.clientsRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return await this.clientsRepository.find();
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) throw new NotFoundException(`Client with ID ${id} not found`);
    return client;
  }

  async update(id: number, updateClientInput: UpdateClientInput): Promise<Client> {
    const client = await this.clientsRepository.preload({
      id,
      ...updateClientInput,
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    return this.clientsRepository.save(client);
  }

  async remove(id: number): Promise<Client> {
    const client = await this.findOne(id);
    const clientToReturn = { ...client }; // Guardamos una copia antes de eliminar
    await this.clientsRepository.remove(client);
    return clientToReturn;
  }
}
