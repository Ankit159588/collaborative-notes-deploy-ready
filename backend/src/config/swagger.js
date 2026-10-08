import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Collaborative Notes API",
      version: "1.0.0",
      description: "API documentation for the Collaborative Notes application",
    },
    servers: [
      {
        url: "/",
      },
    ],
  },

  apis: ["./src/router/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
