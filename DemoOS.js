/**
 * 🕰️ DemoOS Kernel (Analog Clock)
 * ロジック分離モデルの実装サンプル
 */
class DemoOS {
  constructor(config) {
    this.config = config || {};
    this.CONST = {
      PAGE_NAME: 'index',
      VERSION: 'v2.1.0',
      // 📦 描画ロジックを持つライブラリを定義
      // これにより 'lib_analog_clock.html' が自動ロードされる
      DEPENDENCIES: ['lib_analog_clock']
    };
  }

  run(e) {
    const appCore = new LibAppCore.AppCore(this);

    // RPC: 時刻同期リクエスト
    if (e.type === 'RPC') {
      const fileName = e.parameter.args.file;
      return appCore.run(e, this._getInjectData(fileName), globalThis);
    }

    // 初回レンダリング
    return appCore.render(this.CONST.PAGE_NAME, {
       appTitle: 'GBS Analog Clock',
       dependencies: this.CONST.DEPENDENCIES
    });
  }

  // 初期データ注入 (サーバー起動時刻)
  _getInjectData(fileName) {
    if (fileName === this.CONST.PAGE_NAME) {
      return {
        // タイムスタンプ(ミリ秒)で渡す
        serverTimestamp: new Date().getTime()
      };
    }
    return {};
  }

  createTemplate(fileName) {
    return HtmlService.createTemplateFromFile(fileName);
  }
}
