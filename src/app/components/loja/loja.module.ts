import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroLojaComponent } from './cadastro-loja/cadastro-loja.component';
import { MaterialModule } from '../../material-module';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { ListaLojasComponent } from './lista-lojas/lista-lojas.component';


@NgModule({
  declarations: [CadastroLojaComponent, ListaLojasComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TextMaskModule  
  ]
})
export class LojaModule { }
