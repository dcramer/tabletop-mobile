develop: setup-git

setup-git:
	pre-commit install
	git config branch.autosetuprebase always
	git config --bool flake8.strict true
