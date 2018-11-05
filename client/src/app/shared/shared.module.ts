import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { BigInputComponent } from './big-input/big-input.component';
import { BigInputActionComponent } from './big-input/big-input-action.component';
import { MaterialModule } from '@app/shared/material.module';

const MODULES = [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, MaterialModule];

const COMPONENTS = [BigInputComponent, BigInputActionComponent];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  exports: [...MODULES, ...COMPONENTS],
})
export class SharedModule {}
