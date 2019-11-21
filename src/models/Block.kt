package com.blockchain.models

import com.blockchain.hexStringToByteArray
import com.blockchain.isHex
import org.apache.commons.codec.digest.DigestUtils
import java.nio.BufferOverflowException
import java.nio.ByteBuffer


class Block(in_version: Int, in_parent_hash: String, in_data: String, in_sec_since_epoc: Int, in_target_zeros: Int, in_nonce: Int) {
    private val version: Int = in_version
    private val parent_hash: String = in_parent_hash
    private val data: String = in_data
    private val sec_since_epoc: Int = in_sec_since_epoc
    val target_zeros: Int = in_target_zeros
    var nonce: Int = in_nonce

    constructor(): this(0, "", "", 0, 0, 0) {}

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


