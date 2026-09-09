import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ServiceA } from '../module-a/service-a.service';

@Injectable()
export class ServiceB {
  constructor(
    @Inject(forwardRef(() => ServiceA))
    private readonly serviceA: ServiceA,
  ) {}

  callA(): string {
    return `ServiceB calling → ${this.serviceA.identify()}`;
  }

  identify(): string {
    return 'ServiceB';
  }
}
