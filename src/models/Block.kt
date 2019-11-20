package com.blockchain

import org.apache.commons.codec.digest.DigestUtils
import java.nio.BufferOverflowException
import java.nio.ByteBuffer


class Block() {
    private val version: Int = 0
    private val parent_hash: String = ""
    private val data: String = ""
    private val sec_since_epoc: Int = 0
    val target_zeros: Int = 0
    var nonce: Int = 0

    fun is_valid(): Boolean {
        return version >= 0 &&
                parent_hash.length == 64 &&
                parent_hash.isHex() &&
                sec_since_epoc >= 0 &&
                target_zeros >= 0
    }

    fun get_hash(): ByteArray {
        val data_hash = DigestUtils.sha256(data) //TODO extra nonce

        // https://en.bitcoin.it/wiki/Block_hashing_algorithm
        try {
            // --- Build up byte array to hash ---
            val hashdata = ByteBuffer.allocate(80)
            hashdata.putInt(version)
            hashdata.put(parent_hash.toUpperCase().hexStringToByteArray())
            hashdata.put(data_hash)
            hashdata.putInt(sec_since_epoc)
            hashdata.putInt(target_zeros)
            hashdata.putInt(nonce)

            // --- Build up byte array to hash ---
            //https://www.javacodemonk.com/md5-and-sha-256-in-java-kotlin-and-android-96ed9628s
            return DigestUtils.sha256(hashdata.array())

        } catch (e: BufferOverflowException) {
            println("Buffer Overflow! This is a bug!")
            e.printStackTrace()
            return ByteArray(0)
        }
    }
}


