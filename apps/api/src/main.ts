import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { auth } from './auth/auth';
import { AppModule } from './app.module';

const AUTH_BASE_PATH = '/api/v1/auth';

type OpenApiComponents = NonNullable<OpenAPIObject['components']>;

function normalizeAuthPaths(authDocument: OpenAPIObject): OpenAPIObject['paths'] {
  const entries = Object.entries(authDocument.paths ?? {});
  const hasBasePath = entries.some(([path]) => path.startsWith(AUTH_BASE_PATH));

  return Object.fromEntries(
    entries.map(([path, pathItem]) => {
      if (hasBasePath) {
        return [path, pathItem];
      }

      const normalizedPath = `${AUTH_BASE_PATH}/${path.replace(/^\/+/, '')}`.replace(
        /\/{2,}/g,
        '/',
      );
      return [normalizedPath, pathItem];
    }),
  );
}

function mergeComponentSection(
  nestComponents: OpenApiComponents | undefined,
  authComponents: OpenApiComponents | undefined,
): OpenApiComponents | undefined {
  if (!nestComponents && !authComponents) {
    return undefined;
  }

  return {
    ...nestComponents,
    ...authComponents,
    schemas: {
      ...(nestComponents?.schemas ?? {}),
      ...(authComponents?.schemas ?? {}),
    },
    responses: {
      ...(nestComponents?.responses ?? {}),
      ...(authComponents?.responses ?? {}),
    },
    parameters: {
      ...(nestComponents?.parameters ?? {}),
      ...(authComponents?.parameters ?? {}),
    },
    examples: {
      ...(nestComponents?.examples ?? {}),
      ...(authComponents?.examples ?? {}),
    },
    requestBodies: {
      ...(nestComponents?.requestBodies ?? {}),
      ...(authComponents?.requestBodies ?? {}),
    },
    headers: {
      ...(nestComponents?.headers ?? {}),
      ...(authComponents?.headers ?? {}),
    },
    securitySchemes: {
      ...(nestComponents?.securitySchemes ?? {}),
      ...(authComponents?.securitySchemes ?? {}),
    },
    links: {
      ...(nestComponents?.links ?? {}),
      ...(authComponents?.links ?? {}),
    },
    callbacks: {
      ...(nestComponents?.callbacks ?? {}),
      ...(authComponents?.callbacks ?? {}),
    },
  };
}

function mergeOpenApiDocuments(
  nestDocument: OpenAPIObject,
  authDocument: OpenAPIObject,
): OpenAPIObject {
  const authPaths = normalizeAuthPaths(authDocument);
  const mergedTags = [
    ...(nestDocument.tags ?? []),
    ...((authDocument.tags ?? []).filter(
      (authTag) => !(nestDocument.tags ?? []).some((nestTag) => nestTag.name === authTag.name),
    ) ?? []),
  ];

  return {
    ...nestDocument,
    paths: {
      ...(nestDocument.paths ?? {}),
      ...authPaths,
    },
    components: mergeComponentSection(nestDocument.components, authDocument.components),
    tags: mergedTags.length > 0 ? mergedTags : undefined,
    servers:
      authDocument.servers && authDocument.servers.length > 0
        ? [...(nestDocument.servers ?? []), ...authDocument.servers]
        : nestDocument.servers,
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',').map((origin) =>
      origin.trim(),
    ) ?? ['http://localhost:3000'],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API endpoints for fullstack-boilerplate')
    .setVersion('1.0')
    .build();
  const nestSwaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
  });

  let swaggerDocument = nestSwaggerDocument;
  if (typeof auth.api.generateOpenAPISchema === 'function') {
    try {
      const authOpenApiDocument = await auth.api.generateOpenAPISchema();
      swaggerDocument = mergeOpenApiDocuments(
        nestSwaggerDocument,
        authOpenApiDocument as OpenAPIObject,
      );
    } catch (error) {
      console.error('Failed to merge Better Auth OpenAPI schema:', error);
    }
  }

  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
