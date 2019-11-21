package com.blockchain

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

        var req = SolveRequest(test_block, 100)
        var res = BlockSolver().solve(req)
        assertFalse(res.solved)
        assertEquals(100, res.tries)
    }

    @Test
    fun solve_Solves_Test() {
        //TODO: Should use mock here
        val test_block = Block(2, "648aac5c6332f3a60b0850b160ea3b28c292c1c552f7e13b4319c21e20a8f89b",
            "data", 5, 1, 0)

        var req = SolveRequest(test_block, 10000)
        var res = BlockSolver().solve(req)
        assertTrue(res.solved)
        assertEquals(7, res.nonce)
    }

}