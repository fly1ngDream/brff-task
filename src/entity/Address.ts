import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
} from "typeorm";
import {Geo} from "./Geo";
import {User} from "./User";


@Entity()
export class Address {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    street: string;

    @Column()
    suite: string;

    @Column()
    city: string;

    @Column()
    zipcode: string;

    @ManyToOne(type => Geo, geo => geo.addresses)
    geo: Geo;

    @OneToMany(type => User, user => user.address)
    users: User[];

}
