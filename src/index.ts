import "reflect-metadata";
import {createConnection, Connection} from "typeorm";
import * as rm from 'typed-rest-client/RestClient';
import {User} from "./entity/User";
import {Company} from "./entity/Company";
import {Address} from "./entity/Address"
import {Geo} from "./entity/Geo"


// Uses email to check whether update or create specific user
async function upsertUserFromJSON(connection: Connection, json: User) {
    const geo = new Geo();
    geo.lat = json.address.geo.lat;
    geo.lng = json.address.geo.lng;

    const address = new Address();
    address.street = json.address.street;
    address.suite = json.address.suite;
    address.city = json.address.city;
    address.zipcode = json.address.zipcode;
    address.geo = geo;

    const company = new Company();
    company.name = json.company.name;
    company.catchPhrase = json.company.catchPhrase
    company.bs = json.company.bs;

    const user = new User();
    user.name = json.name;
    user.username = json.username;
    user.email = json.email;
    user.address = address;
    user.phone = json.phone;
    user.website = json.website;
    user.company = company;

    const geoRepository = connection.getRepository(Geo);
    const addressRepository = connection.getRepository(Address);
    const companyRepository = connection.getRepository(Company);
    const userRepository = connection.getRepository(User);
    const userWithSameEmail = await userRepository.findOne({
        where: { email: user.email },
        relations: ["address", "address.geo", "company"],
    });
    if (userWithSameEmail) {
        console.log("User exists. Updating...");

        const loadedGeo = await geoRepository.findOne({ where: geo });
        const loadedAddress = await addressRepository.findOne({
            where: {
                street: address.street,
                suite: address.suite,
                city: address.city
            }
        });
        const loadedCompany = await companyRepository.findOne({ where: company });

        await geoRepository.update(loadedGeo.id, geo);

        address.geo = loadedGeo
        await addressRepository.update(loadedAddress.id, address);

        await companyRepository.update(userWithSameEmail.company.id, company);

        user.address = loadedAddress;
        user.company = loadedCompany;
        await userRepository.update(userWithSameEmail.id, user)
    } else {
        console.log(`Creating new User...`);
        await connection.manager.save(geo);
        await connection.manager.save(address);
        await connection.manager.save(company);
        await userRepository.save(user);
    }
}


createConnection().then(async connection => {
    let client: rm.RestClient = new rm.RestClient(
        "jsonplaceholder",
        "https://jsonplaceholder.typicode.com/",
    );
    let response: rm.IRestResponse<User> = await client.get<User>("/users/1");

    await upsertUserFromJSON(connection, response.result);


    console.log("Loading users from the database...");
    const userRepository = connection.getRepository(User);
    const loadedUser = await userRepository.findOne({
        relations: ["address", "address.geo", "company"]
    });
    console.log("Loaded users: ", loadedUser);

}).catch(error => console.log(error));
