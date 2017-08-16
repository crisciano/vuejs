$(document).ready(function() {

	$('.add').click(onAdd);
	$('.js-livro').click(toggleRemovido);
});

/* add click */
function onAdd(){
	let $li, $label, $div;
	let el 		= $('.new-book');
	let list 	= $('.list-livros');
	let livro 	= $('.new-book').val();

	// validação simples se o campo não esta vazio 
	if (livro === '') { 
		alert('campo vazio!!');
		return; 
	}
	
	// inclui o elemento li dentro do ul
	$li 	= $('<li>').appendTo(list);
	// add class checkbox e inclui o elemento li dentro da div
	$div 	= $('<div>').addClass('checkbox').appendTo($li); 
	// add a div dentro do label
	$label 	= $('<label>').appendTo($div);

	$('<input>')
		.attr({ type: 'checkbox', name: 'list' })
		.addClass('js-livro')
		.click(toggleRemovido)
		.appendTo($label);

	$label.append(livro);

	// limpa o campo do input
	el.val('');
}

// click do checkbox
function toggleRemovido(e){
	let $el;

	$el = $(e.currentTarget);
	$el.closest('li').toggleClass('removido');
}