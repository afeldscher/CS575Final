package com.blockchain

import io.ktor.http.*
import kotlin.test.*
import io.ktor.server.testing.*
import org.hamcrest.CoreMatchers.startsWith
import org.junit.Assert.assertThat

class ApplicationTest {
    @Test
    fun testStaticFilesServed() {
        withTestApplication({ module(testing = true) }) {
            handleRequest(HttpMethod.Get, "/").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertThat(response.content, startsWith("<!doctype html><html"))
            }
        }
    }
}
