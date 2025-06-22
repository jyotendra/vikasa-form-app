import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { isDevelopment } from "../env-loader";
import { AppOptions } from "../app";
import appEnvConfig from "../env-loader";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// Define types for both verifiers
interface UnifiedVerifier {
  verify: (token: string) => Promise<any>;
}

function createVerifier(): UnifiedVerifier {
  if (isDevelopment) {
    // Use manual verification for local development
    const client = jwksClient({
      // 9229 is the default port for Cognito-local
      jwksUri: `http://cognito:9229/${appEnvConfig.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
    });

    return {
      verify: async (token: string) => {
        return new Promise((resolve, reject) => {
          jwt.verify(
            token,
            (header, callback) => {
              client.getSigningKey(header.kid, (err, key) => {
                if (err) return callback(err);
                const signingKey = key && key.getPublicKey();
                callback(null, signingKey);
              });
            },
            {
              algorithms: ["RS256"],
            },
            (err, decoded) => {
              if (err) reject(err);
              else resolve(decoded);
            }
          );
        });
      },
    };
  } else {
    // Use aws-jwt-verify for production
    return CognitoJwtVerifier.create({
      userPoolId: appEnvConfig.COGNITO_USER_POOL_ID,
      tokenUse: "access",
      clientId: appEnvConfig.COGNITO_CLIENT_ID,
    });
  }
}

const cognitoJwtVerifierPlugin: FastifyPluginAsync<AppOptions> = async (
  fastify,
  options
) => {
  const verifier = createVerifier();
  fastify.decorate("cognitoVerifier", verifier);
};

export default fp(cognitoJwtVerifierPlugin, {
  name: "cognitoVerifier",
});

declare module "fastify" {
  interface FastifyInstance {
    cognitoVerifier: UnifiedVerifier;
  }
}
