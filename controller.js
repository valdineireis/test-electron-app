/** Valdinei Reis */
const { remote }   = require('electron');
const activeWindow = remote.BrowserWindow.getFocusedWindow();
const dialog       = remote.dialog;
const path         = require('path');
const Mousetrap    = require('mousetrap');
// files
const fs = require('fs');
const convert = require('xml-js');

const Table = require('./libs/Table');

const myTable = new Table({ 
    id: 'tbl-dados',
    thead: [
        { field: 'nome', label: 'Nome' }, 
        { field: 'cnpj', label: 'CNPJ' },
        { field: 'path', label: 'Local do Arquivo' }
    ],
    appendIn: document.getElementById('tbl-area')
});


document.getElementById('btn-window-minimizar').addEventListener('click', (event) => {
    event.preventDefault();
    activeWindow.minimize();
});;

document.getElementById('btn-window-maximizar').addEventListener('click', (event) => {
    event.preventDefault();
    if (activeWindow.isMaximized()) {
        activeWindow.unmaximize();
    } else {
        activeWindow.maximize();
    }
});;

document.getElementById('btn-window-fechar').addEventListener('click', (event) => {
    event.preventDefault();
    activeWindow.close();
});

Mousetrap.bind('up up down down left right t', () => {
    alert('Valdinei ;)');
});

const btnFilter = document.getElementById('btn-filter');
btnFilter.addEventListener('click', (event) => {
    event.preventDefault();
    
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(result => {

        if (result.filePaths && result.filePaths[0]) {
            document.getElementById('path-folder').innerHTML = '<b>Pasta selecionada: </b>' + result.filePaths[0];

            let files = getFiles(result.filePaths[0]);

            let dados = [];

            files.forEach(file => {
                const xmlFile  = fs.readFileSync(file, 'utf8');
                const options  = { compact: true, spaces: 2 };
                const jsonData = JSON.parse(convert.xml2json(xmlFile, options));
                //console.log( jsonData );
                try {
                    let infNfe = jsonData.nfeProc.NFe.infNFe;
                    dados.push({
                        nrNotaFiscal: infNfe.ide.cNF._text,
                        nome: infNfe.emit.xNome._text,
                        cnpj: infNfe.emit.CNPJ._text,
                        path: file
                    });
                } catch (error) {
                    console.info('file', file);
                    console.warn(error);
                }
            });

            /*myTable.setTBody(dados);*/
            myTable.setTBody(
                dados, 
                {
                    event: 'click',
                    callback: (dado) => {
                        console.log('dado', dado);
                        alert(dado.nrNotaFiscal + ' ' + dado.nome);
                    }
                }
            );
        }
    }).catch(err => {
        console.log(err)
    });
})

/*
function getTableBody(tableId) {
    return document.getElementById(tableId).getElementsByTagName('tbody')[0];
}

function removeTableRows(tableId) {
    let table = document.getElementById(tableId);
    while(table.rows.length > 1) table.deleteRow(1);
}

function addTableRow(tableId, { nrNotaFiscal, nome, cnpj, path }) {
    let tableRef     = getTableBody(tableId);
    let newRow       = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = `<td>${tableRef.rows.length}</td><td>${nrNotaFiscal}</td><td>${nome}</td><td>${cnpj}</td><td>${path}</td>`;
}
*/

function getFiles(dir, files_) {
    files_    = files_ || [];
    let files = fs.readdirSync(dir);
    files.forEach(file => {
        let name = path.join(dir, file);

        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            if (!validateExtensionXml(name)) return;
            files_.push(name);
        }
    });
    return files_;
}

function validateExtensionXml(element) {
    let extName = path.extname(element);
    return extName === '.xml';
};