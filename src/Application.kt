package com.blockchain

import io.ktor.application.Application
import io.ktor.application.ApplicationCall
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.client.HttpClient
import io.ktor.client.engine.apache.Apache
import io.ktor.features.CORS
import io.ktor.features.CallLogging
import io.ktor.html.Placeholder
import io.ktor.html.Template
import io.ktor.html.insert
import io.ktor.html.respondHtmlTemplate
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.content.*
import io.ktor.request.path
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.routing
import kotlinx.css.*
import kotlinx.html.*
import org.slf4j.event.Level
import java.io.File
import io.ktor.html.insert as insert1

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

    val client = HttpClient(Apache) {
    }

    routing {
//        get("/styles.css") {
//            call.respondCss {
//                body {
//                    backgroundColor = Color.red
//                }
//                p {
//                    fontSize = 2.em
//                }
//                rule("p.myclass") {
//                    color = Color.blue
//                }
//            }
//        }
        get("/") {
            call.respondHtmlTemplate(MainTemplate()) {
                content { +"Add a block" }
            }
        }
        static("static") {
            staticRootFolder = File("static")
            files("css")
            files("js")
            file("image.png")
            default("index.html")
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

class MainTemplate (val modal: AddItemModalTemplate = AddItemModalTemplate()): Template<HTML> {
    val content = Placeholder<HtmlBlockTag>()
    override fun HTML.apply() {
        head {
            styleLink("/static/styles.css")
            styleLink("https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css")
            script(src = "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js") {}
            script(src = "/static/script.js") {}
            title { +"SE 575 Blockchain Project" }
        }
        body {
            this@apply.insert(modal) {}
        }
    }
}

class AddItemModalTemplate : Template<HTML> {
    override fun HTML.apply() {
        body {
            a("#addItemModal", classes = "waves-effect waves-light btn modal-trigger") {
                +"Add a block"
            }
            div(classes = "modal") {
                id = "addItemModal"
                div(classes = "modal-content") {
                    h4 { +"Add a block" }
                    textArea {
                        id = "blockDataTextArea"
                        classes += "materialize-textarea"
                    }
                    label { +"Block Data" }
                }
                div(classes = "modal-footer") {
                    a("#!", classes = "modal-close waves-effect waves-green btn-flat") { +"Add" }
                }
            }
        }
    }
}
