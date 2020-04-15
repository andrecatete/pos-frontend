import { Marca } from './marca';
import { Categoria } from './categoria';

export interface Loja {
    id:number;
    nome: string;
    razaoSocial: string;
    cnpj: string;
    ruaEnderecoComercial: string;
    numeroEnderecoComercial: string;
    bairroEnderecoComercial: string;
    cidadeEnderecoComercial: string;
    estadoEnderecoComercial: string;
    cepEnderecoComercial: string;
    telefoneContato: string;
    emailUsuarioCriadorLoja: string;
    latitude: string;
    longitude: string;
    produtoPrecoSet: ProdutoPrecoSet[];
}

export interface ProdutoPrecoSet {
    produtoResource: ProdutoResource;
    preco: number;
}

export interface ProdutoResource {
    id: number;
    nome: string;
    descricao: string;
    mesesGarantia: number;
    marca: Marca;
    categoria: Categoria;
}