import random
import datetime
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import User, Text, Result

# 70+ Diverse high quality texts
TEXT_DATA = [
    # --- EASY WORDS (simple lowercase, frequent English vocabulary, flow practice) ---
    {"category": "easy", "difficulty": "easy", "content": "the quick brown fox jumps over the lazy dog near the quiet river bank"},
    {"category": "easy", "difficulty": "easy", "content": "time and tide wait for no man as the sun rises over the quiet hill"},
    {"category": "easy", "difficulty": "easy", "content": "water flows down the green mountain into a peaceful crystal blue lake"},
    {"category": "easy", "difficulty": "easy", "content": "practice every single day to build muscle memory and increase your finger speed"},
    {"category": "easy", "difficulty": "easy", "content": "learning to code opened new doors to build creative tools and helpful apps"},
    {"category": "easy", "difficulty": "easy", "content": "fresh morning air brings new energy and clear focus for the work ahead"},
    {"category": "easy", "difficulty": "easy", "content": "birds sing in the tall trees while the gentle wind moves through the forest"},
    {"category": "easy", "difficulty": "easy", "content": "a warm cup of coffee on a rainy morning helps start a productive day"},
    {"category": "easy", "difficulty": "easy", "content": "simple habits done consistently create remarkable progress over time"},
    {"category": "easy", "difficulty": "easy", "content": "keep your fingers light on the keyboard and look ahead at upcoming letters"},
    {"category": "easy", "difficulty": "easy", "content": "books carry timeless ideas across generations and inspire thoughtful minds"},
    {"category": "easy", "difficulty": "easy", "content": "sound of rain against the window glass brings a calm feeling of peace"},
    {"category": "easy", "difficulty": "easy", "content": "walking outside under the blue sky refreshes both the mind and spirit"},
    {"category": "easy", "difficulty": "easy", "content": "good design is obvious while great design is completely transparent and effortless"},
    {"category": "easy", "difficulty": "easy", "content": "bright stars sparkle across the night sky above the quiet sleeping town"},
    {"category": "easy", "difficulty": "easy", "content": "teamwork makes big ambitious goals achievable through shared effort and trust"},
    {"category": "easy", "difficulty": "easy", "content": "listen carefully before speaking and observe details others might easily miss"},
    {"category": "easy", "difficulty": "easy", "content": "every long journey begins with a single bold and purposeful first step"},

    # --- MEDIUM SENTENCES (Standard punctuation, mixed cases, natural phrasing) ---
    {"category": "medium", "difficulty": "medium", "content": "Consistency is far more important than intensity when mastering touch typing."},
    {"category": "medium", "difficulty": "medium", "content": "Modern web development blends functional logic, interactive design, and responsive layouts."},
    {"category": "medium", "difficulty": "medium", "content": "Software engineers solve complex puzzles by breaking them down into smaller manageable pieces."},
    {"category": "medium", "difficulty": "medium", "content": "The mechanical keyboard clicked with a satisfying tactile rhythm as paragraphs flowed onto the screen."},
    {"category": "medium", "difficulty": "medium", "content": "Curiosity and perseverance are two of the most valuable traits a programmer can nurture."},
    {"category": "medium", "difficulty": "medium", "content": "Clean architecture ensures that systems remain maintainable, scalable, and easy to understand."},
    {"category": "medium", "difficulty": "medium", "content": "Fast typing allows your thoughts to translate directly into code without friction or mental delay."},
    {"category": "medium", "difficulty": "medium", "content": "Great user interfaces anticipate what the user wants to accomplish and remove unnecessary friction."},
    {"category": "medium", "difficulty": "medium", "content": "Distributed databases provide fault tolerance and high availability across global network clusters."},
    {"category": "medium", "difficulty": "medium", "content": "The morning sunlight poured through the studio window, illuminating the wooden desk and monitor."},
    {"category": "medium", "difficulty": "medium", "content": "Continuous integration pipelines run automated test suites to catch regressions before deployment."},
    {"category": "medium", "difficulty": "medium", "content": "Understanding data structures like hash tables and binary trees helps optimize algorithmic performance."},
    {"category": "medium", "difficulty": "medium", "content": "Writing clean documentation saves countless hours for team members collaborating on large codebases."},
    {"category": "medium", "difficulty": "medium", "content": "The art of debugging involves systematic elimination of hypotheses until the root cause is revealed."},
    {"category": "medium", "difficulty": "medium", "content": "Open source software powers the modern internet, fueled by passionate developers worldwide."},
    {"category": "medium", "difficulty": "medium", "content": "Responsive design requires thoughtful typography, fluid grid layouts, and dynamic media queries."},
    {"category": "medium", "difficulty": "medium", "content": "Effective communication between engineers and designers turns ambitious ideas into polished products."},
    {"category": "medium", "difficulty": "medium", "content": "Developing spatial awareness across the keyboard helps you maintain speed without glancing down."},

    # --- HARD (Punctuation, numbers, symbols, camelCase, technical syntax) ---
    {"category": "hard", "difficulty": "hard", "content": "In 2026, over 85% of developers utilize AI tools like GitHub Copilot (v2.4) & FastAPI." },
    {"category": "hard", "difficulty": "hard", "content": "const calculateWPM = (chars: number, seconds: number): number => Math.round((chars / 5) / (seconds / 60));" },
    {"category": "hard", "difficulty": "hard", "content": "SELECT user_id, COUNT(*) AS tests, AVG(wpm) FROM results WHERE created_at >= '2026-01-01' GROUP BY user_id;" },
    {"category": "hard", "difficulty": "hard", "content": "IPv6 addresses use 128-bit blocks (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334) for 3.4x10^38 unique IPs!" },
    {"category": "hard", "difficulty": "hard", "content": "HTTP/3 uses QUIC protocol over UDP port 443; reducing handshake latency by ~50-70%." },
    {"category": "hard", "difficulty": "hard", "content": "docker run -d -p 8080:80 --name web_app -v /var/data:/app/data:ro nginx:alpine-3.19" },
    {"category": "hard", "difficulty": "hard", "content": "Refactoring regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,63}$/ for strict email validation." },
    {"category": "hard", "difficulty": "hard", "content": "System benchmarks: Latency = 12.4ms (p99: 48.2ms), Memory = 512MB, Throughput = 4,250 req/sec @ 99.98% uptime." },
    {"category": "hard", "difficulty": "hard", "content": "export interface KeyboardEvent<T = Element> extends UIEvent<T> { readonly key: string; readonly code: string; }" },
    {"category": "hard", "difficulty": "hard", "content": "Error 404: Object at 'api/v1/users/94021?include_metadata=true&sort=desc' returned [NullPointerException]." },
    {"category": "hard", "difficulty": "hard", "content": "Calculus identity: d/dx [e^(3x) * sin(2x)] = 3e^(3x)*sin(2x) + 2e^(3x)*cos(2x); verify for x = 0.5." },
    {"category": "hard", "difficulty": "hard", "content": "git commit -m \"fix(auth): handle JWT expiry tokens (#481)\" && git push origin main --tags" },
    {"category": "hard", "difficulty": "hard", "content": "const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]; const trace = matrix.reduce((acc, row, i) => acc + row[i], 0);" },
    {"category": "hard", "difficulty": "hard", "content": "SHA-256 hash digest: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (empty string)." },
    {"category": "hard", "difficulty": "hard", "content": "Speed test target: >= 115.5 WPM, 98.7% accuracy, <= 2 errors on #100-character challenges." },
    {"category": "hard", "difficulty": "hard", "content": "CSS rule: @media (min-width: 768px) and (max-width: 1024px) { .grid-container { grid-template-columns: repeat(3, 1fr); } }" },
    {"category": "hard", "difficulty": "hard", "content": "JSON payload: {\"status\": 200, \"success\": true, \"data\": {\"id\": \"usr_882\", \"tags\": [\"pro\", \"vip\"]}}" },
    {"category": "hard", "difficulty": "hard", "content": "Algorithm complexity: O(n * log(n)) quicksort vs O(n^2) bubble sort on n = 10,000 randomized integers." },

    # --- QUOTES (Famous literature, philosophy, technology, motivation) ---
    {"category": "quotes", "difficulty": "medium", "content": "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. — Steve Jobs"},
    {"category": "quotes", "difficulty": "medium", "content": "Programs must be written for people to read, and only incidentally for machines to execute. — Harold Abelson"},
    {"category": "quotes", "difficulty": "medium", "content": "Simplicity is prerequisite for reliability. — Edsger W. Dijkstra"},
    {"category": "quotes", "difficulty": "medium", "content": "It does not matter how slowly you go as long as you do not stop. — Confucius"},
    {"category": "quotes", "difficulty": "medium", "content": "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. — Martin Fowler"},
    {"category": "quotes", "difficulty": "medium", "content": "In the middle of difficulty lies opportunity. — Albert Einstein"},
    {"category": "quotes", "difficulty": "medium", "content": "First, solve the problem. Then, write the code. — John Johnson"},
    {"category": "quotes", "difficulty": "medium", "content": "Talk is cheap. Show me the code. — Linus Torvalds"},
    {"category": "quotes", "difficulty": "medium", "content": "Knowledge is power, but enthusiasm pulls the switch. — Ivern Ball"},
    {"category": "quotes", "difficulty": "medium", "content": "Make it work, make it right, make it fast. — Kent Beck"},
    {"category": "quotes", "difficulty": "medium", "content": "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt"},
    {"category": "quotes", "difficulty": "medium", "content": "Code is like humor. When you have to explain it, it’s bad. — Cory House"},
    {"category": "quotes", "difficulty": "medium", "content": "The secret of getting ahead is getting started. — Mark Twain"},
    {"category": "quotes", "difficulty": "medium", "content": "Experience is the name everyone gives to their mistakes. — Oscar Wilde"},
    {"category": "quotes", "difficulty": "medium", "content": "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away. — Antoine de Saint-Exupéry"},
    {"category": "quotes", "difficulty": "medium", "content": "There are only two hard things in Computer Science: cache invalidation and naming things. — Phil Karlton"},
    {"category": "quotes", "difficulty": "medium", "content": "Stay hungry, stay foolish. — Whole Earth Catalog"},
    {"category": "quotes", "difficulty": "medium", "content": "You miss 100% of the shots you don't take. — Wayne Gretzky"}
]

# 15 Fake leaderboard users with diverse names and styles
LEADERBOARD_USERS = [
    {"username": "CyberTyper", "base_wpm": 124.0, "acc": 99.2},
    {"username": "KeyNinja", "base_wpm": 118.5, "acc": 98.6},
    {"username": "QuantumKeys", "base_wpm": 112.0, "acc": 97.8},
    {"username": "SwiftFinger", "base_wpm": 105.4, "acc": 98.1},
    {"username": "CherryBlue", "base_wpm": 99.8, "acc": 96.5},
    {"username": "LunaClick", "base_wpm": 94.2, "acc": 99.0},
    {"username": "VortexType", "base_wpm": 89.6, "acc": 97.4},
    {"username": "SpeedyDev", "base_wpm": 84.0, "acc": 95.8},
    {"username": "PBTKeycap", "base_wpm": 79.5, "acc": 96.2},
    {"username": "PixelPulse", "base_wpm": 74.8, "acc": 94.9},
    {"username": "NovaShift", "base_wpm": 69.2, "acc": 95.1},
    {"username": "MatrixRider", "base_wpm": 64.5, "acc": 93.8},
    {"username": "CoffeeAndCode", "base_wpm": 58.0, "acc": 92.5},
    {"username": "LazyCaret", "base_wpm": 52.4, "acc": 91.0},
    {"username": "TypoMaster", "base_wpm": 46.8, "acc": 88.5},
]

MODES = ["time_15", "time_30", "time_60", "time_120", "words_10", "words_25", "words_50"]

def seed_database():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if texts already populated
        existing_text_count = db.query(Text).count()
        if existing_text_count < len(TEXT_DATA):
            print(f"Seeding {len(TEXT_DATA)} practice texts...")
            for item in TEXT_DATA:
                # check if exists
                exists = db.query(Text).filter(Text.content == item["content"]).first()
                if not exists:
                    text_obj = Text(
                        content=item["content"],
                        category=item["category"],
                        difficulty=item["difficulty"]
                    )
                    db.add(text_obj)
            db.commit()
            print("Texts seeded successfully.")

        # Seed Demo User
        demo_user = db.query(User).filter(User.username == "demo").first()
        if not demo_user:
            print("Creating demo user: 'demo'")
            demo_user = User(username="demo")
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

        # Seed Leaderboard Users
        print("Seeding leaderboard users and realistic match records...")
        user_objects = [demo_user]
        for u_data in LEADERBOARD_USERS:
            u = db.query(User).filter(User.username == u_data["username"]).first()
            if not u:
                u = User(username=u_data["username"])
                db.add(u)
                db.commit()
                db.refresh(u)
            user_objects.append(u)

        # Seed realistic test results across multiple modes and past 14 days
        all_texts = db.query(Text).all()
        now = datetime.datetime.utcnow()

        for u_idx, u in enumerate(user_objects):
            # Check existing results count for this user
            count = db.query(Result).filter(Result.user_id == u.id).count()
            if count >= 10:
                continue

            # Determine base speed
            if u.username == "demo":
                base_speed = 78.0
                base_acc = 96.5
            else:
                user_meta = next((item for item in LEADERBOARD_USERS if item["username"] == u.username), None)
                base_speed = user_meta["base_wpm"] if user_meta else 65.0
                base_acc = user_meta["acc"] if user_meta else 95.0

            # Generate tests across last 10 days
            for day_offset in range(9, -1, -1):
                test_date = now - datetime.timedelta(days=day_offset, hours=random.randint(1, 18), minutes=random.randint(0, 59))
                # 1 to 3 tests per day for demo to have a continuous streak!
                num_tests = random.randint(2, 4) if u.username == "demo" else random.randint(1, 2)
                for _ in range(num_tests):
                    mode_choice = random.choice(MODES)
                    # Duration
                    if mode_choice.startswith("time_"):
                        dur = float(mode_choice.split("_")[1])
                    else:
                        word_count = int(mode_choice.split("_")[1])
                        # roughly calculate duration based on wpm
                        dur = round((word_count / (base_speed / 60.0)) + random.uniform(-2, 3), 1)
                        dur = max(dur, 4.0)

                    wpm_variation = random.uniform(-6.0, 7.0)
                    wpm = round(max(20.0, min(180.0, base_speed + wpm_variation)), 1)
                    raw_wpm = round(wpm + random.uniform(1.0, 5.0), 1)
                    acc = round(max(85.0, min(100.0, base_acc + random.uniform(-3.0, 2.5))), 1)
                    errs = random.randint(0, 5)
                    cons = round(max(70.0, min(99.0, 92.0 + random.uniform(-8.0, 6.0))), 1)

                    text_pick = random.choice(all_texts) if all_texts else None

                    res = Result(
                        user_id=u.id,
                        text_id=text_pick.id if text_pick else None,
                        mode=mode_choice,
                        duration=dur,
                        wpm=wpm,
                        raw_wpm=raw_wpm,
                        accuracy=acc,
                        errors=errs,
                        consistency=cons,
                        created_at=test_date
                    )
                    db.add(res)
            db.commit()

        print("Database seeded successfully with users, texts, and results!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
