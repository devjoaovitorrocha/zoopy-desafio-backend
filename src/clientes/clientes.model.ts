import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
} from 'sequelize-typescript';
import { CreationOptional, Optional } from 'sequelize';

export interface ClienteAttributes {
    id: number
    nome: string;
    email: string;
}

interface ClienteCreationAttributes extends Optional<ClienteAttributes, "id"> { }

@Table
export class Cliente extends Model<
    Cliente,
    ClienteCreationAttributes
> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare nome: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare email: string;
}
