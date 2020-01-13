/**
 * Componente para criação de tabelas HTML.
 * @author valdinei reis <valdineimtz@gmail.com>
 * @since 09 de Janeiro de 2020
 * 
 * @example
 * const Table = require('./libs/Table');
 */
class Table {

    /** 
     * Configura a estrutura da tabela.
     * @param {id} id - Atributo ID do elemento.
     * @param {cssclass} cssclass - Classes CSS para formatação da tabela.
     * @param {thead[]} thead - Lista de objetos que compõe o cabeçalho da tabela.
     * @param {appendIn} appendIn - Elemento HTML que receberá a tabela.
     * 
     * @example
     * const myTable = new Table({ 
     *     id: 'tbl-dados',
     *     thead: [
     *         { field: 'nome', label: 'Nome' }, 
     *         { field: 'documento', label: 'Documento' }
     *     ],
     *     appendIn: document.getElementById('tbl-area')
     * });
     */
    constructor({ id = '', cssclass = '', thead = [], appendIn }) {
        this.table = document.createElement("table");
        if (id)       this.setId(id);
        if (cssclass) this.setClass(cssclass);
        if (thead)    this.setTHead(thead);
        if (appendIn) this.appendIn(appendIn);
    }

    /** 
     * Atribui o ID no elemento
     * @param {id} id - atributo ID do elemento.
     */
    setId(id = '') {
        this.id = id;
        this.table.setAttribute('id', this.id);
        return this;
    }

    /** 
     * Atribui a classe CSS a tabela.
     * @param {cssclass} cssclass - Classes CSS para formatação da tabela.
     */
    setClass(cssclass = '') {
        this.cssclass = cssclass;
        this.table.setAttribute('class', this.cssclass);
        return this;
    }

    /** 
     * Atribui o cabeçalho da tabela.
     * @param {thead[]} thead - Lista de objetos que compõe o cabeçalho da tabela.
     * 
     * @example
     * const thead = [
     *     { field: 'nome', label: 'Nome' },
     *     { field: 'documento', label: 'Documento' }
     * ];
     * myTable.setTHead(thead);
     */
    setTHead(thead = []) {
        let header  = this.table.createTHead();
        let headrow = header.insertRow(0);
        headrow.setAttribute('class', 'thead-row');

        this.thead = thead;

        this.thead.forEach(col => {
            let cell = headrow.insertCell();
            cell.innerHTML = col.label;
        });

        return this;
    }

    /** 
     * Atribui o corpo/conteúdo da tabela.
     * @param {tbody} tbody - Lista de objetos representando as linhas da tabela.
     * @param {event} event - Tipo de evento que será executado.
     * @param {callback} callback - Função e callback que será executada.
     * 
     * @example
     * const tbody = [
     *     { nome: "Valdinei Reis", documento: "doc1" },
     *     { nome: "Siluana Oggioni", documento: "doc2" }
     * ];
     * const evento = {
     *     event: 'click',
     *     callback: (dado) => {
     *         console.log('Evento executado', dado);
     *     }
     * };
     * myTable.setTBody(tbody, evento);
     */
    setTBody(tbody = [], { event = '', callback }) {
        this._removeRows();

        let body = this.table.createTBody();

        tbody.forEach(dado => {
            // mapea os campos
            let fields = this.thead.map(t => t.field);
            // converte o objeto em um array
            let obj = Object.entries(dado);

            let bodyrow = body.insertRow();
            bodyrow.setAttribute('class', 'tbody-row');

            // função de callback
            if (event && callback) {
                bodyrow.addEventListener(event, () => callback(dado));
            }

            fields.forEach(field => {
                // busca o campo no objeto com base na coluna da tabela
                let campo = obj.find(o => o[0] == field);

                let cell = bodyrow.insertCell();
                cell.innerHTML = campo ? campo[1] : '';
            });
        });

        return this;
    }

    /** 
     * Adiciona a tabela criada a um elemento.
     * @param {element} element - Elemento HTML que receberá a tabela.
     * 
     * @example
     * myTable.appendIn( document.getElementById('tbl-area') );
     */
    appendIn(element) {
        element.appendChild(this.table);
    }

    /** Remove todas as linhas da tabela. */
    _removeRows() {
        while(this.table.rows.length > 1) this.table.deleteRow(1);
    }

}

module.exports = Table;