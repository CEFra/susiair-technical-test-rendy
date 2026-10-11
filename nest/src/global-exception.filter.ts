import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

/**
 * Every error leaves the API in the same shape:
 * { statusCode, error, message: string[], path, timestamp }
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string[] = ['Internal server error'];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as
        | string
        | { message?: string | string[]; error?: string };

      if (typeof res === 'string') {
        message = [res];
        error = exception.name;
      } else {
        const raw = res.message ?? exception.message;
        message = Array.isArray(raw) ? raw : [raw];
        error = res.error ?? exception.name;
      }
    } else {
      this.logger.error(
        'Unhandled exception',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
