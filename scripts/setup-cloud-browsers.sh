#!/usr/bin/env bash
# Optional Firefox/WebKit dependencies for this Debian 13 x86_64 cloud image.
# Installs only into /workspace; APT signatures and HTTPS verification stay enabled.
set -euo pipefail
cd /workspace/sareewala
source /etc/os-release
[[ "$ID" == debian && "$VERSION_ID" == 13 && "$(uname -m)" == x86_64 ]] || { echo 'Use Playwright install-deps on your supported local OS instead.' >&2; exit 1; }
export PLAYWRIGHT_BROWSERS_PATH=/workspace/playwright-browsers
npx playwright install firefox webkit
browser_lib_root=/workspace/browser-libs
mkdir -p "$browser_lib_root/apt/lists/partial" "$browser_lib_root/apt/cache/archives/partial" "$browser_lib_root/packages" /workspace/browser-config /workspace/browser-cache
cat > "$browser_lib_root/sources.list" <<'APT'
deb [signed-by=/usr/share/keyrings/debian-archive-keyring.gpg] https://deb.debian.org/debian trixie main
APT
cat > "$browser_lib_root/apt.conf" <<'APT'
Dir::Etc::main "/dev/null";
Dir::Etc::parts "-";
Dir::Etc::sourcelist "/workspace/browser-libs/sources.list";
Dir::Etc::sourceparts "-";
Dir::State::lists "/workspace/browser-libs/apt/lists";
Dir::Cache "/workspace/browser-libs/apt/cache";
APT::Sandbox::User "agent";
APT
export APT_CONFIG="$browser_lib_root/apt.conf"
apt-get update
cd "$browser_lib_root/packages"
apt-get download libgtk-4-1 libgraphene-1.0-0 libharfbuzz-icu0 libmanette-0.2-0 libhyphen0 libgles2 libcairo-script-interpreter2 libhidapi-hidraw0 liblzo2-2
for package in ./*.deb; do dpkg-deb -x "$package" "$browser_lib_root"; done
# Playwright's upstream wrapper sets LD_LIBRARY_PATH to these directories.
# Add missing distro libraries while preserving every bundled browser library.
for destination in "$PLAYWRIGHT_BROWSERS_PATH"/webkit-*/minibrowser-{gtk,wpe}/sys/lib; do
 [[ -d "$destination" ]] || continue
 for library in "$browser_lib_root"/usr/lib/x86_64-linux-gnu/*.so*; do
  [[ -e "$destination/$(basename "$library")" ]] || ln -s "$library" "$destination/$(basename "$library")"
 done
done
printf '%s\n' 'Browser dependencies prepared. Run tests with PLAYWRIGHT_BROWSERS_PATH=/workspace/playwright-browsers XDG_CONFIG_HOME=/workspace/browser-config XDG_CACHE_HOME=/workspace/browser-cache CROSS_BROWSER=true.'
