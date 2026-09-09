import { Module, forwardRef } from '@nestjs/common';
import { ModuleBModule } from '../module-b/module-b.module';
import { ServiceA } from './service-a.service';

@Module({
  imports: [forwardRef(() => ModuleBModule)],
  providers: [ServiceA],
  exports: [ServiceA],
})
export class ModuleAModule {}
