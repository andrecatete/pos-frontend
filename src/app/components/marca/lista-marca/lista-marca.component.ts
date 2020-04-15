import { Component, OnInit, ViewChild } from '@angular/core';
import { Marca } from 'src/app/model/marca';
import { MarcaService } from 'src/app/service/marca/marca.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-marca',
  templateUrl: './lista-marca.component.html',
  styleUrls: ['./lista-marca.component.css']
})
export class ListaMarcaComponent implements OnInit {

  marcas : Marca[];
  deleteModalRef: BsModalRef;


  @ViewChild('deleteModal', { static: true }) deleteModal;

  constructor(private service : MarcaService,
    private modalService: BsModalService,
    private router: Router){}

  ngOnInit() {
    this.service.listar().subscribe(
      dados => this.marcas = dados,
      );  
  }

  editar(marca : Marca){
    console.log(marca);
    this.service.marcaSelecionada = marca;
    console.log(marca);
    this.router.navigate(["home/cadastromarca"]);
  }

  deletar(marca : Marca){
    this.service.marcaSelecionada = marca;
    this.deleteModalRef = this.modalService.show(this.deleteModal, {class: 'modal-sm'});
  }

  confirm(){
    this.service.remover(this.service.marcaSelecionada).subscribe(
      success => {alert("Marca Removida")  
      this.deleteModalRef.hide();
      this.service.listar().subscribe(
        dados => this.marcas = dados,
        this.marcas = null);
    });
  }
 
  decline(): void {
   this.deleteModalRef.hide();
  }
}
