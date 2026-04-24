import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-do-not-use-in-prod';
if (JWT_SECRET === 'dev-secret-key-do-not-use-in-prod' && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: Using default JWT_SECRET in production environment!');
}
const ISSUER = 'terminal-tool-relay';

export interface RelayTokenPayload {
  hostId: string;
  role: 'host' | 'client';
}

export class TokenService {
  static signToken(payload: RelayTokenPayload): string {
    const expiresIn = payload.role === 'host' ? '7d' : '2h';
    
    return jwt.sign(
      {
        ...payload,
        jti: crypto.randomUUID(),
      },
      JWT_SECRET,
      {
        expiresIn,
        issuer: ISSUER,
        audience: `terminal-tool-${payload.role}`,
      }
    );
  }

  static verifyToken(token: string, expectedRole: RelayTokenPayload['role']): RelayTokenPayload {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: ISSUER,
      audience: `terminal-tool-${expectedRole}`,
    }) as RelayTokenPayload & { jti: string };

    if (decoded.role !== expectedRole) {
      throw new Error(`Expected ${expectedRole} token, got ${decoded.role}`);
    }

    return {
      hostId: decoded.hostId,
      role: decoded.role,
    };
  }
}
