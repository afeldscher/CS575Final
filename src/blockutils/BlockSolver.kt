package com.blockchain.blockutils

import com.blockchain.models.SolveRequest
import com.blockchain.models.SolveResponse
import com.blockchain.toHex
import org.apache.commons.codec.digest.DigestUtils

class BlockSolver() {

    // Public for test only
    fun count_leading_0(hash: ByteArray): Int {
        var numZeros: Int = 0
        for(elem in hash) {
            val octet = elem.toInt()
            // Get the two hex digits of the byte
            val firstNib = (octet and 0xF0).ushr(4) // will be an int 0 - 15
            val secondNib = octet and 0x0F

            // Check first nibble
            if (firstNib != 0) {
                return numZeros
            } else {
                numZeros++
            }

            // Check second nibble
            if (secondNib != 0) {
                return numZeros
            } else {
                numZeros++
            }
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