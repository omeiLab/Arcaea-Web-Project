import pandas as pd

# 讀 CSV
df = pd.read_csv("data/MA.csv", encoding="utf-8-sig", dtype={"constant": str}, keep_default_na=False)

df['side'] = df['side'].replace({0: 'Light', 1: 'Conflict'})
df['image'] = df['image_name'].apply(lambda x: f"images/{x}.webp" if x else "")
df.drop(columns=['image_name'], inplace=True)

json_str = df.to_json(orient="records", force_ascii=False, indent=2)
json_str = json_str.replace("\\/", "/")

# 轉成 JSON（list of dict）
with open("data/MA.json", "w", encoding="utf-8-sig") as f:
    f.write(json_str)

print("✅ 已轉成 JSON")
