text = open("script.js", encoding="utf-8").read()
i = 0
in_str = None
in_block = False
block_start_line = 0
while i < len(text):
    if in_block:
        end = text.find("*/", i)
        if end == -1:
            print("UNCLOSED block comment starting line", block_start_line)
            break
        i = end + 2
        in_block = False
        continue
    if in_str:
        if text[i] == "\\":
            i += 2
            continue
        if text[i] == in_str:
            in_str = None
        i += 1
        continue
    if text[i : i + 2] == "//":
        nl = text.find("\n", i)
        i = nl + 1 if nl != -1 else len(text)
        continue
    if text[i : i + 2] == "/*":
        block_start_line = text.count("\n", 0, i) + 1
        in_block = True
        i += 2
        continue
    if text[i] in "\"'":
        in_str = text[i]
        i += 1
        continue
    i += 1
else:
    print("all comments closed")
