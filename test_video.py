from playwright.sync_api import sync_playwright
import os

SCREENSHOTS_DIR = r"C:\Users\fmtol\qbstudy-clone\screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})

    page.goto("https://www.youtube.com/watch?v=5ywVBKUEstU", wait_until="domcontentloaded")
    page.wait_for_timeout(4000)

    # Get page title and description
    title = page.title()
    print("Title:", title)

    # Try to get video title from page
    try:
        video_title = page.locator("h1.ytd-watch-metadata yt-formatted-string").first.inner_text()
        print("Video title:", video_title)
    except:
        pass

    try:
        desc = page.locator("#description-inline-expander").first.inner_text()
        print("Description:", desc[:500])
    except:
        pass

    # Get all visible text
    try:
        meta = page.locator('meta[name="description"]').get_attribute("content")
        print("Meta description:", meta)
    except:
        pass

    page.screenshot(path=os.path.join(SCREENSHOTS_DIR, "yt_video.png"), full_page=False)
    print("Screenshot saved")

    # Also try to get the page text
    text = page.inner_text("body")
    # Find video title patterns
    lines = [l.strip() for l in text.split('\n') if l.strip() and len(l.strip()) > 5]
    print("\nFirst 40 visible lines:")
    for line in lines[:40]:
        print(" >", line.encode("ascii", "replace").decode())

    browser.close()
