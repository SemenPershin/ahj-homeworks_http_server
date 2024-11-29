const http = require('http');
const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const uuid = require('uuid');

const app = new Koa();

const ticketsArr =
    [
        { name: "Обед", description: "Приготовить обед", status: true, create: "25.11.2024 10:10", id: 1 },
        { name: "Полить цветы", description: "", status: false, create: "25.11.2024 11:10", id: 2 },
    ]

app.use(koaBody({
    urlencoded: true,
}))

app.use((ctx, next) => {
    ctx.response.set("Access-Control-Allow-Origin", "*")

    try {
        if (JSON.parse(ctx.request.body) == "GET TICKET") {
            ctx.response.body = JSON.stringify(ticketsArr);
            
            return;
        }

        if (JSON.parse(ctx.request.body) != undefined && JSON.parse(ctx.request.body) != "GET TICKET" && JSON.parse(ctx.request.body).request != "STATUS" && JSON.parse(ctx.request.body).request != "DELETE" && JSON.parse(ctx.request.body).request != "EDIT") {
            
            const newTicket = JSON.parse(ctx.request.body);
            let id = 1
            ticketsArr.forEach(element => {
                if (element.id == id) {
                    id++
                } 

            });
            newTicket.id = id;
            ticketsArr.push(newTicket);

            ctx.response.body = JSON.stringify(ticketsArr);
            return
        }

        if (JSON.parse(ctx.request.body).request == "STATUS") {
            ticketsArr.forEach((element) => {
                if (JSON.parse(ctx.request.body).id == element.id) {
                    element.status = !element.status
                    ctx.response.body = JSON.stringify({status: element.status});
                }
            })
            return
        }

        if (JSON.parse(ctx.request.body).request == "DELETE") {
            ticketsArr.some((element, index) => {
                if (JSON.parse(ctx.request.body).id == element.id) {
                    ticketsArr.splice(index, 1)
                    ctx.response.body = JSON.stringify("OK");
                    return true
                }
            })
            return
        }

        if (JSON.parse(ctx.request.body).request == "EDIT") {
            ticketsArr.some((element) => {
                if (JSON.parse(ctx.request.body).id == element.id) {
                    element.name = JSON.parse(ctx.request.body).name;
                    element.description = JSON.parse(ctx.request.body).description;
                    ctx.response.body = JSON.stringify("OK");
                    return true
                }
            })
            return
        }

    } catch (e) {

    }
    
    ctx.response.body = "server response"
    next();
});




const server = http.createServer(app.callback());

const port = 7070;

server.listen(port, () => {
    console.log("Сервер слушает порт: " + port)
})
