import { All, Controller, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth';

const authHandler = toNodeHandler(auth.handler);

@Controller('auth')
export class AuthController {
  @All()
  handleRoot(@Req() req: Request, @Res() res: Response) {
    return authHandler(req, res);
  }

  @All('*path')
  handleAll(@Req() req: Request, @Res() res: Response) {
    return authHandler(req, res);
  }
}
