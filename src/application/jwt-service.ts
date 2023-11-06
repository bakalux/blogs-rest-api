import {sign, verify} from 'jsonwebtoken';
import {JWT_SECRET} from "../settings";

class JwtService {
	public createJWT(userId: string, expiresIn: string): string {
		return sign({ userId }, JWT_SECRET, { expiresIn });
	}

	public async getUserIdByToken(token: string): Promise<string | null> {
		try {
			const result: any = verify(token, JWT_SECRET)
			return result.userId;
		} catch(e) {
			return null;
		}
	}
}

export const jwtService = new JwtService();
