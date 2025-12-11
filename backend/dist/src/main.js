"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
    app.setGlobalPrefix('api');
    await app.listen(3001);
    console.log('🚀 Backend rodando em http://localhost:3001');
    console.log('📚 API: http://localhost:3001/api');
}
bootstrap();
//# sourceMappingURL=main.js.map