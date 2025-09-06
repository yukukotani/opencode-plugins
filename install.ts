// ./plugins の内容を $HOME/.config/opencode/plugin/ にコピーする Bun スクリプト

const home = Bun.env.HOME ?? process.env.HOME;
if (!home) {
  console.error("HOME 環境変数が見つかりませんでした。");
  process.exit(1);
}

const srcDir = "./plugins";
const destDir = `${home}/.config/opencode/plugin`;

try {
  // 出力先ディレクトリを作成（存在していてもOK）
  await Bun.$`mkdir -p ${destDir}`;

  // plugins 配下の全ファイル・ディレクトリをコピー（ドットファイル含む）。
  // 既存は上書きするが、dest にしかないファイルは削除しない
  await Bun.$`cp -R ${srcDir}/. ${destDir}/`;
  console.log(`✅ Copied plugins to: ${destDir}`);
  await Bun.$`ls -la ${destDir}`;
} catch (err) {
  console.error("コピー中にエラーが発生しました:", err);
  process.exit(1);
}
