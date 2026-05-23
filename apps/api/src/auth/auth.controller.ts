import { Controller, Post, Body, Req, Res, HttpCode, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpSchema, SignInSchema } from './dto/auth.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  async signup(@Body() body: unknown) {
    const input = SignUpSchema.parse(body);
    const user = await this.auth.signUp(input);
    const session = await this.auth.createSession(user!.id);
    return { user: { id: user!.id, email: user!.email, name: user!.name }, session };
  }

  @Post('signin')
  @HttpCode(200)
  async signin(@Body() body: unknown, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const input = SignInSchema.parse(body);
    const user = await this.auth.signIn(input);
    const session = await this.auth.createSession(user!.id);
    res.cookie('session', session.sessionId, {
      httpOnly: true,
      expires: session.expiresAt,
      sameSite: 'lax',
    });
    return { user: { id: user!.id, email: user!.email, name: user!.name } };
  }

  @Post('signout')
  @HttpCode(200)
  async signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('session');
    return { success: true };
  }

  @Get('session')
  async getSession(@Req() req: Request) {
    const sessionId = req.cookies?.session;
    if (!sessionId) return { user: null };
    const user = await this.auth.validateSession(sessionId);
    return { user: user ? { id: user.id, email: user.email, name: user.name } : null };
  }
}