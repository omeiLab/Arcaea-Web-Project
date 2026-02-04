import cloudscraper
from bs4 import BeautifulSoup
import pandas as pd

def scrape_memory_archive_fixed():
    url = "https://arcaea.fandom.com/wiki/Memory_Archive"
    
    # 建立一個可以繞過 Cloudflare 的 scraper
    scraper = cloudscraper.create_scraper()
    
    print(f"正在連線至: {url} (嘗試繞過 Cloudflare)...")
    try:
        # 使用 scraper 代替 requests
        response = scraper.get(url, timeout=20)
        response.raise_for_status()
    except Exception as e:
        print(f"連線失敗: {e}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 再次確認是否抓到內容（檢查有沒有標題）
    if "Memory Archive" not in soup.title.string:
        print("依然被擋在驗證頁面，請稍後再試或檢查網路。")
        return

    # 抓取包含 wikitable 的表格
    tables = soup.find_all('table', class_='wikitable')
    
    all_dfs = []
    for i, table in enumerate(tables):
        rows = []
        for tr in table.find_all('tr'):
            cells = [td.get_text(separator=" ", strip=True) for td in tr.find_all(['th', 'td'])]
            if cells:
                rows.append(cells)
        
        if len(rows) > 1:
            df = pd.DataFrame(rows[1:])
            if len(rows[0]) == len(df.columns):
                df.columns = rows[0]
            all_dfs.append(df)
            print(f"已成功解析第 {i+1} 個表格")

    if all_dfs:
        final_df = pd.concat(all_dfs, ignore_index=True, sort=False)
        final_df.to_csv("Memory_Archive_Final.csv", index=False, encoding="utf-8-sig")
        print(f"\n任務完成！總共抓取 {len(final_df)} 筆曲目。")
    else:
        print("找到 0 個表格，可能結構有變。")

if __name__ == "__main__":
    scrape_memory_archive_fixed()