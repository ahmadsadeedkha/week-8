import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ServiceB } from '../module-b/service-b.service';

@Injectable()
export class ServiceA {
  constructor(
    @Inject(forwardRef(() => ServiceB))
    private readonly serviceB: ServiceB,
  ) {}

  callB(): string {
    return `ServiceA calling → ${this.serviceB.identify()}`;
  }

  identify(): string {
    return 'ServiceA';
  }
}
