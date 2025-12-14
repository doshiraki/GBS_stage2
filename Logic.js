/**
 * クライアントからの設定保存要求を処理する (RPC)
 * @param {string} jsonConfig - JSON String of settings
 * @return {string} Success message
 */
function saveSettings(jsonConfig) {
  // ここでバリデーションを実施するのが理想的
  PropertiesService.getScriptProperties().setProperty('CLOCK_CONFIG', jsonConfig);
  return 'OK';
}

/**
 * サーバーの現在時刻を取得する（同期チェック用 - RPC）
 * @return {number} Milliseconds timestamp
 */
function getServerTime() {
  return new Date().getTime();
}
