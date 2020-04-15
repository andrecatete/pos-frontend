import { Component, OnInit } from '@angular/core';
import { Marca } from 'src/app/model/marca';
import { MarcaService } from 'src/app/service/marca/marca.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cadastro-marca',
  templateUrl: './cadastro-marca.component.html',
  styleUrls: ['./cadastro-marca.component.css']
})
export class CadastroMarcaComponent implements OnInit {

  marca = {} as Marca;

  constructor(
    private marcaService: MarcaService,
    private router: Router) { }

  ngOnInit() {
    if (this.marcaService.marcaSelecionada != undefined){
      this.marcaService.CarregarporMarcaSelecionada().subscribe( data => {
        this.marca = data;
        this.marca.id = null;
      },
      err => { 
        alert('Ocorreu um erro ao carregar marca!');
        console.error(err);                    
       });

    }
  }

  salvar(form: NgForm){

    if(this.marcaService.marcaSelecionada != undefined){
      this.marcaService.editar(this.marcaService.marcaSelecionada,this.marca).subscribe(
        data =>  {
          this.router.navigate(["home/marcas"]);
          alert("Dados da marca alterados");
        }
      )
    }else{
      this.marcaService.cadastrar(this.marca).subscribe( data => {
      this.router.navigate(["home/marcas"]);
      alert("Marca cadastrada!");
    }, err =>{
      alert("Erro no cadastro!");
      console.error("Erro: "+err);
    }
  );
}
  }

  retornar(form: NgForm){
    this.router.navigate(["home/marcas"]);
  }

}
