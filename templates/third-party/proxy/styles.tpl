{assign var="baseFont" value="-apple-system, BlinkMacSystemFont, Segoe UI, Liberation Sans, sans-serif" scope=root}

<style>
	{* CSS reset *}

	*,
	*::after,
	*::before {
		box-sizing: border-box;
	}

	body,
	button,
	input,
	select {
		font-family: {$baseFont};
	}

	html,
	body,
	div,
	span,
	applet,
	object,
	iframe,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	p,
	blockquote,
	pre,
	a,
	abbr,
	acronym,
	address,
	big,
	cite,
	code,
	del,
	dfn,
	em,
	img,
	ins,
	kbd,
	q,
	s,
	samp,
	small,
	strike,
	strong,
	sub,
	sup,
	tt,
	var,
	b,
	u,
	i,
	center,
	dl,
	dt,
	dd,
	ol,
	ul,
	li,
	fieldset,
	form,
	label,
	legend,
	table,
	caption,
	tbody,
	tfoot,
	thead,
	tr,
	th,
	td,
	article,
	aside,
	canvas,
	details,
	embed,
	figure,
	figcaption,
	footer,
	header,
	hgroup,
	main,
	menu,
	nav,
	output,
	ruby,
	section,
	summary,
	time,
	mark,
	audio,
	video {
		margin: 0;
		padding: 0;
		border: 0;
		vertical-align: baseline;
	}

	iframe {
		position: relative;
	}

	article,
	aside,
	details,
	figcaption,
	figure,
	footer,
	header,
	hgroup,
	main,
	menu,
	nav,
	section {
		display: block;
	}

	ol,
	ul {
		list-style: none;
	}

	q,
	blockquote {
		quotes: none;
	}

	blockquote:before,
	blockquote:after,
	q:before,
	q:after {
		content: "";
		content: none;
	}

	a:hover,
	a:active {
		outline: none;
	}

	table {
		border-collapse: collapse;
		border-spacing: 0;
		width: 100% !important;
	}

	{* End of CSS reset *}

	html,
	body {
		width: 100%;
		margin: 0;
		padding: 0;
		border: none;
		position: relative;
	}

	.hidden {
		display: none !important;
	}

	button {
		cursor: pointer;
	}

	.sk-ads-video-player-container {
		top: 100px;
		position: relative;
	}
</style>
