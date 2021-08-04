USER=$(shell find . -maxdepth 1 -name index.html  -printf %u)


tags: *.js
	umask 077; if [ "`id -un`" = "$(USER)" ] ; then ctags *.js; else env -i setuidgid $(USER) ctags *.js; fi

update:
	umask 077; if [ "`id -un`" = "$(USER)" ] ; then git pull; else env -i setuidgid $(USER) git pull; fi
	chmod -R a=rX,u=wr *.html *.js *.css *.txt *.png *.json LICENSE README.md Makefile
	chmod 700 .git

publish: tags
	git commit -a || true
	git push
