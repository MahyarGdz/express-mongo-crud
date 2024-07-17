import mongoose from "mongoose";
import { config } from "dotenv";
config();
import { RoleEnum } from "../common/enums/Role.enum";
import Role from "../app/models/role";
import Admin from "../app/models/admin";

const createDefaultAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    const roles = [
      { name: RoleEnum.SUPER_ADMIN, permissions: ["create", "read", "update", "delete"] },
      { name: RoleEnum.EDITOR, permissions: ["read", "update"] },
      { name: RoleEnum.VISITOR, permissions: ["read"] },
    ];

    for (const roleData of roles) {
      let role = await Role.findOne({ name: roleData.name });
      if (!role) {
        role = new Role(roleData);
        await role.save();
        console.log(`${roleData.name} role created`);
      } else {
        console.log(`${roleData.name} role already exists`);
      }
    }

    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    const superAdminRole = await Role.findOne({ name: RoleEnum.SUPER_ADMIN });

    if (!adminExists) {
      const newAdmin = new Admin({
        userName: "defaultAdmin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: superAdminRole?._id,
        isActive: true,
      });

      await newAdmin.save();
      console.log("Default admin created");
    } else {
      console.log("Default admin was created before");
    }
    process.exit(0);
  } catch (err) {
    mongoose.connection.close();
    console.error("Error creating default admin:", err);
    process.exit(1);
  }
};

createDefaultAdmin();
