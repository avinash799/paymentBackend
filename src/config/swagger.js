import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Payment Processing API",
      version: "1.0.0",
      description: "Assignment API documentation"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };