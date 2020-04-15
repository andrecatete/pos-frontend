import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class TesteService {
 
  // injetando o HttpClient
  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json', 
    }),
  };

  // Teste
  teste(): Observable<any> {

    return this.httpClient.post('http://localhost:8080/authenticate',{"username":"javainuse","password":"password"},this.httpOptions)
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
      
      if (error.status == 400) {
        errorMessage = 'Usuário não encontrado ou senha incorreta.';
      } else {
        errorMessage = 'Ocorreu um erro ao efetuar operação.';
        console.log(`Código do erro: ${error.status}, ` + `menssagem: ${error.message}, `);  
      }
          
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };
}
