from playwright.sync_api import sync_playwright
import os

SCREENSHOTS_DIR = r"C:\Users\fmtol\qbstudy-clone\screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

def ss(page, name):
    path = os.path.join(SCREENSHOTS_DIR, name)
    page.screenshot(path=path, full_page=True)
    print(f"  saved: {name}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})

    errors = []
    page.on("console", lambda m: errors.append(m) if m.type == "error" else None)

    # --- inject auth ---
    base = "file:///C:/Users/fmtol/qbstudy-clone/index.html"
    page.goto(base, wait_until="domcontentloaded")
    page.evaluate("""() => {
        localStorage.setItem('qbs_user', JSON.stringify({
            name: 'Teste Dev',
            email: 'test@qbstudy.com',
            plan: 'pro'
        }));
    }""")

    # ── 1. cursos-app.html ─────────────────────────────────────────────
    print("\n[1] cursos-app.html")
    page.goto("file:///C:/Users/fmtol/qbstudy-clone/cursos-app.html", wait_until="domcontentloaded")
    page.wait_for_timeout(800)
    ss(page, "cursos_01_grid.png")

    # open PRF modal
    page.locator("button.btn-accent").first.click()
    page.wait_for_timeout(500)
    ss(page, "cursos_02_modal_prf.png")
    modal_visible = page.locator("#course-modal").is_visible()
    print(f"  Modal visible: {modal_visible}")

    # check Iniciar Curso button href (should NOT be alert)
    iniciar_btn = page.locator("#modal-body button.btn-primary").first
    onclick_val = iniciar_btn.get_attribute("onclick")
    print(f"  Iniciar onclick: {onclick_val}")

    # click a lesson item — should navigate to player
    first_lesson = page.locator("#modal-body div[onclick*='curso-player']").first
    count = page.locator("#modal-body div[onclick*='curso-player']").count()
    print(f"  Clickable lesson rows: {count}")
    if count:
        first_lesson.click()
        page.wait_for_timeout(1000)
        print(f"  After click URL: {page.url}")
        ss(page, "cursos_03_player_from_lesson.png")
    else:
        # fallback: click Iniciar Curso
        page.go_back()
        page.wait_for_timeout(500)
        page.locator("button.btn-accent").first.click()
        page.wait_for_timeout(300)
        page.locator("#modal-body button.btn-primary").first.click()
        page.wait_for_timeout(800)
        print(f"  After Iniciar click URL: {page.url}")
        ss(page, "cursos_03_player_from_iniciar.png")

    # ── 2. curso-player.html direct ────────────────────────────────────
    print("\n[2] curso-player.html?curso=prf")
    page.goto("file:///C:/Users/fmtol/qbstudy-clone/curso-player.html?curso=prf", wait_until="domcontentloaded")
    page.wait_for_timeout(1000)
    ss(page, "player_01_initial.png")
    title = page.title().encode("ascii", "replace").decode()
    print(f"  Page title: {title}")

    # lesson count in sidebar
    lesson_count = page.locator(".lesson-item").count()
    print(f"  Sidebar lesson items: {lesson_count}")

    # progress bar visible
    prog = page.locator(".player-progress-fill")
    print(f"  Progress bar visible: {prog.count() > 0}")

    # click second lesson
    if lesson_count > 1:
        page.locator(".lesson-item").nth(1).click()
        page.wait_for_timeout(500)
        ss(page, "player_02_lesson2.png")
        print("  Clicked lesson 2")

    # answer a quiz question
    quiz_opts = page.locator(".quiz-option")
    if quiz_opts.count():
        quiz_opts.first.click()
        page.wait_for_timeout(400)
        ss(page, "player_03_quiz_answered.png")
        print(f"  Answered quiz (options: {quiz_opts.count()})")

    # complete and next
    complete_btn = page.locator("#complete-btn")
    if complete_btn.count() and not complete_btn.is_disabled():
        complete_btn.click()
        page.wait_for_timeout(500)
        ss(page, "player_04_after_complete.png")
        print("  Clicked complete & next")

    # ── 3. prova-oral — disabled button visual ─────────────────────────
    print("\n[3] prova-oral.html — eval button disabled state")
    page.goto("file:///C:/Users/fmtol/qbstudy-clone/prova-oral.html", wait_until="domcontentloaded")
    page.wait_for_timeout(600)
    ss(page, "oral_eval_disabled.png")
    eval_btn = page.locator("#eval-btn")
    is_disabled = eval_btn.is_disabled() if eval_btn.count() else "NOT FOUND"
    print(f"  eval-btn disabled on load: {is_disabled}")

    # ── errors summary ─────────────────────────────────────────────────
    print(f"\nConsole errors: {len(errors)}")
    for e in errors[:10]:
        print(f"  [error] {e.text.encode('ascii','replace').decode()}")

    browser.close()

print("\nDone. Screenshots in:", SCREENSHOTS_DIR)
