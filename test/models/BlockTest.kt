package com.blockchain.models

import com.blockchain.models.Block
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue

class BlockTest {

    @Test
    fun isValid_Valid_Test() {
        val test_block = Block(2, "648aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89b",
            "data", 5, 2, 0)
        assertEquals(true, test_block.is_valid())
    }

    @Test
    fun isValid_BadVersion_Test() {
        val test_block = Block(-1, "648aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89b",
            "data", 5, 2, 0)
        assertEquals(false, test_block.is_valid())
    }

    @Test
    fun isValid_BadParentHash_Test() {
        val test_block = Block(2, "648aac5c6332f3a60b0850b160ea",
            "data", 5, 2, 0)
        assertEquals(false, test_block.is_valid())
    }

    @Test
    fun isValid_BadSecEpoc_Test() {
        val test_block = Block(2, "648aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89b",
            "data", -5, 2, 0)
        assertEquals(false, test_block.is_valid())
    }

    @Test
    fun isValid_BadTarget_Test() {
        val test_block = Block(2, "648aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89b",
            "data", 0, -2, 0)
        assertEquals(false, test_block.is_valid())
    }

    @Test
    fun hash_InvalidLen_Test() {
        val test_block = Block(2, "648aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89baa",
            "data", 0, 2, 0)
        assertEquals(0, test_block.get_hash().size)
    }

    @Test
    fun hash_Two_Equal_Valid_Test() {
        val test_block = Block(2, "648aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89b",
            "data", 0, 2, 0)

        // Assert 2 runs are equal
        val hash1 = test_block.get_hash()
        val hash2 = test_block.get_hash()
        assertTrue(hash1.contentEquals(hash2))
    }

    @Test
    fun hash_Two_Not_Equal_Valid_Test() {
        val test_block = Block(2, "648aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89b",
            "data", 0, 2, 0)

        // Assert 2 runs are equal
        val hash1 = test_block.get_hash()
        test_block.nonce++
        val hash2 = test_block.get_hash()
        assertFalse(hash1.contentEquals(hash2))
    }

}