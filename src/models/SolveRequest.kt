package com.blockchain.models

import com.blockchain.models.Block

class SolveRequest(in_block: Block, in_max_tries: Int) {
    val block: Block = in_block
    val max_tries: Int = in_max_tries

    constructor(): this(Block(), 0) {}
}
