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
import kotlinx.css.CSSBuilder
import kotlinx.html.*
import org.slf4j.event.Level
import java.io.File

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
        get("/") {
            call.respondHtmlTemplate(MainTemplate()) {}
        }
        static("static") {
            var static_dir: String = System.getenv("STATIC_RESOURCES_DIR") ?: "static"
            staticRootFolder = File(static_dir)
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