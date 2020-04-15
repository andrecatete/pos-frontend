import { Component, OnInit, ViewChild, Directive, Input } from '@angular/core';
import { Loja, ProdutoPrecoSet } from 'src/app/model/loja';
import { Produto } from 'src/app/model/produto';
import { LojaService } from 'src/app/service/loja/loja.service';
import { ProdutoService } from 'src/app/service/produto/produto.service';
import { NgForm, FormGroup, FormBuilder, NgControl } from '@angular/forms';
import { LojasProdutos } from 'src/app/model/lojasProdutos';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AlertModalService } from 'src/app/shared/alert-modal.service';

@Component({
  selector: 'app-associa-lojaproduto',
  templateUrl: './associa-lojaproduto.component.html',
  styleUrls: ['./associa-lojaproduto.component.css']
})

export class AssociaLojaprodutoComponent implements OnInit {

  resetar: boolean;

  associacao= {} as LojasProdutos;
  lojaPreco: any;
  produtos: Produto[];
  lojas: Loja[];

  editProfileForm: FormGroup;
  modalRef: BsModalRef;

  @ViewChild('editPrecoModal', { static: true }) editPrecoModal;
  @ViewChild('deleteModal', { static: true }) deleteModal;

  constructor(private lojaService: LojaService,
    private produtoService: ProdutoService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private alertService: AlertModalService) { }

  ngOnInit() {
    this.lojaService.listar().subscribe(dados => {
      this.lojas = dados;
      console.log(dados);
    });

    this.produtoService.listar().subscribe(dados => {
      this.produtos = dados;
    });

    this.editProfileForm = this.fb.group({
      precoAntigo: [''],
      precoNovo: ['']
    });

  }

  openModal(targetModal,loja) {
    this.modalService.show(this.editPrecoModal, {class: 'modal-sm'});
    this.associacao.idProduto= loja.produtoResource.id
    this.editProfileForm.patchValue({
      precoAntigo: loja.preco,
      precoNovo: '',
     });
     this.editProfileForm.get('precoAntigo').disable();
    }

    onSubmit() {
      // console.log("Loja: "+this.associacao.idLoja);
      // console.log("Preço novo: "+this.associacao.preco);
      // console.log("ID do produto: "+this.associacao.idProduto);
      
      console.log("res:", this.editProfileForm.getRawValue());
      this.associacao.preco =  this.editProfileForm.value['precoNovo'];
      this.produtoService.editarPrecoByLoja(this.associacao).subscribe(
        success =>{ this.alertService.showAlertSucces("Preço Alterado com sucesso!");
      },err=>{
        this.alertService.showAlertDanger("Alteração não pôde ser realizada!");
      })
      this.listarProdutosLoja();
      this.resetar = true;
      // this.modalService.hide(1);
     }

  listarProdutosLoja(){
      this.lojaService.listarByLoja(this.associacao.idLoja).subscribe(dados => {
        this.lojaPreco = dados;
        console.log(dados);
        this.retornar;
      });
  }    

  salvar(form: NgForm){
    // console.log("Loja: "+this.associacao.idLoja);
    // console.log("Produto: "+this.associacao.idProduto);
    // console.log("Preco: "+this.associacao.preco);

    this.produtoService.associarComLoja(this.associacao).subscribe( data => {
      alert("Produto cadastrado!");
      form.reset();
    }, err =>{
      alert(err);
      console.error("Erro: "+ err);
    });
  }

  removeAssociacao(id:number){
    this.produtoService.idAssociacaoSelecionada = id;
    this.modalRef = this.modalService.show(this.deleteModal, {class: 'modal-sm'});
  }

  confirmRemocaoAssoc(){
    this.produtoService.removerProdutoLoja(this.produtoService.idAssociacaoSelecionada).subscribe(
      success => {alert("Produto desassociado com sucesso!!!")  
      this.modalRef.hide();
      this.listarProdutosLoja();
    });
  }

  retornar(form: NgForm){
    form.reset();
  }
}