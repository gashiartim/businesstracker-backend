import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Role } from "../../../../api/role/entities/role.entity";

export default class CreateRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values([
        { name: "admin", slug: "admin" },
        { name: "agent", slug: "agent" },
        { name: "patrol", slug: "patrol" },
      ])
      .execute();
  }
}
