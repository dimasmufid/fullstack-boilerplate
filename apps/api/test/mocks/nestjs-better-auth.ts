import type { DynamicModule } from '@nestjs/common';

const noopDecorator = () => {
  return () => undefined;
};

class MockAuthModule {}

export const AllowAnonymous = noopDecorator;
export const OptionalAuth = noopDecorator;
export const Session = noopDecorator;
export const AuthModule = {
  forRoot: (): DynamicModule => ({
    module: MockAuthModule,
  }),
};
