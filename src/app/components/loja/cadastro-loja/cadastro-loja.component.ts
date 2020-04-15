import { Component, OnInit } from '@angular/core';
import { Loja } from 'src/app/model/loja';
import { LojaService } from 'src/app/service/loja/loja.service';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/service/login/login.service';
import { Router } from '@angular/router';
import { ListaLojasComponent } from '../lista-lojas/lista-lojas.component';
import { BsModalRef } from 'ngx-bootstrap';
import { AlertModalService } from 'src/app/shared/alert-modal.service';

@Component({
  selector: 'app-cadastro-loja',
  templateUrl: './cadastro-loja.component.html',
  styleUrls: ['./cadastro-loja.component.css']
})
export class CadastroLojaComponent implements OnInit {

  loja = {} as Loja;
  listaLoja: ListaLojasComponent;
  bsModalRef: BsModalRef;


  cepInfos: any;


  maskCnpj = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-',/\d/, /\d/,];
  maskTel = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/,/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCep = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

  constructor(
    private lojaService: LojaService,
    private loginService: LoginService,
    private router: Router,
   private alertService: AlertModalService) { }

  ngOnInit() {
    if (this.lojaService.lojaSelecionada != undefined){
      this.lojaService.CarregarporLojaSelecionada().subscribe( data => {
        this.loja = data;
        this.loja.id = null;
        console.log("id da loja: "+this.loja.id);
      },
      err => { 
        alert('Ocorreu um erro ao carregar usuário!');
        console.error(err);
       });

    }
  }

  consultaCEP(cep, form){
    console.log(cep)
    cep = cep.replace(/\D/g, '');

    if(cep !=""){
      var validacep = /^[0-9]{8}$/;

      if(validacep.test(cep)){
        this.lojaService.cepService(cep).subscribe(data => {
          this.populaDadosForm(data, form)
          this.loja.latitude = data.geometry.location.lat;
          this.loja.longitude = data.geometry.location.lng;
          console.log(data)
          console.log("latitude: "+data.geometry.location.lat);
          console.log("latitude: "+data.geometry.location.lng);
        });
        
      }
    }
  }

  populaDadosForm(data, form){
    form.setValue({
      nome: null,
      razaoSocial: null,
      cnpj: null,
      rua: null,
      numero: null,
      bairro: data.address_components[1].long_name,
      cidade: data.address_components[2].long_name,
      estado: data.address_components[3].long_name,
      cep: data.address_components[0].long_name,
      telefone: null,
    })
  }

  salvar(form: NgForm){

    if(this.lojaService.lojaSelecionada != undefined){
      console.log("entrou no salvar parte edição");
      console.log("Loja selecionada: "+this.lojaService.lojaSelecionada)
      this.lojaService.editar(this.lojaService.lojaSelecionada,this.loja).subscribe(
        success =>{this.handleInfo();
          this.retornar(form);}
        //alert("Dados da loja alterados") 
      )
    }else{
    this.loja.emailUsuarioCriadorLoja = this.loginService.username;
    console.log("Loja "+this.loja.nome);
    this.loja.cepEnderecoComercial =  this.loja.cepEnderecoComercial.replace(/\D/g, '');
    this.loja.cnpj = this.loja.cnpj.replace(/\D/g, '');
    this.loja.telefoneContato = this.loja.telefoneContato.replace(/\D/g, ''); 
    this.lojaService.cadastrar(this.loja).subscribe( data => {
      this.retornar(form);
      this.handleSucesso();
      
    }, err =>{
      this.handleError();
      console.error("Esse é o erro: "+err);
    }
  );
}
  }
  retornar(form: NgForm){
    form.reset();
    this.lojaService.lojaSelecionada = null;
    this.router.navigate(["home/lojas"]);
  }


  handleError() {
    this.alertService.showAlertDanger("Ocorreu um erro ao cadastrar a loja. Tente Novamente!");
  };

  handleSucesso() {
    this.alertService.showAlertSucces("Loja cadastrada com sucesso");
  };

  handleInfo() {
    this.alertService.showAlertInfo("Edição da loja realizada!");
  };
}
