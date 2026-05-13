import { IsString } from 'class-validator';

export class LinkSleeperDto {
  @IsString()
  username!: string;
}
