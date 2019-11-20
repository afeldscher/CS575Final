package com.blockchain

class SolveResponse(in_hash: String, in_nonce: Int, in_tries: Long, in_solved: Boolean) {
    val nonce: Int = in_nonce;
    val tries: Long = in_tries;
    val solved: Boolean = in_solved;
    val hash: String = in_hash

    constructor(in_hash: String, in_nonce: Int, in_tries: Long) : this(in_hash, in_nonce, in_tries, true) {}
    constructor(in_tries: Long) : this("", -1, in_tries, false) {}
}
