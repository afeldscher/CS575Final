document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.modal');
    let instances = M.Modal.init(elems);
});

function addBlock() {
    const blockData = $('#blockDataTextArea').val();
    $('#blockDataTextArea').val("");
    const guid = uuidv4();
    const parent = 0;
    const nonce = 0;
    // https://github.com/emn178/js-sha256
    const hash = sha256(parent.toString() + blockData + nonce.toString());
    const htmlContent = `   <div class="block col s11 m5 l5">\n` +
    `            <div>\n` +
    `                <div class="input-field"><input class="block-field" type="text" id="guid" disabled="disabled" value="${guid}"><label class="active">Block Id</label></div>\n` +
    `                <div class="input-field"><input class="block-field" type="text" id="parentHash" disabled="disabled" value="${parent}"><label class="active">Parent</label></div>\n` +
    `                <div class="input-field"><textarea class="materialize-textarea data-textarea" id="blockData">${blockData}</textarea><label class="active">Data</label></div>\n` +
    `                <div class="input-field"><input class="block-field" type="text" id="nonce" disabled="disabled" value="${nonce}"><label class="active">Nonce</label></div>\n` +
    `                <div class="input-field"><textarea class="materialize-textarea hash-textarea" id="hash" disabled="disabled">${hash}</textarea><label class="active">Hash</label></div></div>\n` +
    `              <div><button class="waves-effect waves-light btn mine-btn">Mine</button></div>\n` +
    `            </div>\n` +
    `          </div>`;
    $('#blockWrapper').append(htmlContent);
}

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

