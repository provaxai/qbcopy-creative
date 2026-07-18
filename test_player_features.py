from playwright.sync_api import sync_playwright
import os

SCREENSHOTS_DIR = r"C:\Users\fmtol\qbstudy-clone\screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

def ss(page, name):
    page.screenshot(path=os.path.join(SCREENSHOTS_DIR, name), full_page=True)
    print(f"  saved: {name}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})

    errors = []
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)

    # inject auth
    page.goto("file:///C:/Users/fmtol/qbstudy-clone/index.html", wait_until="domcontentloaded")
    page.evaluate("""() => localStorage.setItem('qbs_user', JSON.stringify({name:'Dev',email:'dev@qbs.com',plan:'pro'}))""")

    page.goto("file:///C:/Users/fmtol/qbstudy-clone/curso-player.html?curso=prf&aula=0", wait_until="domcontentloaded")
    page.wait_for_timeout(800)

    print("\n[1] Conteudo tab (default)")
    ss(page, "feat_01_content.png")
    tab_active = page.locator(".view-tab.active").inner_text()
    print(f"  Active tab: {tab_active.encode('ascii','replace').decode()}")

    print("\n[2] Mapa Mental tab")
    page.locator("#tab-mindmap").click()
    page.wait_for_timeout(400)
    ss(page, "feat_02_mindmap.png")
    root_node = page.locator(".mm-root").inner_text() if page.locator(".mm-root").count() else "NOT FOUND"
    branch_count = page.locator(".mm-branch-col").count()
    leaf_count = page.locator(".mm-leaf").count()
    print(f"  Root: {root_node.encode('ascii','replace').decode()}")
    print(f"  Branches: {branch_count} | Leaves: {leaf_count}")

    print("\n[3] Revisao Socratica tab")
    page.locator("#tab-socratic").click()
    page.wait_for_timeout(400)
    ss(page, "feat_03_socratic_closed.png")
    q_count = page.locator(".socratic-q-block").count()
    print(f"  Socratic questions: {q_count}")

    # open hint on first question
    page.locator(".socratic-actions .btn").first.click()
    page.wait_for_timeout(300)
    ss(page, "feat_04_socratic_hint.png")
    hint_visible = page.locator(".socratic-hint-box.visible").count() > 0
    print(f"  Hint visible after click: {hint_visible}")

    # reveal answer
    page.locator(".socratic-actions .btn").nth(1).click()
    page.wait_for_timeout(300)
    ss(page, "feat_05_socratic_answer.png")
    ans_visible = page.locator(".socratic-answer-box.visible").count() > 0
    print(f"  Answer visible after click: {ans_visible}")

    print("\n[4] Quiz retry mechanic (back to content tab)")
    page.locator("#tab-content").click()
    page.wait_for_timeout(400)

    # answer wrong (option 0 = wrong, correct is 1)
    page.locator(".quiz-option").first.click()
    page.wait_for_timeout(300)
    retry_bar = page.locator(".quiz-retry-bar").count() > 0
    print(f"  Retry bar shown after 1st wrong: {retry_bar}")
    ss(page, "feat_06_quiz_retry_bar.png")

    # click retry
    if retry_bar:
        page.locator(".quiz-retry-bar button").click()
        page.wait_for_timeout(300)
        wrong_classes = page.locator(".quiz-option.wrong").count()
        print(f"  Options reset (wrong count should be 0): {wrong_classes}")
        ss(page, "feat_07_quiz_after_retry.png")

        # answer wrong again (2nd attempt = lock + explanation)
        page.locator(".quiz-option").first.click()
        page.wait_for_timeout(300)
        locked = page.locator(".quiz-option.locked").count()
        feedback_text = page.locator(".quiz-feedback").inner_text()
        print(f"  Locked options after 2nd wrong: {locked}")
        print(f"  Feedback shown: {'Incorreto' in feedback_text or 'Correto' in feedback_text}")
        ss(page, "feat_08_quiz_locked.png")

    print("\n[5] Audio button present")
    audio_btn = page.locator("#audio-btn")
    print(f"  Audio pill visible: {audio_btn.count() > 0}")

    print("\n[6] Navigate to lesson 2 and check mindmap")
    page.locator(".lesson-item").nth(1).click()
    page.wait_for_timeout(500)
    page.locator("#tab-mindmap").click()
    page.wait_for_timeout(400)
    ss(page, "feat_09_lesson2_mindmap.png")
    branch_count2 = page.locator(".mm-branch-col").count()
    print(f"  Lesson 2 mindmap branches: {branch_count2}")

    print(f"\nConsole errors: {len(errors)}")
    for e in errors[:10]:
        print(f"  [error] {e.encode('ascii','replace').decode()}")

    browser.close()

print("\nDone. Screenshots:", SCREENSHOTS_DIR)
