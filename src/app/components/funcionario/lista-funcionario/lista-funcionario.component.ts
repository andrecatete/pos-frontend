import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuarioadministrador } from 'src/app/model/usuarioadministrador';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { FuncionarioService } from 'src/app/service/funcionario/funcionario.service';
import { LoginService } from 'src/app/service/login/login.service';

@Component({
  selector: 'app-lista-funcionario',
  templateUrl: './lista-funcionario.component.html',
  styleUrls: ['./lista-funcionario.component.css']
})
export class ListaFuncionarioComponent implements OnInit {
  

  funcionarios: Usuarioadministrador[];
  deleteModalRef: BsModalRef;


  @ViewChild('deleteModal', { static: true }) deleteModal;

  constructor(private loginService : LoginService,
    private service : FuncionarioService,
    private modalService: BsModalService,
    private router: Router){}

  ngOnInit() {
    this.service.listar(this.loginService.username).subscribe(
      dados => this.funcionarios = dados
      );     
  }

  editar(funcionario : Usuarioadministrador){
    this.service.funcionarioSelecionado = funcionario;
    this.router.navigate(["home/cadastrofuncionario"]);
  }

  deletar(funcionario : Usuarioadministrador){
    this.service.funcionarioSelecionado = funcionario;
    this.deleteModalRef = this.modalService.show(this.deleteModal, {class: 'modal-sm'});
  }

  reativar(funcionario : Usuarioadministrador){
    this.service.funcionarioSelecionado = funcionario;
    this.router.navigate(["home/cadastrofuncionario"]);
  }

  confirm(){
    this.service.remover(this.service.funcionarioSelecionado).subscribe(
      success => {alert("Funcionario Removido")  
      this.deleteModalRef.hide();
      this.service.listar(this.loginService.username).subscribe(
        dados => this.funcionarios = dados,
        this.funcionarios = null);
    });
  }
 
  decline(): void {
   this.deleteModalRef.hide();
  }

  formatarStatus(status: boolean): string {
    if (status == true) {
      return "Ativo"
    } else {
      return "Inativo"
    }
    return ''
  }

}
