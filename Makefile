develop: setup-git install-everything

setup-git:
	pre-commit install
	git config branch.autosetuprebase always
	git config --bool flake8.strict true

install-everything:
	yarn install
	cd ios && pod install
