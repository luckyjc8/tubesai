if ["%~1"] == [""] (GOTO end)
git add .
git commit -m "%~1"
:end