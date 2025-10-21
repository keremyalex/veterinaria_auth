import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateClientInput {

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  ci: string;

  @Field(() => String)
  @IsNotEmpty()
  phone: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  fotoUrl?: string;
}
