import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from "typeorm";
import { Address } from "./Address";

@Entity()
export class Geo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    lat: string;

    @Column()
    lng: string;

    @OneToMany(type => Address, address => address.geo)
    addresses: Address[];

}
