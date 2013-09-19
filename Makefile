all: compass

compass:
	sass --compass jquery.lichtbrett.scss jquery.lichtbrett.css

watch:
	sass --compass --watch jquery.lichtbrett.scss:jquery.lichtbrett.css