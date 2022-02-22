import { BasicPost } from '../../shared-interfaces';

export class NewsPost implements BasicPost {
  tags!: string; // Para busquedas
  // Para busquedas
  relatedTo!: string[]; // Post relacionados
  // Post relacionados
  title?: string;
  slug?: string;
  shortDesc?: string;
  content?: string;
  mainImg!: string;
  creationDate!: Date;
  lastUpdate!: Date;
}
