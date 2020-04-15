import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/service/login/login.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Usuarioadministrador } from 'src/app/model/usuarioadministrador';
import { AdministradorService } from 'src/app/service/administrador/administrador.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 
  IsAdmin = false;
  IsFuncionario = false;
  IsLogado = false;  

 dadosAdministrador: Usuarioadministrador;

  deleteModalRef: BsModalRef;
  @ViewChild('deleteModal', { static: true }) deleteModal;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private modalService: BsModalService,
    private administradorService: AdministradorService) { }

  ngOnInit() {
    if (this.loginService.IsAuthenticate) {
      //TODO: Validar perfil
      this.IsAdmin = true;
      this.IsFuncionario = false;
      this.IsLogado = true;

      
    } else {
      this.IsAdmin = false;
      this.IsFuncionario = false;
      this.IsLogado = false;
      // this.router.navigate(["/home"]);
    }       

  }

  desativarAdmin(){
    this.deleteModalRef = this.modalService.show(this.deleteModal, {class: 'modal-md'});
    this.administradorService.CarregarporUsernameLogado().subscribe( data =>  {
      console.log(data);    
      this.dadosAdministrador = data;
      console.log("Dados do admin: "+this.dadosAdministrador.nome);
    })
    console.log("dados admin: "+this.dadosAdministrador.id);
  }

  confirm(){
    this.administradorService.Excluir(this.dadosAdministrador).subscribe(
      success => {alert("Sua conta foi desativada")  
      this.deleteModalRef.hide();
      this.logout();

      });
  }

  decline(){
      this.deleteModalRef.hide();
      }

  logout() {
     this.IsLogado = false;
     this.IsFuncionario = false;
     this.IsAdmin = false; 
     
     this.loginService.Logout();

    //TODO: Fazer chamada logout
    // this.loginService.logout().subscribe( data =>  {  
    //    alert('Usuario saiu do sistema!')
    //    }, err => { 
    //     alert('Ocorreu um erro ao efetuar logout!')
    //      console.log(err);
    //     }    
    // );
  }

}