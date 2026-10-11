import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

/** Pilot account credentials. */
const PILOT_ACCOUNT = { username: 'johndoe', password: 'susiairtest' };

const TOKEN_TTL_SECONDS = 60 * 60 * 12;

interface TokenPayload {
  sub: string;
  exp: number; // unix seconds
}

@Injectable()
export class AuthService {
  private readonly secret =
    process.env.AUTH_SECRET ?? 'dev-only-secret-change-me';

  login(username: string, password: string) {
    if (
      username !== PILOT_ACCOUNT.username ||
      password !== PILOT_ACCOUNT.password
    ) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload: TokenPayload = {
      sub: username,
      exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    };
    return {
      token: this.sign(payload),
      tokenType: 'Bearer',
      expiresIn: TOKEN_TTL_SECONDS,
    };
  }

  /** Returns the payload if the token is valid, otherwise null. */
  verify(token: string): TokenPayload | null {
    const [body, signature] = token.split('.');
    if (!body || !signature) return null;

    const expected = Buffer.from(this.signature(body));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      return null;
    }

    try {
      const payload = JSON.parse(
        Buffer.from(body, 'base64url').toString('utf8'),
      ) as TokenPayload;
      if (typeof payload.exp !== 'number') return null;
      if (payload.exp < Math.floor(Date.now() / 1000)) return null;
      return payload;
    } catch {
      return null;
    }
  }

  private sign(payload: TokenPayload): string {
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${body}.${this.signature(body)}`;
  }

  private signature(body: string): string {
    return createHmac('sha256', this.secret).update(body).digest('base64url');
  }
}
