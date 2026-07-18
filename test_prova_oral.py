from playwright.sync_api import sync_playwright
import os

SCREENSHOTS_DIR = r"C:\Users\fmtol\qbstudy-clone\screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})

    console_msgs = []
    page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text}"))

    # Inject auth via localStorage before the page loads its scripts
    # Navigate to base dir first so localStorage is scoped to file origin
    base_url = "file:///C:/Users/fmtol/qbstudy-clone/index.html"
    page.goto(base_url, wait_until="domcontentloaded")
    page.evaluate("""() => {
        localStorage.setItem('qbs_user', JSON.stringify({
            name: 'Teste Dev',
            email: 'test@qbstudy.com',
            plan: 'pro'
        }));
    }""")

    # Now navigate to the target page
    url = "file:///C:/Users/fmtol/qbstudy-clone/prova-oral.html"
    page.goto(url, wait_until="domcontentloaded")
    page.wait_for_timeout(1800)

    print(f"Current URL: {page.url}")
    print(f"Page title: {page.title()}")

    # Screenshot 1: initial state
    page.screenshot(path=os.path.join(SCREENSHOTS_DIR, "01_initial.png"), full_page=True)
    print("Screenshot 01_initial.png saved")

    # Check for question text
    q_text = page.locator("#q-text").inner_text() if page.locator("#q-text").count() else "NOT FOUND"
    print(f"Question text: {q_text[:120]}")

    # Screenshot 2: click hint button
    hint_btn = page.locator("#hint-toggle")
    if hint_btn.count():
        hint_btn.click()
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(SCREENSHOTS_DIR, "02_hint_open.png"), full_page=True)
        print("Screenshot 02_hint_open.png saved")

    # Screenshot 3: click record button
    rec_btn = page.locator("#rec-btn")
    if rec_btn.count():
        rec_btn.click()
        page.wait_for_timeout(2000)
        page.screenshot(path=os.path.join(SCREENSHOTS_DIR, "03_recording.png"), full_page=True)
        print("Screenshot 03_recording.png saved")

        # Stop recording
        rec_btn.click()
        page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(SCREENSHOTS_DIR, "04_stopped.png"), full_page=True)
        print("Screenshot 04_stopped.png saved")

    # Screenshot 4: click evaluate
    eval_btn = page.locator("#eval-btn")
    eval_disabled = eval_btn.is_disabled() if eval_btn.count() else True
    print(f"Eval button disabled: {eval_disabled}")
    if eval_btn.count() and not eval_btn.is_disabled():
        eval_btn.click()
        page.wait_for_timeout(1800)
        page.screenshot(path=os.path.join(SCREENSHOTS_DIR, "05_feedback.png"), full_page=True)
        print("Screenshot 05_feedback.png saved")

    # Console errors
    print(f"\nConsole messages ({len(console_msgs)} total):")
    for m in console_msgs[:30]:
        print(" ", m.encode("ascii", "replace").decode())

    browser.close()

print("\nScreenshot saved to:", SCREENSHOTS_DIR)
