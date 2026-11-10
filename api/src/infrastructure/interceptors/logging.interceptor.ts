import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, body, headers } = request;
    const startTime = Date.now();

    this.logger.log(`→ ${method} ${url}`);

    if (Object.keys(body).length > 0) {
      this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `← ${method} ${url} - Estado: ${response.statusCode} - Duración: ${duration}ms`
        );
      }),
      tap((data) => {
        if (data) {
          this.logger.debug(`Response Data: ${JSON.stringify(data)}`);
        }
      })
    );
  }
}