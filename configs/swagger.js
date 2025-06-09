import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options ={
    swaggerDefinition:{
        openapi:"3.0.0",
        info:{
            title: "Find Your Perfect Hotel API",
            version: "1.0.0",
            description: "API para gestion de hoteles",
            contact:{
                name: "DevelopersNewGen",
                email: "developersfyh@gmail.com"
            }
        },
        servers:[
            {
                url: "http://127.0.0.1:3000/FYPH/v1"
            }
        ]
    },
    apis:[
        "./src/auth/auth.routes.js",
        "./src/user/user.routes.js",
        "./src/hotel/hotel.routes.js",
        "./src/room/room.routes.js",
        "./src/event/event.routes.js",
        "./src/reservation/reservation.routes.js",
        "./src/bill/bill.routes.js"
    ]
}

const swaggerDocs = swaggerJSDoc(options)

export { swaggerDocs, swaggerUi}