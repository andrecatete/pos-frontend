import { Marca } from './marca';
import { Categoria } from './categoria';

export interface Produto {
  "id": number,
  "descricao": string,
  "mesesGarantia": number,
  "marcaId": number,
  "categoriaId": number,
  "marca": Marca,
  "categoria": Categoria
}
