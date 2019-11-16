import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany
} from "typeorm";
import {User} from "./User";


@Entity()
export class Company {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    catchPhrase: string;

    @Column()
    bs: string;

    @OneToMany(type => User, user => user.company)
    users: User[];

}
