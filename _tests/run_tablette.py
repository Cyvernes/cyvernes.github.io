"""Run the browser tests with an installed Chromium browser; no dependencies."""
import argparse
from functools import partial
from html import unescape
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import threading


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--browser', help='Path to Chrome, Chromium or Edge')
    parser.add_argument('--page', default='_tests/tablette.html')
    parser.add_argument('--width', type=int, default=1440)
    parser.add_argument('--height', type=int, default=1800)
    parser.add_argument('--screenshot', action='store_true')
    args = parser.parse_args()
    candidates = [args.browser, shutil.which('chromium'), shutil.which('google-chrome'),
                  r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
                  r'C:\Program Files\Google\Chrome\Application\chrome.exe']
    browser = next((path for path in candidates if path and Path(path).is_file()), None)
    if not browser:
        parser.error('No browser found. Use --browser with the path to Chromium, Chrome or Edge.')
    root = Path(__file__).resolve().parent.parent
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(root)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    artifacts = Path(tempfile.mkdtemp(prefix='causal-tablet-qa-'))
    command = [browser, '--headless=new', '--disable-gpu', '--no-first-run',
               '--disable-extensions', '--disable-background-networking', '--no-proxy-server',
               '--enable-logging=stderr', f'--user-data-dir={artifacts / "profile"}',
               f'--window-size={args.width},{args.height}', '--virtual-time-budget=12000', '--dump-dom']
    if args.screenshot:
        command.append(f'--screenshot={artifacts / "screenshot.png"}')
    command.append(f'http://127.0.0.1:{server.server_port}/{args.page}')
    try:
        result = subprocess.run(command, capture_output=True, timeout=60,
                                creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
    finally:
        server.shutdown()
        server.server_close()
    document = result.stdout.decode('utf-8', errors='replace')
    errors = result.stderr.decode('utf-8', errors='replace')
    (artifacts / 'dom.html').write_text(document, encoding='utf-8')
    (artifacts / 'browser.log').write_text(errors, encoding='utf-8')
    report = re.search(r'<pre id="results">([\s\S]*?)</pre>', document)
    if report:
        print(unescape(report.group(1)))
    for line in errors.splitlines():
        if 'CONSOLE' in line or 'FATAL' in line:
            print(line)
    print(f'Artifacts: {artifacts}')
    if args.page.startswith('_tests/'):
        return 0 if 'data-test-status="passed"' in document else 1
    return result.returncode


if __name__ == '__main__':
    sys.exit(main())
