import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {

  @PrimaryGeneratedColumn('increment')
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => String)
  fullname: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  // @Field(() => String)
  password: string;

  @Column({
    type: 'nvarchar',
    transformer: {
      to: (value: string[]) => {
        if (!value || !Array.isArray(value)) return '["user"]';
        return JSON.stringify(value);
      },
      from: (value: string) => {
        if (!value) return ['user'];
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return ['user'];
        }
      }
    }
  })
  @Field(() => [String])
  roles: string[];

  @Column({
    type: 'bit',
    default: true
  })
  @Field(() => Boolean)
  isActive: boolean;
}
