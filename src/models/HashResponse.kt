package com.blockchain.models

import com.blockchain.toHex

class HashResponse(in_hash: String) {
    val hash: String = in_hash
    constructor(in_hash: ByteArray): this(in_hash.toHex())
}
