import { sign } from 'jsonwebtoken';
import {JWT_SECRET} from "../settings";

class JwtService {
	public createJWT(userId: string): string {
		return sign({ userId }, JWT_SECRET, { expiresIn: '3d'});
	}

	public async getUserIdByToken(token: string): Promise<string> {
		return 'user_id';
	}
}

export const jwtService = new JwtService();
