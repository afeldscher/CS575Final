package com.blockchain.blockutils

import com.blockchain.hexStringToByteArray
import com.blockchain.models.Block
import com.blockchain.models.SolveRequest
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class BlockSolverTest {

    @Test
    fun solve_Timeout_Test() {
        //TODO: Should use mock here
        val test_block = Block(2, "648aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89b",
            "data", 5, 2, 0)

        val req = SolveRequest(test_block, 100)
        val res = BlockSolver().solve(req)
        assertFalse(res.solved)
        assertEquals(100, res.tries)
    }

    @Test
    fun solve_Solves_Test() {
        //TODO: Should use mock here
        val test_block = Block(2, "648aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89b",
            "data", 5, 1, 0)

        val req = SolveRequest(test_block, 10000)
        val res = BlockSolver().solve(req)
        assertTrue(res.solved)
        assertEquals(2, res.nonce)
    }

    @Test
    fun count_leading_0_0test() {
        val hash = "648aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89b".hexStringToByteArray()
        val res = BlockSolver().count_leading_0(hash)
        assertEquals(0, res)
    }

    @Test
    fun count_leading_0_00test() {
        val hash = "608aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89b".hexStringToByteArray()
        val res = BlockSolver().count_leading_0(hash)
        assertEquals(0, res)
    }

    @Test
    fun count_leading_0_1test() {
        val hash = "048aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89b".hexStringToByteArray()
        val res = BlockSolver().count_leading_0(hash)
        assertEquals(1, res)
    }

    @Test
    fun count_leading_0_2test() {
        val hash = "008aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89b".hexStringToByteArray()
        val res = BlockSolver().count_leading_0(hash)
        assertEquals(2, res)
    }

}