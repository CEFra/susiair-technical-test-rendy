import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class GetSchedulesDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  @Matches(/^\d{4}$/, { message: 'year must be a 4-digit number' })
  year!: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'month must be between 01 and 12' })
  month!: string;
}
