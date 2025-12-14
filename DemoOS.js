/**
 * 🕰️ DemoOS Kernel (Analog Clock)
 * ロジック分離モデルの実装サンプル
 */
class DemoOS {
  constructor(config) {
    this.config = config || {};
    this.CONST = {
      PAGE_NAME: 'index',
      // ロジックファイルを依存関係として定義
      DEPENDENCIES: ['lib_analog_clock'] 
    };
  }

  run(e) {
    const appCore = new LibAppCore.AppCore(this);

    if (e.type === 'RPC') {
      const fileName = e.parameter.args.file;
      return appCore.run(e, globalThis);
    }

    return appCore.render(this.CONST.PAGE_NAME, {
       appTitle: 'GBS World Clock',
       dependencies: this.CONST.DEPENDENCIES
    });
  }

  createTemplate(fileName) {
    return HtmlService.createTemplateFromFile(fileName);
  }
}