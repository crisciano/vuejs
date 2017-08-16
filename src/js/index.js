
// vue

// simples array
let data = {
	livros: ['livro um - autor 1', 'livro dois - autor 2'],
	titulo: 'Livros 2',
	novoLivro: '',
	novoAutor: ''
}

let dataNew = { 
    livros: [{ titulo: 'Orange is The New Black', autor: 'Piper Kerman', checked: true },    
            { titulo: 'A Origem das Espécies', autor: 'Charles Darwin', checked: false }], 
    titulo: 'Livros Preferidos', 
    novoLivro: '',
    novoAutor: ''
  };

// instanciando um new vue
new Vue({
	el: '#vue',
	data: data
});

new Vue({
	el: '#app',
	data: dataNew,
	methods: {
		newBook: function(){
			let titulo = this.novoLivro.trim();
			let autor = this.novoAutor.trim();
			if(titulo && autor){
				this.livros.push({
					titulo: titulo,
					autor: autor,
					checkbox: false
				});
				this.novoLivro = '';
				this.novoAutor = '';
			}
		}
	}
});

// js
$(document).ready(function() {
	$('.add').click(onAdd);
	$('.js-livro').click(toggleRemovido);
});

/* add click */
function onAdd(){
	let $li, $label, $div, $input, $big, $small;
	let $list 	= $('.list-livros');
	let elBook	= $('.new-book');
	let elAutor = $('.new-autor');
	let livro 	= elBook.val();
	let autor 	= elAutor.val();

	// validação simples se o campo não esta vazio 
	if (livro === '' && auto === '') { 
		alert('campo vazio!!');
		return; 
	}

	// list> li > div.checkbox > label > input

	//cria o elemento li 
	$li 	= $('<li>');
	// cria a div 
	$div 	= $('<div>').addClass('checkbox');
	// cria label
	$label 	= $('<label>');
	//cria o input
	$input 	= $('<input>').attr({ type: 'checkbox',name: 'list'})
		.addClass('js-livro').click(toggleRemovido);
	// cria big
	$big 	= $('<big>');
	// cria small
	$small 	= $('<small>');

	// criar elementos ao inverso
	$big.append(livro);  	/* inseri o valor do livro no elemento big */
	$small.append(autor); 	/* inseri o valor do autor no elemento small  */
	$label.append($input); 	/* inseri o elemento input dentro do label */
	$label.append($big); 	/* inseri o elemento big no elemento label */
	$label.append(' - '); 	/* cria um elemento separador */
	$label.append($small); 	/* inseri o elemento small no elemento label */
	$div.append($label); 	/* inseri o label dentro da div */
	$li.append($div); 		/* inseri o div dentro da li */
	$list.append($li); 		/* inseri o li dentro da lista */

	// limpa o campo do livro
	elBook.val('');
	// limpa o campo de autor
	elAutor.val('');
}

// click do checkbox
function toggleRemovido(e){
	let $el;

	$el = $(e.currentTarget);
	$el.closest('li').toggleClass('removido');
}