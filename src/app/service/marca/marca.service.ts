import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Appconstants } from 'src/app/helpers/appconstants';
import { Marca } from 'src/app/model/marca';
import { retry, catchError, map, take } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { tokenName } from '@angular/compiler';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  marcaSelecionada: Marca;
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

  cadastrar(marca : Marca): Observable<any> {
    return this.http.post(Appconstants.baseAPIURL+'marcas', marca, this.ConstroiHeader())
    .pipe(
      retry(0),
      catchError(this.handleError)
    )
  }

  CarregarporMarcaSelecionada(): Observable<any> {
    
    return this.http.get(Appconstants.baseAPIURL + 'marcas/'+ this.marcaSelecionada, this.ConstroiHeader())
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }

  editar(id,marca: Marca){
    return this.http.put<any>(Appconstants.baseAPIURL + 'marcas/'+id,marca,this.ConstroiHeader())
      .pipe(
        take(1),
        retry(0),
        catchError(this.handleError)
      )
  }

  listar(): Observable<any>{
    this.marcaSelecionada = undefined;
    return this.http.get<any>(Appconstants.baseAPIURL + 'marcas/enabled',this.ConstroiHeader())
      .pipe(
        map(data => data['_embedded']['marcaProdutoResources']),
        catchError(this.handleError)
      );
  }

  remover(id){
    return this.http.delete(Appconstants.baseAPIURL + 'marcas/'+id,this.ConstroiHeader())
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
