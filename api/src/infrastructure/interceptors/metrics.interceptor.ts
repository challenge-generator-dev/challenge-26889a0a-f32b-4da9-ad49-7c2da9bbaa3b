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

interface RequestMetrics {
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  timestamp: string;
}

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MetricsInterceptor.name);
  private readonly metrics: RequestMetrics[] = [];
  private readonly MAX_METRICS_STORED = 1000;

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const metric: RequestMetrics = {
          method: request.method,
          path: request.url,
          statusCode: response.statusCode,
          duration,
          timestamp: new Date().toISOString(),
        };

        this.recordMetric(metric);

        if (duration > 1000) {
          this.logger.warn(
            `Solicitud lenta detectada: ${request.method} ${request.url} - ${duration}ms`
          );
        }
      }),
      tap(undefined, (error) => {
        this.logger.error(
          `Error en solicitud: ${request.method} ${request.url} - ${error.message}`
        );
      })
    );
  }

  private recordMetric(metric: RequestMetrics): void {
    this.metrics.push(metric);

    if (this.metrics.length > this.MAX_METRICS_STORED) {
      this.metrics.shift();
    }
  }

  getMetrics(): RequestMetrics[] {
    return [...this.metrics];
  }

  getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    return totalDuration / this.metrics.length;
  }

  getRequestCountByStatus(): Record<number, number> {
    return this.metrics.reduce((acc, metric) => {
      acc[metric.statusCode] = (acc[metric.statusCode] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  }

  getRequestCountByMethod(): Record<string, number> {
    return this.metrics.reduce((acc, metric) => {
      acc[metric.method] = (acc[metric.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  clearMetrics(): void {
    this.metrics.length = 0;
  }
}