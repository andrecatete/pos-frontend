import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroAdminComponent } from './components/administrador/cadastro-admin/cadastro-admin.component';
import { LoginAdminComponent } from './components/administrador/login-admin/login-admin.component';
import { CadastroFuncionarioComponent } from './components/funcionario/cadastro-funcionario/cadastro-funcionario.component';
import { ListaFuncionarioComponent } from './components/funcionario/lista-funcionario/lista-funcionario.component';
import { HomeComponent } from './components/home/home/home.component';
import { CadastroLojaComponent } from './components/loja/cadastro-loja/cadastro-loja.component';
import { ListaLojasComponent } from './components/loja/lista-lojas/lista-lojas.component';
import { CadastroMarcaComponent } from './components/marca/cadastro-marca/cadastro-marca.component';
import { ListaMarcaComponent } from './components/marca/lista-marca/lista-marca.component';
import { PesquisarComponent } from './components/pesquisa/pesquisar/pesquisar.component';
import { CadastroProdutoComponent } from './components/produto/cadastro-produto/cadastro-produto.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { AssociaLojaprodutoComponent } from './components/loja/associa-lojaproduto/associa-lojaproduto.component';

const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: "home", component: HomeComponent,
  children: [
    // { path: '', component:  AComponent },
    { path: 'cadastro', component: CadastroAdminComponent },
    { path: 'pesquisar', component: PesquisarComponent },
    { path: 'lojas', component: ListaLojasComponent },
    { path: 'cadastroloja', component: CadastroLojaComponent},
    { path: 'marcas', component: ListaMarcaComponent },
    { path: 'cadastromarca', component: CadastroMarcaComponent},
    { path: 'cadastrofuncionario', component: CadastroFuncionarioComponent},
    { path: 'funcionarios', component: ListaFuncionarioComponent},
    { path: 'cadastroproduto', component: CadastroProdutoComponent},
    { path: 'incluirproduto', component: AssociaLojaprodutoComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full'}
    ] },
    { path: 'login', component:  LoginAdminComponent },
   { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
