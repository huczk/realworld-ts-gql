import { Connection } from "typeorm";

import { connectTestDB, gCall } from "../../tests";

import { Profile } from "../entity";

let conn: Connection;

beforeAll(async () => {
  try {
    conn = await connectTestDB();
  } catch (e) {
    console.log({ e });
  }
});

afterAll(async () => {
  await conn?.close();
});

const registerMutation = `
mutation register($input: RegisterInput!) {
  register(input: $input) {
    username
    email
  }
}
`;

describe("Register", () => {
  it("create user", async () => {
    const fakeUser = {
      email: "some@mail.com",
      password: "password",
      username: "User",
    };

    console.log({ conn });

    const response = await gCall({
      source: registerMutation,
      variableValues: {
        input: fakeUser,
      },
    });

    console.log(response);

    expect(response).toMatchObject({
      data: {
        register: { username: fakeUser.username, email: fakeUser.email },
      },
    });

    const profile = await Profile.findOne({ where: { email: fakeUser.email } });
    expect(profile).toBeDefined();
    expect(profile?.username).toBe(fakeUser.username);
  });
});
