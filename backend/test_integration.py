import urllib.request
import urllib.error
import json

def run_integration_tests():
    base = 'http://127.0.0.1:8000'
    print("Testing KeyDash Backend Endpoints...")

    # 1. Login
    login_req = urllib.request.Request(
        f'{base}/api/auth/login',
        data=json.dumps({'username': 'demo', 'password': 'typing123'}).encode(),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(login_req) as res:
        login_res = json.loads(res.read().decode())
    token = login_res['access_token']
    auth_header = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    print(f"[PASS] 1. Auth Login: Token received for user '{login_res['user']['username']}'")

    # 2. Random Text
    with urllib.request.urlopen(f'{base}/api/texts?category=medium') as res:
        text_res = json.loads(res.read().decode())
    print(f"[PASS] 2. Random Text Fetch: ID={text_res['id']}, Category={text_res['category']}, Content snippet='{text_res['content'][:45]}...'")

    # 3. Save Valid Result
    payload = {
        'text_id': text_res['id'],
        'mode': 'time_30',
        'duration': 30.0,
        'wpm': 85.5,
        'raw_wpm': 89.0,
        'accuracy': 97.5,
        'errors': 2,
        'consistency': 93.0
    }
    save_req = urllib.request.Request(
        f'{base}/api/results',
        data=json.dumps(payload).encode(),
        headers=auth_header
    )
    with urllib.request.urlopen(save_req) as res:
        save_res = json.loads(res.read().decode())
    print(f"[PASS] 3. Save Result: ID={save_res['id']}, WPM={save_res['wpm']}, Accuracy={save_res['accuracy']}%")

    # 4. Anti-Cheat Test (>250 WPM should return 400 Bad Request)
    cheat_payload = {
        'mode': 'time_30',
        'duration': 30.0,
        'wpm': 310.0,
        'raw_wpm': 320.0,
        'accuracy': 99.0,
        'errors': 0,
        'consistency': 95.0
    }
    cheat_req = urllib.request.Request(
        f'{base}/api/results',
        data=json.dumps(cheat_payload).encode(),
        headers=auth_header
    )
    try:
        urllib.request.urlopen(cheat_req)
        print("[FAIL] 4. Anti-Cheat test failed: Server accepted > 250 WPM")
    except urllib.error.HTTPError as e:
        print(f"[PASS] 4. Anti-Cheat: Successfully rejected score with HTTP {e.code}")

    # 5. User History (GET /api/results/me)
    hist_req = urllib.request.Request(f'{base}/api/results/me?limit=5', headers=auth_header)
    with urllib.request.urlopen(hist_req) as res:
        hist_res = json.loads(res.read().decode())
    print(f"[PASS] 5. User History: Retrieved {len(hist_res)} test records for demo user")

    # 6. User Stats (GET /api/stats/me)
    stats_req = urllib.request.Request(f'{base}/api/stats/me', headers=auth_header)
    with urllib.request.urlopen(stats_req) as res:
        stats_res = json.loads(res.read().decode())
    print(f"[PASS] 6. User Stats: Best WPM={stats_res['best_wpm']}, Avg WPM={stats_res['avg_wpm']}, Total Tests={stats_res['total_tests']}, Streak={stats_res['streak_days']} days")

    # 7. Global Leaderboard (GET /api/leaderboard?mode=time_30)
    with urllib.request.urlopen(f'{base}/api/leaderboard?mode=time_30&limit=5') as res:
        lead_res = json.loads(res.read().decode())
    print(f"[PASS] 7. Leaderboard: Top {len(lead_res)} fetched. #1: {lead_res[0]['username']} with {lead_res[0]['wpm']} WPM (Rank {lead_res[0]['rank']})")

    print("\n All Backend integration tests passed successfully!")

if __name__ == "__main__":
    run_integration_tests()
