/**
 * GBS Stage 2 Kernel: DemoOS
 * * 責務: アプリケーションの構成定義とAppCoreへの委譲
 */
class DemoOS {
  constructor(config) {
    this.config = config || {};
    this.CONST = {
      VERSION: 'v1.0.2',
      PAGE_NAME: 'index',
      // ロジックを外部ライブラリとして依存定義
      DEPENDENCIES: ['lib_DemoCore']
    };
  }

  run(e) {
    const appCore = new LibAppCore.AppCore(this);

    if (e.type === 'RPC') {
      return appCore.run(e, globalThis);
    }

    return appCore.render(this.CONST.PAGE_NAME, {
       appTitle: this.config.appTitle,
       version: this.CONST.VERSION,
       dependencies: this.CONST.DEPENDENCIES
    });
  }

  createTemplate(fileName) {
    return HtmlService.createTemplateFromFile(fileName);
  }

}