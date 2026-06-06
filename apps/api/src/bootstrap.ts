import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DefaultFeedsSeed } from './seed/default-feeds';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 开发期 CORS：允许 web 端 localhost:5173
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // 启动时执行 seed（幂等）
  try {
    const seeder = app.get(DefaultFeedsSeed);
    await seeder.run();
  } catch (err) {
    console.warn('[seed] failed (non-fatal):', err);
  }

  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);
  await app.listen(port);
  console.log(`API running on port ${port}`);
}

export { bootstrap };