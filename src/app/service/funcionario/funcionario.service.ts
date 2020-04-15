import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map, take } from 'rxjs/operators';
import { Usuarioadministrador } from 'src/app/model/usuarioadministrador';
import { LoginService } from '../login/login.service';
import { Appconstants } from 'src/app/helpers/appconstants';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  funcionarioSelecionado: Usuarioadministrador;

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

  // Chama API de Cadastro do Funcionario
  Cadastrar(usuarioFunc: Usuarioadministrador): Observable<any> {
    return this.httpClient.post(Appconstants.baseAPIURL+'funcionarios',usuarioFunc,this.ConstroiHeader())
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }

  // Chama API de Listar do Funcionario
  listar(username: string): Observable<any>{
    this.funcionarioSelecionado = undefined;
    return this.httpClient.get(Appconstants.baseAPIURL + 'funcionarios?usernameAdministrador=' + username,this.ConstroiHeader())
      .pipe(
        map(data => data['_embedded']['usuarioFuncionarioResources']),
        catchError(this.handleError)
      );
  }

  CarregarporFuncionarioSelecionado(): Observable<any> {

    return this.httpClient.get(Appconstants.baseAPIURL + 'funcionarios/'+ this.funcionarioSelecionado, this.ConstroiHeader())
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }
  

  // Chama API de Edição do Administrador
  Editar(id: any, usuarioAdm: Usuarioadministrador): Observable<any> {
    return this.httpClient.put<any>(Appconstants.baseAPIURL+'funcionarios/' + id, usuarioAdm, this.ConstroiHeader())
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }


  // Chama API de Exclusão logica do Funcionario
  remover(id){
    return this.httpClient.delete(Appconstants.baseAPIURL + 'funcionarios/'+id,this.ConstroiHeader())
    .pipe(
      take(1),
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
