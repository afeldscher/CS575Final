package com.blockchain

import com.blockchain.blockutils.BlockSolver
import com.blockchain.models.Block
import com.blockchain.models.HashResponse
import com.blockchain.models.SolveRequest
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.CORS
import io.ktor.features.CallLogging
import io.ktor.features.ContentNegotiation
import io.ktor.gson.gson
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.*
import io.ktor.request.path
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.post
import io.ktor.routing.routing
import org.slf4j.event.Level
import java.text.DateFormat

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {
    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.path().startsWith("/") }
    }

    install(CORS) {
        method(HttpMethod.Options)
        method(HttpMethod.Put)
        method(HttpMethod.Delete)
        method(HttpMethod.Patch)
        header(HttpHeaders.Authorization)
        header("Content-Type")
        allowCredentials = true
        anyHost() // @TODO: Don't do this in production if possible. Try to limit it.
    }

    install(ContentNegotiation) {
        gson {
            setDateFormat(DateFormat.LONG)
            setPrettyPrinting()
        }
    }

    routing {
        post("/solve") {
            val solve_req = call.receive<SolveRequest>()
            if (!solve_req.block.is_valid()) {
                call.respond(HttpStatusCode.BadRequest, "The block provided is not valid")
            } else {
                call.respond(BlockSolver().solve(solve_req))
            }
        }

        post("/hash") {
            val block = call.receive<Block>()
            if (!block.is_valid()) {
                call.respond(HttpStatusCode.BadRequest, "The block provided is not valid")
            } else {
                call.respond(HashResponse(block.get_hash()))
            }
        }

        static {
            resource("/", "static/index.html")

            static("/static") {
                resources("static/static")
            }
        }
    }
}