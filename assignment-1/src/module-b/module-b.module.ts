import { Module, forwardRef } from '@nestjs/common';
import { ModuleAModule } from '../module-a/module-a.module';
import { ServiceB } from './service-b.service';

@Module({
  imports: [forwardRef(() => ModuleAModule)],
  providers: [ServiceB],
  exports: [ServiceB],
})
export class ModuleBModule {}
