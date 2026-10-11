import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  const service = new AuthService();

  it('issues a verifiable token for the hardcoded pilot', () => {
    const { token } = service.login('johndoe', 'susiairtest');
    expect(service.verify(token)).toMatchObject({ sub: 'johndoe' });
  });

  it('rejects wrong credentials', () => {
    expect(() => service.login('johndoe', 'nope')).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects tampered or malformed tokens', () => {
    const { token } = service.login('johndoe', 'susiairtest');
    const [body, sig] = token.split('.');
    const forged = Buffer.from(
      JSON.stringify({ sub: 'admin', exp: 9_999_999_999 }),
    ).toString('base64url');

    expect(service.verify(`${forged}.${sig}`)).toBeNull();
    expect(service.verify(`${body}.x${sig}`)).toBeNull();
    expect(service.verify('garbage')).toBeNull();
  });

  it('rejects expired tokens', () => {
    const { token } = service.login('johndoe', 'susiairtest');
    const realNow = Date.now;
    Date.now = () => realNow() + 13 * 60 * 60 * 1000;
    try {
      expect(service.verify(token)).toBeNull();
    } finally {
      Date.now = realNow;
    }
  });
});
