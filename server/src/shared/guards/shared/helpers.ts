import { verify } from "jsonwebtoken";
import { AnyJwtUserPayload } from "../../auth/jwt-payload.model";
import { Configuration } from "../../configuration/configuration.enum";
import { ConfigurationService } from "../../configuration/configuration.service";

const jwtKey = ConfigurationService.get(Configuration.JWT_SECRET_KEY);

export abstract class GuardHelpers {

  static getJwtStringFromHeaders(headers): string {
    if (!headers || !(headers['authorization'] || headers['Authorization'])) {
      throw new Error('No authorization header provided');
    }

    const authHeader = headers['authorization'] || headers['Authorization'];

    const split = authHeader.split(' ');
    if (
      split &&
      split.length === 2 &&
      (split[0] === 'Bearer' || split[0] === 'bearer')
    ) {
      const jwtStr = split[1];
      return jwtStr;
    }
    throw new Error(
      'Authorization header is not in expected format: Bearer {{jwt}} '
    );
  }

  static async decodeJwtPayload(jwtStr: string): Promise<AnyJwtUserPayload> {
    return new Promise<any>((resolve, reject) => {
      verify(jwtStr, jwtKey, function(err, decoded) {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  }
}