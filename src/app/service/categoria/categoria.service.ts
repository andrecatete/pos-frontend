import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Appconstants } from 'src/app/helpers/appconstants';
import { retry, catchError, map, take } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { LoginService } from '../login/login.service';
import { Categoria } from 'src/app/model/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  categoriaSelecionado: Categoria;
  constructor(private http: HttpClient,
    private loginService: LoginService) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
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

  CarregarporCategoriaSelecionada(): Observable<any> {
    
    return this.http.get(Appconstants.baseAPIURL + 'categorias/'+ this.categoriaSelecionado, this.ConstroiHeader())
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }

  listar(): Observable<any>{
    this.categoriaSelecionado = undefined;
    return this.http.get<any>(Appconstants.baseAPIURL + 'categorias',this.ConstroiHeader())
      .pipe(
        map(data => data['_embedded']['categoriaProdutoResources']),
        catchError(this.handleError)
      );
  }


  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
      console.log("Erro lado cliente: "+ errorMessage);
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = 'Ocorreu um erro ao efetuar operação.';
      console.log(`Código do erro: ${error.status}, ` + `menssagem: ${error.message}, `);          
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };

}
