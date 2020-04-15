import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Appconstants } from 'src/app/helpers/appconstants';
import { Loja } from 'src/app/model/loja';
import { retry, catchError, map, take } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class LojaService {
  
  lojaSelecionada: Loja;
  constructor(private http: HttpClient,
    private loginService: LoginService) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Accept': 'application/json',
      'Authorization': 'Token token=a16284d038304b5a486525f907387fd6'
    }),
  };

  ConstructHeader(): any {
    return {
      headers: new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Token token=a16284d038304b5a486525f907387fd6'
      }),
    };
  }

  ConstroiHeader(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.loginService.token
      }),
    };
  }

  cadastrar(loja : Loja): Observable<any> {
    
    console.log("retorno loja: "+loja.nome);
    console.log("Token: "+this.loginService.token);
    return this.http.post(Appconstants.baseAPIURL+'lojas', loja, this.ConstroiHeader())
    .pipe(
      retry(0),
      catchError(this.handleError)
    )
  }

  CarregarporLojaSelecionada(): Observable<any> {

    return this.http.get('http://localhost:8080/lojas/'+ this.lojaSelecionada, this.ConstroiHeader())
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }

  
  editar(id,loja: Loja){
    return this.http.put<any>(Appconstants.baseAPIURL + 'lojas/'+id,loja,this.ConstroiHeader())
    .pipe(
      take(1),
      retry(0),
      catchError(this.handleError)
      )
    }
    
    listar(): Observable<Loja[]>{
      return this.http.get<Loja[]>(Appconstants.baseAPIURL + 'lojas?listarProdutos=true',this.ConstroiHeader())
      .pipe(
        map(data => data['_embedded']['lojaResources'])
        );
      }

      listarByLoja(idLoja: number): Observable<any[]>{
        return this.http.get<any[]>(Appconstants.baseAPIURL + 'lojas/'+idLoja+'?listarProdutos=true',this.ConstroiHeader())
        .pipe(
          map(data => data['produtoPrecoSet'])
          );
        }
      
      remover(id){
        console.log("service id é:"+id);
        return this.http.delete(Appconstants.baseAPIURL + 'lojas/'+id,this.ConstroiHeader())
        .pipe(
          take(1),
          retry(0),
          catchError(this.handleError)
          )
        }

        cepService(cep){
          return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?&address="+cep+"&key=AIzaSyADyhSCsRJanNut7UWRfAvhtBdErrRf8Vc")
          .pipe(
            map((result:any)=>{
              console.log(result);
              // console.log("2: "+result.results[0].geometry.location.lat)
              return result.results[0];
           }));
   }
        
        // Manipulação de erros
        handleError(error: HttpErrorResponse) {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // Erro ocorreu no lado do client
            errorMessage = error.error.message;
            console.log("Erro lado cliente: "+errorMessage);
          } else {
            // Erro ocorreu no lado do servidor
            errorMessage = 'Ocorreu um erro ao efetuar operação.';
            console.log(`Código do erro: ${error.status}, ` + `menssagem: ${error.message}, `);          
          }
          console.log(errorMessage);
          return throwError(errorMessage);
        };

        // getEstados(): Observable<any>{
        //   return this.http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/')
        //     .pipe(
        //       retry(0),
        //       catchError(this.handleError)
        //     )
        // }
      }
      