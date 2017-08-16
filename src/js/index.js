$(document).ready(function() {

	$('.add').click(onAdd);
	$('.js-livro').click(toggleRemovido);
});

/* add click */
function onAdd(){
	let $li, $label, $div, $input;
	let $list 	= $('.list-livros');
	let el 		= $('.new-book');
	let livro 	= $('.new-book').val();

	// validação simples se o campo não esta vazio 
	if (livro === '') { 
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

	// criar elementos ao inverso
	$label.append($input); 	/* inseri o elemento input dentro do label */
	$label.append(livro); 	/* inseri o valor do input digitado no label */
	$div.append($label); 	/* inseri o label dentro da div */
	$li.append($div); 		/* inseri o div dentro da li */
	$list.append($li); 		/* inseri o li dentro da lista */

	// limpa o campo do input
	el.val('');
}

// click do checkbox
function toggleRemovido(e){
	let $el;

	$el = $(e.currentTarget);
	$el.closest('li').toggleClass('removido');
}