import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Usuarioadministrador } from 'src/app/model/usuarioadministrador';
import { LoginService } from '../login/login.service';
import { Appconstants } from 'src/app/helpers/appconstants';

@Injectable({
  providedIn: 'root'
})

export class AdministradorService {

  usuarioSelecionado: Usuarioadministrador;
  // injetando o HttpClient
  constructor(
    private httpClient: HttpClient,
    private loginService: LoginService ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json', 
    }),
  };

  ConstroiHeader(): any {

    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.loginService.token
      }),
    };

  }

  // Chama API de Cadastro do Administrador
  Cadastrar(usuarioAdm: Usuarioadministrador): Observable<any> {
    return this.httpClient.post(Appconstants.baseAPIURL+'register',usuarioAdm,this.httpOptions)
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }

    // Chama API de Cadastro do Administrador
    CadastrarFuncionario(usuarioFunc: Usuarioadministrador): Observable<any> {
      return this.httpClient.post(Appconstants.baseAPIURL+'funcionarios',usuarioFunc,this.ConstroiHeader())
        .pipe(
          retry(0),
          catchError(this.handleError)
        )
    }
  

  // Chama API de Edição do Administrador
  Editar(id: number, usuarioAdm: Usuarioadministrador): Observable<any> {
    return this.httpClient.put<any>(Appconstants.baseAPIURL+'administradores/' + id, usuarioAdm, this.ConstroiHeader())
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }


  // Carregar Administrador por username
  CarregarporUsernameLogado(): Observable<any> {

    return this.httpClient.get(Appconstants.baseAPIURL+'administradores/administrador?username='+ this.loginService.username, this.ConstroiHeader())
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }

  // Chama API de Exclusão logica do Administrador
  Excluir(usuarioAdm: Usuarioadministrador): Observable<any> {
    console.log("service admin: "+usuarioAdm.id);
    return this.httpClient.delete(Appconstants.baseAPIURL+'administradores/' + usuarioAdm.id,this.ConstroiHeader())
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }

  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = 'Ocorreu um erro ao efetuar operação.';
      console.log(`Código do erro: ${error.status}, ` + `menssagem: ${error.message}, `);          
    }

    console.log(errorMessage);
    return throwError(errorMessage);
  };



}
