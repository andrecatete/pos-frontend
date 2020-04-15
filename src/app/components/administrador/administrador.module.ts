import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroAdminComponent } from './cadastro-admin/cadastro-admin.component';
import {MaterialModule} from '../../material-module';
import { RouterModule } from '@angular/router';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
  declarations: [CadastroAdminComponent, LoginAdminComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TextMaskModule
  ]
})
export class AdministradorModule { }
