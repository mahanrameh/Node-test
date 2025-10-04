import { ApiPropertyOptional } from "@nestjs/swagger";
import { Length } from "class-validator";
import { Gender } from "../enum/gender.enum";

export class ProfileDto {
    @ApiPropertyOptional()
    @Length(3,50)
    name: string;
    @ApiPropertyOptional({nullable: true})
    @Length(5, 200)
    bio: string;
    @ApiPropertyOptional({nullable: true})
    image_profile: string;
    @ApiPropertyOptional({nullable: true, enum: Gender})
    gender: string;
    @ApiPropertyOptional({nullable: true, example: '1996-03-11T12:02:02.487Z'})
    birthday: Date;
}