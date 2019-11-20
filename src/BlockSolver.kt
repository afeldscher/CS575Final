package com.blockchain

import org.apache.commons.codec.digest.DigestUtils

class BlockSolver() {

    private fun count_leading_0(hash: ByteArray): Int {
        var numZeros: Int = 0
        for(elem in hash) {
            if (elem.compareTo(0) != 0) {
                return numZeros
            }
            numZeros++
        }
        return numZeros
    }

    fun solve(solveRequest: SolveRequest): SolveResponse {
        var tries: Long = 0
        solveRequest.block.nonce = 0

        /* --- Iterate nonce to find hash --- */
        while (tries < solveRequest.max_tries) {
            val hash = solveRequest.block.get_hash()
            val zeros = count_leading_0(hash)

            // --- Check if we have solved ---
            if (zeros >= solveRequest.block.target_zeros) {
                // Success Response
                return SolveResponse(hash.toHex(), solveRequest.block.nonce, tries);
            }
            solveRequest.block.nonce++
            tries++
            //TODO: Handle Nonce Overflow
        }

        // --- Failed response ---
        return SolveResponse(tries)
    }

}