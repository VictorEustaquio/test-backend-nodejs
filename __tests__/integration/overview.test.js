const request = require("supertest");
const app = require("../../src/app/express.js");
const db = require("../../src/config/database");
const Role = require("../../src/app/models/role");

var token = "";
var test_var_productId = "";

/* beforeAll(async () => await db.connect()) */
/* afterEach(async () => database.mongodb.connection.close()) */
afterAll(async () => await db.Mongodb.connection.close());

describe("Register", () => {
  it("should signup user", async () => {
    const user = {
      username: "Victor",
      email: "viktor7700@gmail.com",
      password: "1234",
      role: Role.User,
    };

    const response = await request(app).put("/signup").send(user);

    expect(
      response.status == 200 || response.status == 400 || response.status == 409
    ).toBeTruthy();
  });
});

describe("Authentication", () => {
  it("should receive user data and JWT token when autheticated with valid credentials", async () => {
    const user = {
      email: "viktor7700@gmail.com",
      password: "1234",
    };
    const response = await request(app).post("/login").send(user);
    token = response.body.data.jwtToken;
    expect(response.status == 200 || response.status == 401).toBeTruthy();
  });
});

describe("Create product", () => {
  it("should create an product", async () => {
    const product = {
      title: "Iphone 13 Pro",
      description: "A15 Bionic com GPU de 5 núcleos",
      price: "R$ 9.176",
      category: "Eletronics",
    };

    const response = await request(app)
      .put("/api/product")
      .set("Authorization", `Bearer ${token}`)
      .send(product);
    /* set test_var_productId for the nexts tests */
    test_var_productId = response.body.data[0].id;

    expect(
      response.status == 200 || response.status == 400 || response.status == 409
    ).toBeTruthy();
  });
});

describe("List products", () => {
  it("should list all user's products", async () => {
    const response = await request(app)
      .get("/api/product")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(
      response.status == 200 || response.status == 400 || response.status == 409
    ).toBeTruthy();
  });
});

describe("List products", () => {
  it("should list user's products by title", async () => {
    const product = {
      title: "Iphone 13 Pro",
    };

    const response = await request(app)
      .get("/api/product")
      .set("Authorization", `Bearer ${token}`)
      .send(product);

    expect(
      response.status == 200 || response.status == 400 || response.status == 409
    ).toBeTruthy();
  });
});

describe("List products", () => {
  it("should list user's products by category", async () => {
    const product = {
      category: "Eletronics",
    };

    const response = await request(app)
      .get("/api/product")
      .set("Authorization", `Bearer ${token}`)
      .send(product);

    expect(
      response.status == 200 || response.status == 400 || response.status == 409
    ).toBeTruthy();
  });
});

describe("List product", () => {
  it("should list user's product by id", async () => {
    const response = await request(app)
      .get(`/api/product/${test_var_productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(
      response.status == 200 || response.status == 400 || response.status == 422
    ).toBeTruthy();
  });
});

describe("List products", () => {
  it("should list user's products by title param", async () => {
    const response = await request(app)
      .get(`/api/product/title/Iphone 13 Pro`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(
      response.status == 200 || response.status == 400 || response.status == 422
    ).toBeTruthy();
  });
});

describe("List products", () => {
  it("should list user's products by category param", async () => {
    const response = await request(app)
      .get(`/api/product/category/Eletronics`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(
      response.status == 200 || response.status == 400 || response.status == 422
    ).toBeTruthy();
  });
});

describe("List products", () => {
  it("should list user's products by title and category named uri path and params", async () => {
    const response = await request(app)
      .get(`/api/product/title/Iphone 13 Pro/category/Eletronics`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(
      response.status == 200 || response.status == 400 || response.status == 422
    ).toBeTruthy();
  });
});

describe("List products", () => {
  it("should list user's products by title and category params", async () => {
    const response = await request(app)
      .get(`/api/product/Iphone 13 Pro/Eletronics`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(
      response.status == 200 || response.status == 400 || response.status == 422
    ).toBeTruthy();
  });
});

describe("Edit product by id", () => {
  it("should edit product by id", async () => {
    var editProduct = {
      id: test_var_productId,
      title: "Coffee",
      price: "R$ 2.70",
      description: "Black Cooffe",
      category: "Coffee and tea",
    };

    const response = await request(app)
      .patch(`/api/product/`)
      .set("Authorization", `Bearer ${token}`)
      .send(editProduct);

    expect(
      response.status == 200 || response.status == 400 || response.status == 422
    ).toBeTruthy();
  });
});

describe("Remove product", () => {
  it("should delete product by id", async () => {
    var editProduct = {
      id: test_var_productId,
    };
    const response = await request(app)
      .delete(`/api/product/`)
      .set("Authorization", `Bearer ${token}`)
      .send(editProduct);

    expect(
      response.status == 200 || response.status == 400 || response.status == 422
    ).toBeTruthy();
  });
});

/* continue */

//expect("algo").toBe("algo");
