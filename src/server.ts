import { createApp } from './app';
import { env } from './config/env';
import { checkDatabaseConnection } from './config/database';

async function bootstrap(): Promise<void> {
  try {
    await checkDatabaseConnection();
    console.log('✅ Conexão com o MySQL estabelecida.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
    process.exit(1);
  }

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${env.port}`);
  });
}

bootstrap();
