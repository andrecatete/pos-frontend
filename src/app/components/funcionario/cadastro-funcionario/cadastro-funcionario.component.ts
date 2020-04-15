import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuarioadministrador } from 'src/app/model/usuarioadministrador';
import { AdministradorService } from 'src/app/service/administrador/administrador.service';
import { formatDate } from '@angular/common';
import { LoginService } from 'src/app/service/login/login.service';
import { Router } from '@angular/router';
import { FuncionarioService } from 'src/app/service/funcionario/funcionario.service';
import {  MAT_MOMENT_DATE_FORMATS,  MomentDateAdapter,  MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-cadastro-funcionario',
  templateUrl: './cadastro-funcionario.component.html',
  styleUrls: ['./cadastro-funcionario.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class CadastroFuncionarioComponent implements OnInit {

  funcionario = {} as Usuarioadministrador;
  dateF: Date;

  CPFmask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  Telmask = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/,/\d/,/\d/, '-',/\d/, /\d/, /\d/, /\d/,];
  CEPmask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

  step = 0;
  hide = true;

  constructor(
    private funcionarioService: FuncionarioService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    
    if (this.funcionarioService.funcionarioSelecionado != undefined){
      this.funcionarioService.CarregarporFuncionarioSelecionado().subscribe( data => {
        this.funcionario = data;
        this.funcionario.id = null;
        console.log(data);
        var dateArray = this.funcionario.dataAniversario.split("/");
        this.dateF = new Date(dateArray[1] + "-" + dateArray[0] + "-" + dateArray[2]);
      },
      err => { 
        alert('Ocorreu um erro ao carregar Funcionario!');
        console.error(err);                    
       });
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }


  Salvar(form: NgForm) {

    this.funcionario.dataAniversario = formatDate(this.dateF,"dd/MM/yyyy","en-US");
    this.funcionario.telefoneContato = this.funcionario.telefoneContato.toString().replace("(","").replace(")","").replace("-","");
    this.funcionario.cpf = Number(this.funcionario.cpf.toString().replace(".","").replace(".","").replace("-",""));
    this.funcionario.cepEnderecoPessoal = Number(this.funcionario.cepEnderecoPessoal.toString().replace(".","").replace("-",""));
    this.funcionario.usuarioType = "FUNCIONARIO";
    this.funcionario.enabled = true;
    this.funcionario.usernameAdministrador = this.loginService.username;

    if (this.funcionarioService.funcionarioSelecionado == undefined) {
      
      this.funcionarioService.Cadastrar(this.funcionario).subscribe( data =>  {
        alert('Funcionario cadastrado com sucesso!');  
        this.router.navigate(["home/funcionarios"]);
        }, err => { 
          alert('Ocorreu um erro ao cadastrar funcionario!');
          console.error(err);                    
         }    
       );

    } else {
      this.funcionarioService.Editar(this.funcionarioService.funcionarioSelecionado, this.funcionario).subscribe( data =>  {
        alert('Funcionario alterado com sucesso!');    
        this.router.navigate(["home/funcionarios"]);
        }, err => { 
          alert('Ocorreu um erro ao alterar Funcionario!');
          console.error(err);                    
         }    
       );

    }
     
  }

  retornar(form: NgForm){
    this.router.navigate(["home/funcionarios"]);
  }

}
