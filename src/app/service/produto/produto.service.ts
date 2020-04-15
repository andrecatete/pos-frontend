import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Appconstants } from 'src/app/helpers/appconstants';
import { retry, catchError, map, take } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { LoginService } from '../login/login.service';
import { Produto } from 'src/app/model/produto';
import { LojasProdutos } from 'src/app/model/lojasProdutos';


@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  produtoSelecionado: Produto;

  idAssociacaoSelecionada: number;

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

  cadastrar(produto : Produto): Observable<any> {
    return this.http.post(Appconstants.baseAPIURL+'produtos', produto, this.ConstroiHeader())
    .pipe(
      retry(0),
      catchError(this.handleError)
    )
  }

  associarComLoja(associacao : LojasProdutos): Observable<any> {
    return this.http.post(Appconstants.baseAPIURL+'lojasProdutos', associacao, this.ConstroiHeader())
    .pipe(
      retry(0),
      catchError(this.handleError)
    )
  }

  CarregarporProdutoSelecionado(): Observable<any> {
    
    return this.http.get(Appconstants.baseAPIURL + 'produtos/'+ this.produtoSelecionado, this.ConstroiHeader())
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }

  listar(): Observable<any>{
    this.produtoSelecionado = undefined;
    return this.http.get<any>(Appconstants.baseAPIURL + 'produtos',this.ConstroiHeader())
      .pipe(
        map(data => data['_embedded']['produtoResources']),
        catchError(this.handleError)
      );
  }

  editarPrecoByLoja(lojaProd: LojasProdutos){
    return this.http.put<any>(Appconstants.baseAPIURL + 'lojasProdutos', lojaProd, this.ConstroiHeader())
    .pipe(
      take(1),
      retry(0),
      catchError(this.handleError)
      )
  }

  removerProdutoLoja(id){
    console.log("service id é:"+id);
        return this.http.delete(Appconstants.baseAPIURL + 'lojasProdutos/'+id,this.ConstroiHeader())
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
      errorMessage = `Ocorreu um erro ao efetuar operação. \n ${error.error.message} `;
      console.log(`Código do erro: ${error.status}, ` + `menssagem: ${error.message}, `);          
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };

}
