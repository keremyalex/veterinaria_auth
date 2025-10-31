import { Resolver, Query, Mutation, Args, Int, ID, ResolveReference } from '@nestjs/graphql';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { ParseIntPipe } from '@nestjs/common';

@Resolver(() => Client)
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) { }

  @Mutation(() => Client)
  async createClient(@Args('createClientInput') createClientInput: CreateClientInput): Promise<Client> {
    return this.clientsService.create(createClientInput);
  }

  @Query(() => [Client], { name: 'clients' })
  async findAll() {
    return this.clientsService.findAll();
  }

  @Query(() => Client, { name: 'client' })
  async findOne(@Args('id', { type: () => ID }) id: number) {
    return this.clientsService.findOne(id);
  }

  @Mutation(() => Client)
  async updateClient(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number,
    @Args('updateClientInput') updateClientInput: UpdateClientInput,): Promise<Client> {
    return this.clientsService.update(id, updateClientInput);
  }

  @Mutation(() => Client)
  async removeClient(@Args('id', { type: () => ID }, ParseIntPipe) id: number) {
    return this.clientsService.remove(id);
  }

    // 👇 Necesario para Federation (sin guard)
  @ResolveReference()
  resolveReference(ref: { __typename: 'Client'; id: string | number }) {
    const id = typeof ref.id === 'string' ? parseInt(ref.id, 10) : ref.id;
    return this.clientsService.findOne(id);
  }
}
