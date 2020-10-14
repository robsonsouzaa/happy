import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CriaTabelaImagem1602641329645 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'imagem',
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
          name: 'path',
          type: 'varchar',
        },
        {
         name: 'orfanato_id',
         type: 'integer' 
        }
      ],
      foreignKeys: [
        {
          name: 'ImagemOrfanato',
          columnNames: ['orfanato_id'],
          referencedTableName: 'orfanato',
          referencedColumnNames: ['id'],
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      ]
    }))
  }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('imagem');
    }

}
