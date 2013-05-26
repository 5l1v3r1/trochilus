dev:
	supervisor server.js
deploy:
	node server.js 2>&1 > /dev/null &
	
