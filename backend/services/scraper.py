import requests
from bs4 import BeautifulSoup

def scrape_url(url: str) -> str:
    """Scrape text content from a URL."""
    # Special fast handling for YouTube URLs via oEmbed (retrieves title & channel name instantly)
    if "youtube.com" in url or "youtu.be" in url:
        try:
            oembed_url = f"https://www.youtube.com/oembed?url={url}&format=json"
            response = requests.get(oembed_url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                title = data.get("title", "")
                author = data.get("author_name", "")
                author_url = data.get("author_url", "")
                return f"YouTube Video Info:\nTitle: {title}\nUploaded By (Youtuber/Channel Name): {author}\nChannel Link: {author_url}\nVideo URL: {url}"
        except Exception:
            pass  # Fall back to standard scraper if oEmbed request fails

    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.text, "html.parser")
    
    # Remove scripts, styles, nav, footer, header, and sidebars
    for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
        tag.decompose()
        
    # Decompose comments, sidebars, replies, newsletters, and social sharing widgets
    for selector in [
        "#comments", ".comments", "#respond", ".respond", "#reply", ".reply",
        ".commentlist", ".comment-list", ".comment-respond", ".comment-reply",
        "#sidebar", ".sidebar", ".widget-area", "#widgets", ".widgets",
        ".newsletter", ".subscribe", ".share-buttons", ".social-share"
    ]:
        for tag in soup.select(selector):
            tag.decompose()
            
    text = soup.get_text(separator="\n", strip=True)
    
    # Clean up empty lines
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return "\n".join(lines)
