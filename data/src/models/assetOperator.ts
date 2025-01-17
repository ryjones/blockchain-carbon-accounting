import type { 
  AssetOperatorInterface 
} from '@blockchain-carbon-accounting/oil-and-gas-data-lib';
import {
  Column, Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
  Check
} from 'typeorm';
import { OilAndGasAsset } from './oilAndGasAsset';
import { Operator } from './operator';

@Entity({name: 'asset_operator'})
@Unique(['assetUuid', 'operatorUuid', 'from_date' ])
@Unique(['assetUuid', 'operatorUuid', 'thru_date' ])
@Index(['assetUuid', 'operatorUuid'], { unique: true, where: `"thru_date" IS NULL` })
@Check('"share" >= 0')
@Check('"share" <= 1')
export class AssetOperator implements AssetOperatorInterface {

  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column()
  class!: string;

  @PrimaryColumn()
  assetUuid!: string;

  @ManyToOne(() => OilAndGasAsset, (asset) => asset.asset_operators)
  @JoinColumn({name: 'assetUuid'})
  asset!: OilAndGasAsset;

  @PrimaryColumn()
  operatorUuid!: string;

  @ManyToOne(() => Operator, (operator) => operator.asset_operators)
  @JoinColumn({name: 'operatorUuid'})
  //@JoinTable()
  operator!: Operator;

  @Column({type: 'double precision', nullable:true})
  share!: number;

  @Column({type: 'timestamp'})
  from_date!: Date;

  @Column({type: 'timestamp', nullable: true})
  thru_date?: Date;

  public static toRaw(v: AssetOperator) {
    return { ...v };
  }
  public static toRaws(v: AssetOperator[]) {
    return v.map(v => AssetOperator.toRaw(v));
  }
}