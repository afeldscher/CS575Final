package com.blockchain

import com.blockchain.models.Block
import com.blockchain.models.HashResponse
import com.blockchain.models.SolveRequest
import io.ktor.application.Application
import io.ktor.application.ApplicationCall
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.client.HttpClient
import io.ktor.client.engine.apache.Apache
import io.ktor.features.CORS
import io.ktor.features.CallLogging
import io.ktor.features.ContentNegotiation
import io.ktor.gson.gson
import io.ktor.html.Template
import io.ktor.html.insert
import io.ktor.html.respondHtmlTemplate
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.*
import io.ktor.request.path
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.routing
import kotlinx.css.CSSBuilder
import kotlinx.html.*
import org.slf4j.event.Level
import java.io.File
import java.text.DateFormat
import org.apache.commons.codec.digest.DigestUtils


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
        header("MyCustomHeader")
        allowCredentials = true
        anyHost() // @TODO: Don't do this in production if possible. Try to limit it.
    }

    val client = HttpClient(Apache) {}

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

fun FlowOrMetaDataContent.styleCss(builder: CSSBuilder.() -> Unit) {
    style(type = ContentType.Text.CSS.toString()) {
        +CSSBuilder().apply(builder).toString()
    }
}

fun CommonAttributeGroupFacade.style(builder: CSSBuilder.() -> Unit) {
    this.style = CSSBuilder().apply(builder).toString().trim()
}

suspend inline fun ApplicationCall.respondCss(builder: CSSBuilder.() -> Unit) {
    this.respondText(CSSBuilder().apply(builder).toString(), ContentType.Text.CSS)
}


//START HTML Templates
class MainTemplate : Template<HTML> {
    override fun HTML.apply() {
        head {
            styleLink("/static/styles.css")
            styleLink("https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css")
            script(src = "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js") {}
            script(src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js") {}
            script(src = "https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js") {}
            script(src = "/static/script.js") {}
            title { +"SE 575 Blockchain Project" }
        }
        body {
            nav {
                div(classes = "nav-wrapper") {
                    a("#", classes = "brand-logo") {
                        +"Blockchain Simulator"
                    }
                }
            }
            div(classes = "container") {
                insert(HeaderRowTemplate()) {}
                div("row") {
                    id = "blockWrapper"
                }
            }
            insert(AddItemModalTemplate()) {}
        }
    }
}

class HeaderRowTemplate : Template<HtmlBlockTag> {
    override fun HtmlBlockTag.apply() {
        div(classes = " header-row row") {
            div(classes = "col s4") {
                a("#addItemModal", classes = "waves-effect waves-light btn modal-trigger") {
                    +"Add a block"
                }
            }
        }
    }
}

class AddItemModalTemplate : Template<HtmlBlockTag> {
    override fun HtmlBlockTag.apply() {
        div(classes = "modal") {
            id = "addItemModal"
            div(classes = "modal-content") {
                h4 { +"Add a block" }
                div ("input-field add-block-textarea-wrapper"){
                    textArea(classes = "materialize-textarea") {
                        id = "blockDataTextArea"
                    }
                    label("active") {  +"Block Data" }
                }
            }
            div(classes = "modal-footer") {
                a("#!", classes = "modal-close waves-effect waves-green btn-flat") {
                    onClick = "addBlock($('#blockDataTextArea').val())"
                    +"Add"
                }
            }
        }
    }
}