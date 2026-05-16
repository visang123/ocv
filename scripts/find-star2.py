text = open("script.js", encoding="utf-8").read()
i = 0
while True:
    j = text.find("*/", i)
    if j == -1:
        break
    line = text.count("\n", 0, j) + 1
    ctx = text[max(0, j - 40) : j + 10].replace("\n", "\\n")
    # flag if not at end of comment line pattern
    after = text[j + 2 : j + 20].lstrip()
    before = text[max(0, j - 5) : j]
    if after and after[0] not in ("\n", "\r", " ", ";", ",", ")", "}", "."):
        print("suspicious */ at line", line, repr(ctx))
    i = j + 2
