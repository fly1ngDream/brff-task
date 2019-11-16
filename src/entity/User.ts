import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";
import {Address} from "./Address";
import {Company} from "./Company";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    email: string;

    @ManyToOne(type => Address, address => address.users)
    address: Address;

    @Column()
    phone: string;

    @Column()
    website: string;

    @ManyToOne(type => Company, company => company.users)
    company: Company;

}
