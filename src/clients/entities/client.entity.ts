import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'clients' })
@Directive('@key(fields: "id")')
@ObjectType()
export class Client {

  @PrimaryGeneratedColumn('increment')
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  lastname: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  ci: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  fotoUrl?: string;
}
