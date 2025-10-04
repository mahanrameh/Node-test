import { Controller, Get, Post, Body, Res, Req, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthRegisterDto, AuthLoginDto, CheckOtpDto } from './dto/auth.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { Request, Response } from 'express';
import { RolesGuard } from '../../common/guards/role.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async register(@Body() dto: AuthRegisterDto, @Res() res: Response) {
    return this.authService.register(dto, res);
  }

  @Post('login')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @HttpCode(200)
  async login(@Body() dto: AuthLoginDto, @Res() res: Response) {
    return this.authService.login(dto, res);
  }
  

  @Get('check-login')
  @ApiBearerAuth('Authorization')
  @UseGuards(RolesGuard)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  checkLogin(@Req() req: Request) {
    return req.user;
  }
}
