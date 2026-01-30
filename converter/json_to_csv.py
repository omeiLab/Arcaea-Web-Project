import pandas as pd

# 讀 JSON
df = pd.read_json("data/song_list.json")

# 儲存成 CSV
df.to_csv("data/song_list.csv", index=False, encoding="utf-8-sig")

print("✅ 已轉成 CSV")
