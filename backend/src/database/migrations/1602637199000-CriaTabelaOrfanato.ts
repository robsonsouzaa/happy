import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CriaTabelaOrfanato1602637199000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'orfanato',
      columns: [
        {
          name: 'id',
          type: 'integer',
          unsigned: true,
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'nome',
          type: 'varchar',
        },
        {
          name: 'latitude',
          type: 'decimal',
          precision: 20,
          scale: 10,
        },
        {
          name: 'longitude',
          type: 'decimal',
          precision: 20,
          scale: 10,
        },
        {
          name: 'sobre',
          type: 'text',
        },
        {
          name: 'instrucoes',
          type: 'text',
        },
        {
          name: 'horario_funcionamento',
          type: 'varchar'
        },
        {
          name: 'aberto_fim_semana',
          type: 'boolean',
          default: false,
        }
      ],
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orfanato');
  }

}
