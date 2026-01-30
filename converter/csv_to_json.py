import pandas as pd

# 讀 CSV
df = pd.read_csv("data/song_list.csv", encoding="utf-8-sig", dtype={"constant": str}, keep_default_na=False)

json_str = df.to_json(orient="records", force_ascii=False, indent=2)
json_str = json_str.replace("\\/", "/")

# 轉成 JSON（list of dict）
with open("data/song_list.json", "w", encoding="utf-8-sig") as f:
    f.write(json_str)

print("✅ 已轉成 JSON")
