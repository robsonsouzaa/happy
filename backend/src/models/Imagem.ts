import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import Orfanato from './Orfanato';

@Entity('imagem')
export default class Imagem {
  @PrimaryGeneratedColumn('increment')
  id: number;
  
  @Column()
  path: string;

  @ManyToOne(() => Orfanato, orfanato => orfanato.imagens)
  @JoinColumn({ name: 'orfanato_id' })
  orfanato: Orfanato;
}