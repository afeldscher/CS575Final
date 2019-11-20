package com.blockchain

// https://gist.github.com/fabiomsr/845664a9c7e92bafb6fb0ca70d4e44fd
// Warning, only capital letters
private val HEX_CHARS = "0123456789ABCDEF"
fun String.hexStringToByteArray() : ByteArray {
    val result = ByteArray(length / 2)
    for (i in 0 until length step 2) {
        val firstIndex = HEX_CHARS.indexOf(this[i]);
        val secondIndex = HEX_CHARS.indexOf(this[i + 1]);

        val octet = firstIndex.shl(4).or(secondIndex)
        result.set(i.shr(1), octet.toByte())
    }
    return result
}

fun String.isHex() : Boolean {
    for (c in this) {
        if (!HEX_CHARS.contains(c, true)) {
            return false
        }
    }
    return true
}

private val HEX_CHAR_ARRY = HEX_CHARS.toCharArray()

fun ByteArray.toHex() : String{
    val result = StringBuffer()

    forEach {
        val octet = it.toInt()
        val firstIndex = (octet and 0xF0).ushr(4)
        val secondIndex = octet and 0x0F
        result.append(HEX_CHAR_ARRY[firstIndex])
        result.append(HEX_CHAR_ARRY[secondIndex])
    }

    return result.toString()
}