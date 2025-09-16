import {
    INestApplication,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'src/modules/app.module';

export class App {
    private readonly app: INestApplication;
    private readonly apiPort: number;
    private readonly apiVersion: string;
    private readonly apiPrefix: string;
    private readonly swaggerTitle: string;
    private readonly swaggerDescription: string;
    private readonly swaggerPath: string;
    private readonly configService: ConfigService;

    constructor(app: INestApplication) {
        this.app = app;
        this.configService = app.get(ConfigService);
        this.apiPort = this.configService.get<number>('API_PORT');
        this.apiVersion = this.configService.get<string>('API_VERSION');
        this.apiPrefix = this.configService.get<string>('API_PREFIX');
        this.swaggerTitle = this.configService.get<string>('SWAGGER_TITLE');
        this.swaggerDescription = this.configService.get<string>(
            'SWAGGER_DESCRIPTION',
        );
        this.swaggerPath = this.configService.get<string>('SWAGGER_PATH');
    }

    private appConfig() {
        this.app.setGlobalPrefix(this.apiPrefix);
        this.app.enableVersioning({
            defaultVersion: this.apiVersion,
            type: VersioningType.URI,
        });
        this.app.enableCors({ credentials: true, origin: true });
        return this;
    }

    private swaggerConfig() {
        const options = new DocumentBuilder()
            .setTitle(this.swaggerTitle)
            .setDescription(this.swaggerDescription)
            .setVersion(this.apiVersion)
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(this.app, options);
        SwaggerModule.setup(
            `${this.apiPrefix}/:version/${this.swaggerPath}`,
            this.app,
            document,
            { swaggerOptions: { persistAuthorization: true } },
        );
        return this;
    }

    private validationConfig() {
        this.app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                whitelist: true,
            }),
        );
        return this;
    }

    private async runApp() {
        await this.app.listen(this.apiPort);
        return this;
    }

    public static async run() {
        NestFactory.create(AppModule, { cors: false }).then((app) => {
            new App(app)
                .appConfig()
                .swaggerConfig()
                .validationConfig()
                .runApp();
        });
    }
}
